import { GoogleGenAI, Chat, Type, GenerateContentResponse } from '@google/genai';

// ==================== INTERFACES ====================

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: Date
}

interface ConversationContext {
  userId: string
  sessionId: string
  userProfile?: UserProfile
  marketContext?: MarketContext
}

interface UserProfile {
  consumo: number // kWh/mês
  tensao: number // kV
  tipo: 'INDUSTRIAL' | 'COMERCIAL' | 'RURAL' | 'RESIDENCIAL'
  tarifaAtual: number // R$/kWh
  submercado: 'SUDESTE' | 'SUL' | 'NORDESTE' | 'NORTE'
}

interface MarketContext {
  pldAtual: number
  tendencia: 'ALTA' | 'BAIXA' | 'ESTAVEL'
  volatilidade: number
}

interface EligibilityResult {
  eligible: boolean
  type: 'ACL' | 'ACL_ESPECIAL' | 'CATIVO'
  requirements: string[]
  missingSteps: string[]
  estimatedTimeline: string
  savings: number
}

interface SimulationParams {
  consumo: number
  tarifaAtual: number
  perfil: 'CONSTANTE' | 'PONTA_FORA_PONTA' | 'SAZONAL'
  submercado: string
}

interface EconomyReport {
  currentCost: number
  estimatedCostFreeMkt: number
  monthlySavings: number
  annualSavings: number
  savingsPercentage: number
  migrationCosts: number
  paybackMonths: number
  roi: number
  assumptions: string[]
}

interface ContractAnalysis {
  summary: string
  pricePerMWh: number
  term: string
  flexibility: string
  penalties: string[]
  risks: string[]
  recommendation: string
  score: number
}

interface Requirement {
  item: string
  status: 'COMPLETE' | 'PENDING' | 'NOT_REQUIRED'
  description: string
}

interface Timeline {
  totalDays: number
  phases: Phase[]
}

interface Phase {
  name: string
  duration: number
  tasks: string[]
}

// ==================== AI ASSISTANT ====================

export class AIAssistant {
  private googleAI: GoogleGenAI;
  private chatSessions: Map<string, Chat> = new Map();
  private conversationHistory: Map<string, Message[]> = new Map();
  private readonly MAX_HISTORY = 20;

  constructor() {
    this.googleAI = new GoogleGenAI({
      apiKey: process.env.API_KEY,
    });
  }

  // ==================== CHAT ====================

