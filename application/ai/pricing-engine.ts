import * as tf from '@tensorflow/tfjs'
import { DateTime } from 'luxon'

// ==================== INTERFACES ====================

interface HistoricalData {
  date: Date
  value: number
  submercado: string
  metadata?: Record<string, any>
}

interface PredictionResult {
  value: number
  confidence: number
  range: { min: number; max: number }
  factors: string[]
  timestamp: Date
}

interface Trend {
  direction: 'UP' | 'DOWN' | 'STABLE'
  strength: number // 0-1
  duration: number // dias
  reason: string
}

interface SeasonalPattern {
  pattern: 'SEMANAL' | 'MENSAL' | 'TRIMESTRAL'
  peaks: Date[]
  valleys: Date[]
  amplitude: number
}

interface Recommendation {
  action: 'BUY' | 'WAIT' | 'SELL'
  timing: Date
  reason: string
  expectedSavings: number
  confidence: number
}

interface MarketInsight {
  type: 'OPPORTUNITY' | 'RISK' | 'INFO'
  title: string
  description: string
  impact: 'HIGH' | 'MEDIUM' | 'LOW'
  actionable: boolean
}

// ==================== PRICING ENGINE ====================

export class PricingEngine {
  private model: tf.LayersModel | null = null
  private historicalData: Map<string, HistoricalData[]> = new Map()
  private isModelLoaded = false
  private readonly SEQUENCE_LENGTH = 30 // 30 dias de histórico
  private readonly FEATURES = 5 // features por timestep

  constructor() {
    this.initializeModel()
  }

  // ==================== INICIALIZAÇÃO ====================

  private async initializeModel(): Promise<void> {
    try {
      // Tentar carregar modelo existente
      this.model = await tf.loadLayersModel('indexeddb://pld-predictor')
      this.isModelLoaded = true
      console.log('✅ Modelo carregado do cache')
    } catch {
      // Criar novo modelo
      await this.createModel()
      console.log('✅ Novo modelo criado')
    }
  }

