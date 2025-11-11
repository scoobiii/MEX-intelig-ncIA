// ==================== INTERFACES ====================

interface UserProfile {
  userId: string
  consumo: number // kWh/mês
  tarifaAtual: number
  tipo: 'INDUSTRIAL' | 'COMERCIAL' | 'RURAL' | 'RESIDENCIAL'
  submercado: string
  preferences: {
    renovavel?: boolean
    priceImportance: number // 0-1
    flexibilityImportance: number
    riskTolerance: number
  }
  historico: {
    consumoMensal: number[]
    interacoes: UserInteraction[]
  }
}

interface UserInteraction {
  type: 'VIEW' | 'CLICK' | 'PURCHASE' | 'SAVE'
  itemId: string
  timestamp: Date
  metadata?: Record<string, any>
}

interface Recommendation {
  id: string
  type: 'TIMING' | 'SUPPLIER' | 'SOURCE' | 'ACTION' | 'CONTRACT'
  title: string
  description: string
  impact: number // R$ economia estimada
  confidence: number // 0-1
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  action: string
  actionUrl?: string
  reasoning: string[]
  validUntil: Date
}

interface ComercializadoraMatch {
  id: string
  name: string
  matchScore: number // 0-100
  pricePerMWh: number
  contractFlexibility: string
  renewableEnergy: boolean
  reasons: string[]
  pros: string[]
  cons: string[]
}

interface SourceRecommendation {
  type: 'HIDRO' | 'EOLICA' | 'SOLAR' | 'BIOMASSA' | 'NUCLEAR'
  availability: boolean
  pricePerMWh: number
  renewable: boolean
  savings: number
  recommendation: string
  certifications: string[]
}

interface TimingRecommendation {
  action: 'CONTRACT_NOW' | 'WAIT_DAYS' | 'WAIT_WEEKS' | 'WAIT_MONTHS'
  days: number
  expectedPrice: number
  currentPrice: number
  potentialSavings: number
  confidence: number
  reasoning: string
}

interface Pattern {
  type: 'PEAK_HOURS' | 'SEASONAL' | 'WEEKLY' | 'MONTHLY'
  description: string
  impact: number
  optimization: string
}

// ==================== RECOMMENDATION ENGINE ====================

export class RecommendationEngine {
  private userProfiles: Map<string, UserProfile> = new Map()
  private similarityMatrix: Map<string, Map<string, number>> = new Map()
  
  // ==================== ANÁLISE DE PERFIL ====================

  async analyzeUserProfile(userId: string): Promise<UserProfile> {
    // Recuperar ou criar perfil
    let profile = this.userProfiles.get(userId)
    
    if (!profile) {
      profile = this.createDefaultProfile(userId)
    }

    // Analisar padrões de consumo
    profile.historico.consumoMensal = this.analyzeConsumptionPatterns(profile)
    
    // Atualizar preferências baseadas em interações
    this.updatePreferencesFromInteractions(profile)
    
    // Salvar perfil atualizado
    this.userProfiles.set(userId, profile)
    
    return profile
  }

  private createDefaultProfile(userId: string): UserProfile {
    return {
      userId,
      consumo: 0,
      tarifaAtual: 0.75,
      tipo: 'COMERCIAL',
      submercado: 'SUDESTE',
      preferences: {
        renovavel: false,
        priceImportance: 0.7,
        flexibilityImportance: 0.5,
        riskTolerance: 0.3
      },
      historico: {
        consumoMensal: [],
        interacoes: []
      }
    }
  }

  private analyzeConsumptionPatterns(profile: UserProfile): number[] {
    // Simular análise de padrões
    const months = 12
    const baseConsumo = profile.consumo
    
    return Array.from({ length: months }, (_, i) => {
      // Sazonalidade (verão = +20%, inverno = -10%)
      const month = (new Date().getMonth() + i) % 12
      let seasonal = 1.0
      
      if (month >= 11 || month <= 2) { // Verão (Dez-Fev)
        seasonal = 1.2
      } else if (month >= 5 && month <= 7) { // Inverno (Jun-Ago)
        seasonal = 0.9
      }
      
      // Adicionar variação aleatória
      const variation = 0.9 + Math.random() * 0.2 // ±10%
      
      return baseConsumo * seasonal * variation
    })
  }

  private updatePreferencesFromInteractions(profile: UserProfile): void {
    const interactions = profile.historico.interacoes
    
    // Analisar interesse em energia renovável
    const renewableViews = interactions.filter(
      i => i.metadata?.renewable === true
    ).length
    
    if (renewableViews > 5) {
      profile.preferences.renovavel = true
    }
    
    // Analisar sensibilidade a preço
    const priceClicks = interactions.filter(
      i => i.type === 'CLICK' && i.metadata?.lowPrice === true
    ).length
    
    if (priceClicks > interactions.length * 0.7) {
      profile.preferences.priceImportance = 0.9
    }
  }