  async chat(message: string, context?: ConversationContext): Promise<string> {
    const sessionId = context?.sessionId || 'default';
    
    // Manage local history for summarization
    const localHistory = this.conversationHistory.get(sessionId) || [];
    localHistory.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    // Get or create a new Gemini chat session
    let chatSession = this.chatSessions.get(sessionId);
    if (!chatSession) {
      const systemPrompt = this.buildSystemPrompt(context);
      chatSession = this.googleAI.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: systemPrompt,
        },
      });
      this.chatSessions.set(sessionId, chatSession);
    }

    try {
      const response: GenerateContentResponse = await chatSession.sendMessage({ message });
      const reply = response.text;

      // Update local history
      localHistory.push({
        role: 'assistant',
        content: reply,
        timestamp: new Date()
      });
      this.conversationHistory.set(sessionId, localHistory.slice(-this.MAX_HISTORY));

      return reply;
    } catch (error) {
      console.error('Erro no chat com Gemini:', error);
      return 'Desculpe, ocorreu um erro. Tente novamente.';
    }
  }

  private buildSystemPrompt(context?: ConversationContext): string {
    let prompt = `Você é um assistente especializado em mercado livre de energia no Brasil.

Suas responsabilidades:
- Explicar conceitos sobre mercado livre de energia
- Ajudar na análise de elegibilidade
- Simular economia na migração
- Analisar contratos de energia
- Dar recomendações personalizadas

Seja sempre:
- Claro e objetivo
- Use linguagem técnica quando apropriado
- Cite números e dados quando possível
- Seja honesto sobre limitações`

    if (context?.userProfile) {
      const profile = context.userProfile
      prompt += `

Perfil do usuário:
- Consumo: ${profile.consumo.toLocaleString('pt-BR')} kWh/mês
- Tipo: ${profile.tipo}
- Tensão: ${profile.tensao} kV
- Tarifa atual: R$ ${profile.tarifaAtual.toFixed(3)}/kWh
- Submercado: ${profile.submercado}`
    }

    if (context?.marketContext) {
      const market = context.marketContext
      prompt += `

Contexto de mercado:
- PLD atual: R$ ${market.pldAtual.toFixed(2)}/MWh
- Tendência: ${market.tendencia}
- Volatilidade: ${(market.volatilidade * 100).toFixed(1)}%`
    }

    return prompt
  }

  clearHistory(sessionId: string): void {
    this.chatSessions.delete(sessionId);
    this.conversationHistory.delete(sessionId);
  }

  async summarizeConversation(sessionId: string): Promise<string> {
    const history = this.conversationHistory.get(sessionId) || [];
    
    if (history.length === 0) {
      return 'Nenhuma conversa para resumir.';
    }

    const conversationText = history
      .map(m => `${m.role}: ${m.content}`)
      .join('\n\n');

    const prompt = `Resuma esta conversa em 2-3 parágrafos, destacando os pontos principais:\n\n${conversationText}`;

    const response = await this.googleAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { temperature: 0.3 }
    });

    return response.text;
  }

  // ==================== ELEGIBILIDADE ====================

  async analyzeEligibility(data: UserProfile): Promise<EligibilityResult> {
    const { consumo, tensao, tipo } = data

    // Critérios de elegibilidade
    const minConsumoACL = 500 // kW (500.000 W)
    const minConsumoACLEspecial = 2500 // kW
    const consumoKW = consumo / 730 // Converter kWh/mês para kW médio

    let eligible = false
    let eligibilityType: 'ACL' | 'ACL_ESPECIAL' | 'CATIVO' = 'CATIVO'
    const requirements: string[] = []
    const missingSteps: string[] = []

    // Verificar ACL Especial (consumidores especiais)
    if (consumoKW >= minConsumoACLEspecial || tensao >= 69) {
      eligible = true
      eligibilityType = 'ACL_ESPECIAL'
      requirements.push('✅ Consumo acima de 2.500 kW ou tensão ≥ 69kV')
      requirements.push('✅ Pode comprar energia de fontes incentivadas (50% desconto TUSD)')
    }
    // Verificar ACL (consumidores livres)
    else if (consumoKW >= minConsumoACL || tensao >= 2.3) {
      eligible = true
      eligibilityType = 'ACL'
      requirements.push('✅ Consumo acima de 500 kW ou tensão ≥ 2,3kV')
      requirements.push('✅ Pode comprar energia de qualquer fonte')
    }
    // Consumidor cativo
    else {
      eligible = false
      missingSteps.push(`Aumentar consumo para pelo menos 500 kW (atual: ${consumoKW.toFixed(0)} kW)`)
      missingSteps.push('OU aumentar tensão de fornecimento para ≥ 2,3kV')
      missingSteps.push('Considerar agregação com outras unidades consumidoras')
    }

    // Steps comuns
    if (eligible) {
      requirements.push('📋 Cadastro na CCEE necessário')
      requirements.push('📄 Contrato com comercializadora')
      requirements.push('⚡ Adequação do sistema de medição')
    }

    // Estimativa de timeline
    const estimatedTimeline = eligible 
      ? '3-6 meses (cadastro CCEE + negociação + adequação)'
      : 'Não elegível no momento'

    // Calcular economia potencial
    const savings = eligible ? this.estimatePotentialSavings(data) : 0

    return {
      eligible,
      type: eligibilityType,
      requirements,
      missingSteps,
      estimatedTimeline,
      savings
    }
  }

  private estimatePotentialSavings(profile: UserProfile): number {
    // Estimativa conservadora: 10-20% de economia
    const currentCost = profile.consumo * profile.tarifaAtual
    const estimatedSavings = currentCost * 0.15 // 15% médio
    return estimatedSavings
  }

  async getRequirements(consumo: number): Promise<Requirement[]> {
    const consumoKW = consumo / 730

    const requirements: Requirement[] = [
      {
        item: 'Consumo mínimo',
        status: consumoKW >= 500 ? 'COMPLETE' : 'PENDING',
        description: `${consumoKW >= 500 ? '✅' : '❌'} Consumo de ${consumoKW.toFixed(0)} kW (necessário: 500 kW)`
      },
      {
        item: 'Cadastro CCEE',
        status: 'PENDING',
        description: 'Registro na Câmara de Comercialização de Energia Elétrica'
      },
      {
        item: 'Sistema de medição',
        status: 'PENDING',
        description: 'Adequação do sistema de medição para o mercado livre'
      },
      {
        item: 'Contrato com comercializadora',
        status: 'PENDING',
        description: 'Negociação e assinatura de contrato de fornecimento'
      }
    ]

    return requirements
  }

  async estimateMigrationTime(): Promise<Timeline> {
    return {
      totalDays: 120, // ~4 meses
      phases: [
        {
          name: 'Análise e Decisão',
          duration: 15,
          tasks: [
            'Análise de elegibilidade',
            'Simulação de economia',
            'Decisão de migração'
          ]
        },
        {
          name: 'Cadastro CCEE',
          duration: 30,
          tasks: [
            'Documentação necessária',
            'Submissão do cadastro',
            'Aprovação CCEE'
          ]
        },
        {
          name: 'Adequação Técnica',
          duration: 45,
          tasks: [
            'Adequação do sistema de medição',
            'Testes e homologação',
            'Aprovação da distribuidora'
          ]
        },
        {
          name: 'Contratação',
          duration: 30,
          tasks: [
            'Negociação com comercializadoras',
            'Análise de propostas',
            'Assinatura de contratos'
          ]
        }
      ]
    }
  }

  // ==================== SIMULAÇÃO DE ECONOMIA ====================

  async simulateEconomy(params: SimulationParams): Promise<EconomyReport> {
    const { consumo, tarifaAtual, perfil, submercado } = params

    // Custo atual (mercado cativo)
    const currentCost = consumo * tarifaAtual

    // Estimativa de tarifa no mercado livre
    // Componentes: Energia + TUSD + Impostos
    const energiaCost = this.estimateEnergyCost(submercado, perfil)
    const tusdCost = tarifaAtual * 0.3 // TUSD representa ~30% da tarifa
    const impostos = (energiaCost + tusdCost) * 0.25 // ~25% de impostos

    const estimatedTariffFreeMkt = energiaCost + tusdCost + impostos
    const estimatedCostFreeMkt = consumo * estimatedTariffFreeMkt

    // Cálculos de economia
    const monthlySavings = currentCost - estimatedCostFreeMkt
    const annualSavings = monthlySavings * 12
    const savingsPercentage = (monthlySavings / currentCost) * 100

    // Custos de migração
    const migrationCosts = this.estimateMigrationCosts(consumo)

    // Payback
    const paybackMonths = migrationCosts / monthlySavings

    // ROI (5 anos)
    const totalSavings5Years = annualSavings * 5
    const roi = ((totalSavings5Years - migrationCosts) / migrationCosts) * 100

    const assumptions = [
      `Tarifa energia: R$ ${energiaCost.toFixed(3)}/kWh`,
      `TUSD: R$ ${tusdCost.toFixed(3)}/kWh`,
      `Impostos: ${(impostos / (energiaCost + tusdCost) * 100).toFixed(1)}%`,
      'Perfil de consumo considerado',
      'Valores médios de mercado'
    ]

    return {
      currentCost,
      estimatedCostFreeMkt,
      monthlySavings,
      annualSavings,
      savingsPercentage,
      migrationCosts,
      paybackMonths,
      roi,
      assumptions
    }
  }

  private estimateEnergyCost(submercado: string, perfil: string): number {
    // Preços médios por submercado (R$/kWh)
    const basePrices: Record<string, number> = {
      'SUDESTE': 0.35,
      'SUL': 0.33,
      'NORDESTE': 0.38,
      'NORTE': 0.40
    }

    let price = basePrices[submercado] || 0.35

    // Ajustar por perfil
    if (perfil === 'PONTA_FORA_PONTA') {
      price *= 0.95 // Desconto por flexibilidade
    } else if (perfil === 'SAZONAL') {
      price *= 0.92 // Maior desconto
    }

    return price
  }

  private estimateMigrationCosts(consumo: number): number {
    // Custos típicos:
    // - Cadastro CCEE: R$ 5.000
    // - Adequação medição: R$ 10.000 - R$ 50.000
    // - Consultoria: R$ 5.000 - R$ 15.000

    const baseCost = 20000 // R$ 20k base
    const variableCost = (consumo / 100000) * 5000 // +R$ 5k por 100 MWh

    return baseCost + variableCost
  }

  // ==================== ANÁLISE DE CONTRATOS ====================

  async analyzeContract(contractText: string): Promise<ContractAnalysis> {
    const prompt = `Analise este contrato de energia e extraia as informações chave. Contrato: ${contractText.slice(0, 10000)}`;

    try {
        const response = await this.googleAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING, description: 'resumo executivo' },
                        pricePerMWh: { type: Type.NUMBER },
                        term: { type: Type.STRING, description: 'prazo do contrato' },
                        flexibility: { type: Type.STRING, description: 'descrição das flexibilidades (sazonalidade, modulação, etc)' },
                        penalties: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'lista de penalidades e multas' },
                        risks: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'lista de riscos identificados' },
                        recommendation: { type: Type.STRING, description: 'recomendação (assinar ou não)' },
                        score: { type: Type.NUMBER, description: 'score de 0 a 100' }
                    },
                    required: ["summary", "pricePerMWh", "term", "flexibility", "penalties", "risks", "recommendation", "score"]
                },
            },
        });

        const jsonText = response.text.trim();
        const analysis = JSON.parse(jsonText);
        return analysis as ContractAnalysis;

    } catch (error) {
      console.error('Erro na análise de contrato com Gemini:', error);
      
      // Fallback: análise básica
      return {
        summary: 'Análise automática indisponível. Revise manualmente.',
        pricePerMWh: 0,
        term: 'Não identificado',
        flexibility: 'Revisar contrato',
        penalties: ['Verificar cláusulas de rescisão'],
        risks: ['Análise detalhada recomendada'],
        recommendation: 'Consulte um especialista antes de assinar',
        score: 50
      };
    }
  }

  async compareContracts(contracts: string[]): Promise<any> {
    const analyses = await Promise.all(
      contracts.map(c => this.analyzeContract(c))
    )

    // Comparar scores
    const sorted = analyses.sort((a, b) => b.score - a.score)

    return {
      best: sorted[0],
      worst: sorted[sorted.length - 1],
      all: sorted
    }
  }

  async identifyRedFlags(contract: string): Promise<string[]> {
    const redFlags: string[] = []

    // Palavras-chave de alerta
    const keywords = [
      'multa rescisória',
      'penalidade',
      'reajuste unilateral',
      'prorrogação automática',
      'foro',
      'arbitragem obrigatória'
    ]

    keywords.forEach(keyword => {
      if (contract.toLowerCase().includes(keyword)) {
        redFlags.push(`⚠️ Contém cláusula de "${keyword}"`)
      }
    })

    return redFlags
  }
}

// ==================== EXPORT ====================
export default AIAssistant;