  private async createModel(): Promise<void> {
    // Arquitetura LSTM para séries temporais
    this.model = tf.sequential({
      layers: [
        // Camada LSTM 1
        tf.layers.lstm({
          units: 64,
          returnSequences: true,
          inputShape: [this.SEQUENCE_LENGTH, this.FEATURES]
        }),
        tf.layers.dropout({ rate: 0.2 }),
        
        // Camada LSTM 2
        tf.layers.lstm({
          units: 32,
          returnSequences: false
        }),
        tf.layers.dropout({ rate: 0.2 }),
        
        // Camadas densas
        tf.layers.dense({ units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 1 }) // Output: preço previsto
      ]
    })

    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['mae']
    })

    this.isModelLoaded = true
  }

  // ==================== TREINAMENTO ====================

  async trainModel(data: HistoricalData[]): Promise<void> {
    if (!this.model) throw new Error('Modelo não inicializado')

    console.log(`📚 Treinando com ${data.length} amostras...`)

    const { xs, ys } = this.prepareTrainingData(data)
    
    await this.model.fit(xs, ys, {
      epochs: 50,
      batchSize: 32,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          if (epoch % 10 === 0) {
            console.log(`Época ${epoch}: loss=${logs?.loss.toFixed(4)}, mae=${logs?.mae.toFixed(4)}`)
          }
        }
      }
    })

    // Salvar modelo
    await this.model.save('indexeddb://pld-predictor')
    console.log('✅ Modelo treinado e salvo')

    xs.dispose()
    ys.dispose()
  }

  private prepareTrainingData(data: HistoricalData[]): { xs: tf.Tensor; ys: tf.Tensor } {
    const sequences: number[][][] = []
    const targets: number[] = []

    // Criar sequências de 30 dias
    for (let i = 0; i < data.length - this.SEQUENCE_LENGTH - 1; i++) {
      const sequence = data.slice(i, i + this.SEQUENCE_LENGTH)
      const target = data[i + this.SEQUENCE_LENGTH]

      sequences.push(sequence.map(d => this.extractFeatures(d)))
      targets.push(target.value)
    }

    const xs = tf.tensor3d(sequences)
    const ys = tf.tensor2d(targets, [targets.length, 1])

    return { xs, ys }
  }

  private extractFeatures(data: HistoricalData): number[] {
    const date = DateTime.fromJSDate(data.date)
    
    return [
      data.value, // Valor PLD
      date.weekday, // Dia da semana (1-7)
      date.month, // Mês (1-12)
      date.hour || 12, // Hora (0-23)
      this.getSeasonality(date) // Sazonalidade (0-1)
    ]
  }

  private getSeasonality(date: DateTime): number {
    // Período seco (mai-out) = 1.0, úmido (nov-abr) = 0.0
    const month = date.month
    if (month >= 5 && month <= 10) {
      return 1.0
    } else {
      return 0.0
    }
  }

  // ==================== PREDIÇÕES ====================

  async predictPLD(date: Date, submercado: string): Promise<PredictionResult> {
    if (!this.isModelLoaded) {
      throw new Error('Modelo não carregado')
    }

    const historicalKey = submercado
    const historical = this.historicalData.get(historicalKey) || []

    if (historical.length < this.SEQUENCE_LENGTH) {
      throw new Error('Dados históricos insuficientes')
    }

    // Pegar últimos 30 dias
    const recentData = historical.slice(-this.SEQUENCE_LENGTH)
    const features = recentData.map(d => this.extractFeatures(d))

    // Fazer predição
    const input = tf.tensor3d([features])
    const prediction = this.model!.predict(input) as tf.Tensor
    const value = (await prediction.data())[0]

    input.dispose()
    prediction.dispose()

    // Calcular intervalo de confiança (±10%)
    const confidence = this.calculateConfidence(recentData)
    const range = {
      min: value * 0.9,
      max: value * 1.1
    }

    // Identificar fatores
    const factors = this.identifyFactors(recentData, value)

    return {
      value,
      confidence,
      range,
      factors,
      timestamp: new Date()
    }
  }

  async predictNextWeek(submercado: string): Promise<PredictionResult[]> {
    const predictions: PredictionResult[] = []
    const today = new Date()

    for (let i = 1; i <= 7; i++) {
      const futureDate = new Date(today)
      futureDate.setDate(today.getDate() + i)
      
      const prediction = await this.predictPLD(futureDate, submercado)
      predictions.push(prediction)
    }

    return predictions
  }

  async predictNextMonth(submercado: string): Promise<PredictionResult[]> {
    const predictions: PredictionResult[] = []
    const today = new Date()

    for (let i = 1; i <= 30; i++) {
      const futureDate = new Date(today)
      futureDate.setDate(today.getDate() + i)
      
      const prediction = await this.predictPLD(futureDate, submercado)
      predictions.push(prediction)
    }

    return predictions
  }

  private calculateConfidence(data: HistoricalData[]): number {
    // Confiança baseada na volatilidade
    const values = data.map(d => d.value)
    const mean = values.reduce((a, b) => a + b) / values.length
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
    const stdDev = Math.sqrt(variance)
    const cv = stdDev / mean // Coeficiente de variação

    // Quanto menor a volatilidade, maior a confiança
    return Math.max(0, Math.min(1, 1 - cv))
  }

  private identifyFactors(data: HistoricalData[], predictedValue: number): string[] {
    const factors: string[] = []
    const lastValue = data[data.length - 1].value
    const change = ((predictedValue - lastValue) / lastValue) * 100

    if (Math.abs(change) < 5) {
      factors.push('Mercado estável')
    } else if (change > 5) {
      factors.push('Tendência de alta')
      if (change > 15) factors.push('Período seco se aproximando')
    } else {
      factors.push('Tendência de queda')
      if (change < -15) factors.push('Aumento da oferta hídrica')
    }

    // Sazonalidade
    const month = new Date().getMonth() + 1
    if (month >= 5 && month <= 10) {
      factors.push('Período seco (maior demanda)')
    } else {
      factors.push('Período úmido (maior oferta hídrica)')
    }

    return factors
  }

  // ==================== ANÁLISE DE TENDÊNCIAS ====================

  async detectTrends(submercado: string, windowDays: number = 30): Promise<Trend[]> {
    const historical = this.historicalData.get(submercado) || []
    if (historical.length < windowDays) {
      throw new Error('Dados insuficientes para análise de tendências')
    }

    const recentData = historical.slice(-windowDays)
    const trends: Trend[] = []

    // Tendência linear simples
    const linearTrend = this.calculateLinearTrend(recentData)
    trends.push(linearTrend)

    // Tendência de volatilidade
    const volatilityTrend = this.calculateVolatilityTrend(recentData)
    trends.push(volatilityTrend)

    return trends
  }

  private calculateLinearTrend(data: HistoricalData[]): Trend {
    const n = data.length
    const sumX = (n * (n - 1)) / 2
    const sumY = data.reduce((sum, d) => sum + d.value, 0)
    const sumXY = data.reduce((sum, d, i) => sum + i * d.value, 0)
    const sumX2 = data.reduce((sum, _, i) => sum + i * i, 0)

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)

    const direction = slope > 0.5 ? 'UP' : slope < -0.5 ? 'DOWN' : 'STABLE'
    const strength = Math.min(1, Math.abs(slope) / 10)

    return {
      direction,
      strength,
      duration: n,
      reason: `Variação média de ${slope.toFixed(2)} R$/MWh por dia`
    }
  }

  private calculateVolatilityTrend(data: HistoricalData[]): Trend {
    const values = data.map(d => d.value)
    const mean = values.reduce((a, b) => a + b) / values.length
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
    const stdDev = Math.sqrt(variance)

    const volatility = stdDev / mean

    return {
      direction: volatility > 0.2 ? 'UP' : 'STABLE',
      strength: Math.min(1, volatility),
      duration: data.length,
      reason: `Volatilidade de ${(volatility * 100).toFixed(1)}%`
    }
  }

  async findSeasonality(submercado: string): Promise<SeasonalPattern> {
    const historical = this.historicalData.get(submercado) || []
    
    // Análise mensal
    const monthlyAvg = new Map<number, number[]>()
    
    historical.forEach(d => {
      const month = d.date.getMonth()
      if (!monthlyAvg.has(month)) {
        monthlyAvg.set(month, [])
      }
      monthlyAvg.get(month)!.push(d.value)
    })

    const monthlyValues = Array.from(monthlyAvg.entries()).map(([month, values]) => ({
      month,
      avg: values.reduce((a, b) => a + b) / values.length
    }))

    // Identificar picos e vales
    const sorted = [...monthlyValues].sort((a, b) => b.avg - a.avg)
    const peaks = sorted.slice(0, 3).map(m => {
      const date = new Date()
      date.setMonth(m.month)
      return date
    })

    const valleys = sorted.slice(-3).map(m => {
      const date = new Date()
      date.setMonth(m.month)
      return date
    })

    const maxAvg = Math.max(...monthlyValues.map(m => m.avg))
    const minAvg = Math.min(...monthlyValues.map(m => m.avg))
    const amplitude = maxAvg - minAvg

    return {
      pattern: 'MENSAL',
      peaks,
      valleys,
      amplitude
    }
  }

  calculateVolatility(submercado: string, days: number = 30): number {
    const historical = this.historicalData.get(submercado) || []
    const recentData = historical.slice(-days)

    const values = recentData.map(d => d.value)
    const mean = values.reduce((a, b) => a + b) / values.length
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
    
    return Math.sqrt(variance) / mean // Coeficiente de variação
  }

  // ==================== RECOMENDAÇÕES ====================

  async getBestTimeToContract(submercado: string): Promise<Recommendation> {
    const predictions = await this.predictNextMonth(submercado)
    const trends = await this.detectTrends(submercado)

    // Encontrar o dia com menor preço previsto
    const sortedPredictions = [...predictions].sort((a, b) => a.value - b.value)
    const bestDay = sortedPredictions[0]

    const currentPrice = this.historicalData.get(submercado)?.slice(-1)[0]?.value || 0
    const expectedSavings = ((currentPrice - bestDay.value) / currentPrice) * 100

    const action = expectedSavings > 5 ? 'WAIT' : 'BUY'
    const mainTrend = trends[0]

    return {
      action,
      timing: bestDay.timestamp,
      reason: mainTrend.direction === 'DOWN' 
        ? 'Preços em tendência de queda, aguarde mais'
        : 'Preços estáveis ou em alta, contrate agora',
      expectedSavings,
      confidence: bestDay.confidence
    }
  }

  async getMarketInsights(submercado: string): Promise<MarketInsight[]> {
    const insights: MarketInsight[] = []
    const trends = await this.detectTrends(submercado)
    const volatility = this.calculateVolatility(submercado)
    const predictions = await this.predictNextWeek(submercado)

    // Insight sobre tendência
    const mainTrend = trends[0]
    if (mainTrend.direction === 'UP' && mainTrend.strength > 0.7) {
      insights.push({
        type: 'RISK',
        title: 'Preços em alta',
        description: `Tendência de alta forte detectada. ${mainTrend.reason}`,
        impact: 'HIGH',
        actionable: true
      })
    }

    // Insight sobre volatilidade
    if (volatility > 0.3) {
      insights.push({
        type: 'RISK',
        title: 'Alta volatilidade',
        description: `Mercado instável com volatilidade de ${(volatility * 100).toFixed(1)}%`,
        impact: 'MEDIUM',
        actionable: true
      })
    }

    // Insight sobre oportunidade
    const avgPredicted = predictions.reduce((sum, p) => sum + p.value, 0) / predictions.length
    const currentPrice = this.historicalData.get(submercado)?.slice(-1)[0]?.value || 0
    
    if (avgPredicted < currentPrice * 0.9) {
      insights.push({
        type: 'OPPORTUNITY',
        title: 'Queda prevista',
        description: `Preços devem cair ${((1 - avgPredicted / currentPrice) * 100).toFixed(1)}% na próxima semana`,
        impact: 'HIGH',
        actionable: true
      })
    }

    return insights
  }

  getRiskScore(submercado: string): number {
    const volatility = this.calculateVolatility(submercado)
    const historical = this.historicalData.get(submercado) || []
    
    if (historical.length < 30) return 0.5 // Dados insuficientes

    // Score baseado em volatilidade (0 = sem risco, 1 = alto risco)
    return Math.min(1, volatility * 2)
  }

  // ==================== DADOS ====================

  addHistoricalData(submercado: string, data: HistoricalData[]): void {
    this.historicalData.set(submercado, data)
    console.log(`✅ ${data.length} registros adicionados para ${submercado}`)
  }

  getHistoricalData(submercado: string): HistoricalData[] {
    return this.historicalData.get(submercado) || []
  }

  clearData(): void {
    this.historicalData.clear()
  }
}

// ==================== EXPORT ====================
export default PricingEngine