  async updateProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
    const profile = await this.analyzeUserProfile(userId)
    
    Object.assign(profile, data)
    
    this.userProfiles.set(userId, profile)
  }

  async getConsumptionPatterns(userId: string): Promise<Pattern[]> {
    const profile = await this.analyzeUserProfile(userId)
    const patterns: Pattern[] = []

    // Padrão de horário de pico
    patterns.push({
      type: 'PEAK_HOURS',
      description: 'Consumo concentrado em horário de ponta',
      impact: profile.consumo * 0.3 * 0.15, // 30% do consumo com 15% de diferença
      optimization: 'Deslocar carga para horário fora de ponta pode economizar 15%'
    })

    // Padrão sazonal
    const consumoMensal = profile.historico.consumoMensal
    const maxConsumo = Math.max(...consumoMensal)
    const minConsumo = Math.min(...consumoMensal)
    const variacao = (maxConsumo - minConsumo) / minConsumo

    if (variacao > 0.2) {
      patterns.push({
        type: 'SEASONAL',
        description: `Variação sazonal de ${(variacao * 100).toFixed(0)}%`,
        impact: (maxConsumo - minConsumo) * profile.tarifaAtual,
        optimization: 'Contratar energia com modulação sazonal'
      })
    }

    return patterns
  }

  // ==================== RECOMENDAÇÕES PERSONALIZADAS ====================

  async getRecommendations(userId: string): Promise<Recommendation[]> {
    const profile = await this.analyzeUserProfile(userId)
    const recommendations: Recommendation[] = []

    // 1. Recomendação de timing
    const timingRec = await this.recommendContractTiming(userId)
    recommendations.push({
      id: `timing-${Date.now()}`,
      type: 'TIMING',
      title: 'Melhor momento para contratar',
      description: timingRec.reasoning,
      impact: timingRec.potentialSavings,
      confidence: timingRec.confidence,
      priority: timingRec.potentialSavings > 1000 ? 'HIGH' : 'MEDIUM',
      action: timingRec.action === 'CONTRACT_NOW' ? 'Contratar agora' : `Aguardar ${timingRec.days} dias`,
      reasoning: [timingRec.reasoning],
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    })

    // 2. Recomendação de comercializadoras
    const comercializadoras = await this.recommendComercializadoras(userId)
    if (comercializadoras.length > 0) {
      const best = comercializadoras[0]
      recommendations.push({
        id: `supplier-${Date.now()}`,
        type: 'SUPPLIER',
        title: `${best.name} - ${best.matchScore}% de compatibilidade`,
        description: `Comercializadora ideal para seu perfil`,
        impact: (profile.tarifaAtual - best.pricePerMWh / 1000) * profile.consumo,
        confidence: best.matchScore / 100,
        priority: 'HIGH',
        action: 'Solicitar proposta',
        actionUrl: `/suppliers/${best.id}`,
        reasoning: best.reasons,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      })
    }

    // 3. Recomendação de fontes de energia
    if (profile.preferences.renovavel) {
      const sources = await this.recommendPowerSources(profile.preferences)
      const renewable = sources.find(s => s.renewable && s.availability)
      
      if (renewable) {
        recommendations.push({
          id: `source-${Date.now()}`,
          type: 'SOURCE',
          title: `Energia ${renewable.type} disponível`,
          description: renewable.recommendation,
          impact: renewable.savings,
          confidence: 0.8,
          priority: 'MEDIUM',
          action: 'Ver ofertas de energia renovável',
          reasoning: [`Economia de R$ ${renewable.savings.toFixed(2)}/mês`],
          validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        })
      }
    }

    // 4. Recomendação de otimização de consumo
    const patterns = await this.getConsumptionPatterns(userId)
    if (patterns.length > 0) {
      const bestPattern = patterns.sort((a, b) => b.impact - a.impact)[0]
      recommendations.push({
        id: `optimization-${Date.now()}`,
        type: 'ACTION',
        title: 'Otimize seu perfil de consumo',
        description: bestPattern.description,
        impact: bestPattern.impact,
        confidence: 0.75,
        priority: bestPattern.impact > 500 ? 'HIGH' : 'LOW',
        action: 'Ver plano de otimização',
        reasoning: [bestPattern.optimization],
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      })
    }

    // Ordenar por prioridade e impacto
    return recommendations.sort((a, b) => {
      const priorityWeight = { HIGH: 3, MEDIUM: 2, LOW: 1 }
      const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority]
      
      if (priorityDiff !== 0) return priorityDiff
      return b.impact - a.impact
    })
  }

  // ==================== RECOMENDAÇÃO DE COMERCIALIZADORAS ====================

  async recommendComercializadoras(userId: string): Promise<ComercializadoraMatch[]> {
    const profile = await this.analyzeUserProfile(userId)
    
    // Mock de comercializadoras disponíveis
    const comercializadoras = [
      {
        id: 'comerc-1',
        name: 'Energisa Comercializadora',
        pricePerMWh: 280,
        flexibility: 'Alta',
        renewable: false
      },
      {
        id: 'comerc-2',
        name: 'CPFL Energia',
        pricePerMWh: 295,
        flexibility: 'Média',
        renewable: true
      },
      {
        id: 'comerc-3',
        name: 'Engie Brasil',
        pricePerMWh: 270,
        flexibility: 'Alta',
        renewable: true
      },
      {
        id: 'comerc-4',
        name: 'Mercado Livre Solar',
        pricePerMWh: 310,
        flexibility: 'Baixa',
        renewable: true
      }
    ]

    const matches: ComercializadoraMatch[] = comercializadoras.map(c => {
      let score = 0
      const reasons: string[] = []
      const pros: string[] = []
      const cons: string[] = []

      // Score baseado em preço
      const priceDiff = (profile.tarifaAtual * 1000 - c.pricePerMWh) / (profile.tarifaAtual * 1000)
      const priceScore = Math.max(0, Math.min(40, priceDiff * 100))
      score += priceScore * profile.preferences.priceImportance
      
      if (priceDiff > 0) {
        pros.push(`Economia de ${(priceDiff * 100).toFixed(1)}% vs tarifa atual`)
        reasons.push('Preço competitivo')
      } else {
        cons.push('Preço acima da tarifa atual')
      }

      // Score baseado em flexibilidade
      const flexScore = c.flexibility === 'Alta' ? 30 : c.flexibility === 'Média' ? 20 : 10
      score += flexScore * profile.preferences.flexibilityImportance
      
      if (c.flexibility === 'Alta') {
        pros.push('Alta flexibilidade contratual')
        reasons.push('Boa flexibilidade')
      }

      // Score baseado em renovável
      if (profile.preferences.renovavel && c.renewable) {
        score += 30
        pros.push('Energia 100% renovável')
        reasons.push('Fonte renovável')
      } else if (!c.renewable && profile.preferences.renovavel) {
        cons.push('Não oferece energia renovável')
      }

      return {
        id: c.id,
        name: c.name,
        matchScore: Math.min(100, Math.round(score)),
        pricePerMWh: c.pricePerMWh,
        contractFlexibility: c.flexibility,
        renewableEnergy: c.renewable,
        reasons,
        pros,
        cons
      }
    })

    return matches.sort((a, b) => b.matchScore - a.matchScore)
  }

  // ==================== RECOMENDAÇÃO DE FONTES ====================

  async recommendPowerSources(preferences: UserProfile['preferences']): Promise<SourceRecommendation[]> {
    const sources: SourceRecommendation[] = [
      {
        type: 'HIDRO',
        availability: true,
        pricePerMWh: 280,
        renewable: true,
        savings: 50,
        recommendation: 'Fonte mais estável e tradicional',
        certifications: ['I-REC']
      },
      {
        type: 'EOLICA',
        availability: true,
        pricePerMWh: 290,
        renewable: true,
        savings: 40,
        recommendation: 'Boa opção com desconto TUSD',
        certifications: ['I-REC', 'Certificado Energia Limpa']
      },
      {
        type: 'SOLAR',
        availability: true,
        pricePerMWh: 310,
        renewable: true,
        savings: 20,
        recommendation: 'Energia limpa com crescente disponibilidade',
        certifications: ['I-REC', 'ISO 14001']
      },
      {
        type: 'BIOMASSA',
        availability: false,
        pricePerMWh: 320,
        renewable: true,
        savings: 10,
        recommendation: 'Disponibilidade limitada',
        certifications: ['I-REC']
      }
    ]

    // Filtrar por preferências
    if (preferences.renovavel) {
      return sources.filter(s => s.renewable && s.availability)
    }

    return sources.filter(s => s.availability)
  }

  // ==================== RECOMENDAÇÃO DE TIMING ====================

  async recommendContractTiming(userId: string): Promise<TimingRecommendation> {
    const profile = await this.analyzeUserProfile(userId)
    
    // Mock de previsão de preços
    const currentPrice = 300 // R$/MWh
    const futurePrice = 280 // Previsão 30 dias
    
    const savingsPerMWh = currentPrice - futurePrice
    const consumoMWh = profile.consumo / 1000
    const potentialSavings = savingsPerMWh * consumoMWh

    let action: TimingRecommendation['action'] = 'CONTRACT_NOW'
    let days = 0
    let reasoning = ''

    if (savingsPerMWh > 20) {
      action = 'WAIT_MONTHS'
      days = 30
      reasoning = `Preços devem cair R$ ${savingsPerMWh}/MWh nos próximos 30 dias. Aguarde para economia de R$ ${potentialSavings.toFixed(2)}/mês.`
    } else if (savingsPerMWh > 10) {
      action = 'WAIT_WEEKS'
      days = 14
      reasoning = `Pequena queda prevista. Aguardar 2 semanas pode economizar R$ ${potentialSavings.toFixed(2)}/mês.`
    } else if (savingsPerMWh > 5) {
      action = 'WAIT_DAYS'
      days = 7
      reasoning = `Queda mínima prevista. Aguardar 1 semana ou contratar agora.`
    } else {
      reasoning = `Preços estáveis. Momento adequado para contratar.`
    }

    return {
      action,
      days,
      expectedPrice: futurePrice,
      currentPrice,
      potentialSavings: Math.max(0, potentialSavings),
      confidence: 0.75,
      reasoning
    }
  }

  // ==================== COLLABORATIVE FILTERING ====================

  async trainCollaborativeFiltering(data: UserInteraction[]): Promise<void> {
    // Construir matriz de similaridade usuário-item
    const userItems = new Map<string, Set<string>>()
    
    data.forEach(interaction => {
      const userId = interaction.metadata?.userId
      if (!userId) return
      
      if (!userItems.has(userId)) {
        userItems.set(userId, new Set())
      }
      
      if (interaction.type === 'PURCHASE' || interaction.type === 'SAVE') {
        userItems.get(userId)!.add(interaction.itemId)
      }
    })

    // Calcular similaridade entre usuários (Jaccard)
    const users = Array.from(userItems.keys())
    
    users.forEach(user1 => {
      const similarities = new Map<string, number>()
      const items1 = userItems.get(user1)!
      
      users.forEach(user2 => {
        if (user1 === user2) return
        
        const items2 = userItems.get(user2)!
        const intersection = new Set([...items1].filter(x => items2.has(x)))
        const union = new Set([...items1, ...items2])
        
        const similarity = intersection.size / union.size
        similarities.set(user2, similarity)
      })
      
      this.similarityMatrix.set(user1, similarities)
    })

    console.log(`✅ Collaborative filtering treinado para ${users.length} usuários`)
  }

  async predictUserPreference(userId: string, itemId: string): Promise<number> {
    const similarities = this.similarityMatrix.get(userId)
    
    if (!similarities) return 0.5 // Default
    
    // Média ponderada das preferências de usuários similares
    let weightedSum = 0
    let totalWeight = 0
    
    similarities.forEach((similarity, otherUser) => {
      const otherProfile = this.userProfiles.get(otherUser)
      if (!otherProfile) return
      
      const hasInteraction = otherProfile.historico.interacoes.some(
        i => i.itemId === itemId && (i.type === 'PURCHASE' || i.type === 'SAVE')
      )
      
      if (hasInteraction) {
        weightedSum += similarity * 1.0
        totalWeight += similarity
      }
    })
    
    return totalWeight > 0 ? weightedSum / totalWeight : 0.5
  }

  async findSimilarUsers(userId: string, limit: number = 5): Promise<string[]> {
    const similarities = this.similarityMatrix.get(userId)
    
    if (!similarities) return []
    
    return Array.from(similarities.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([user]) => user)
  }

  // ==================== UTILITIES ====================

  private calculateMatchScore(user: UserProfile, item: any): number {
    let score = 0
    
    // Implementar lógica de matching
    // Exemplo: baseado em preferências e características do item
    
    return Math.min(100, Math.max(0, score))
  }

  private rankRecommendations(recommendations: Recommendation[]): Recommendation[] {
    return recommendations.sort((a, b) => {
      // Ranking multi-critério
      const scoreA = a.impact * a.confidence * (a.priority === 'HIGH' ? 1.5 : a.priority === 'MEDIUM' ? 1.2 : 1)
      const scoreB = b.impact * b.confidence * (b.priority === 'HIGH' ? 1.5 : b.priority === 'MEDIUM' ? 1.2 : 1)
      
      return scoreB - scoreA
    })
  }

  // ==================== DATA MANAGEMENT ====================

  addUserInteraction(userId: string, interaction: UserInteraction): void {
    const profile = this.userProfiles.get(userId)
    if (!profile) return
    
    profile.historico.interacoes.push({
      ...interaction,
      timestamp: new Date()
    })
    
    // Limitar histórico a 100 interações
    if (profile.historico.interacoes.length > 100) {
      profile.historico.interacoes = profile.historico.interacoes.slice(-100)
    }
  }

  clearUserData(userId: string): void {
    this.userProfiles.delete(userId)
    this.similarityMatrix.delete(userId)
  }

  exportUserData(userId: string): UserProfile | undefined {
    return this.userProfiles.get(userId)
  }
}

// ==================== EXPORT ====================
export default RecommendationEngine