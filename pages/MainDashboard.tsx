import React, { useState, useEffect, useMemo } from 'react'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import {
  TrendingUpIcon,
  ChevronDownIcon,
  BoltIcon,
  ChartBarIcon,
  WarningIcon,
  InfoIcon,
} from '../application/components/icons';

// ==================== MOCK DATA ====================

const mockPLDData = Array.from({ length: 30 }, (_, i) => ({
  date: `${i + 1}/11`,
  value: 280 + Math.sin(i / 5) * 30 + Math.random() * 20,
  prediction: i > 25 ? 260 + Math.random() * 15 : null
}))

const mockRecommendations = [
  {
    id: '1',
    type: 'TIMING',
    title: 'Momento ideal para contratar',
    description: 'Preços devem cair 12% nos próximos 15 dias',
    impact: 2400,
    confidence: 0.85,
    priority: 'HIGH'
  },
  {
    id: '2',
    type: 'SUPPLIER',
    title: 'Engie Brasil - 92% compatível',
    description: 'Melhor oferta para seu perfil',
    impact: 1800,
    confidence: 0.92,
    priority: 'HIGH'
  },
  {
    id: '3',
    type: 'SOURCE',
    title: 'Energia Solar disponível',
    description: '100% renovável a R$ 310/MWh',
    impact: 800,
    confidence: 0.78,
    priority: 'MEDIUM'
  }
]

const mockKPIs = {
  economyMonthly: 12400,
  economyYearly: 148800,
  pldToday: 285,
  savingsScore: 87
}

const mockGeracaoData = [
  { name: 'Hidro', value: 60, color: '#3B82F6' },
  { name: 'Térmica', value: 15, color: '#EF4444' },
  { name: 'Eólica', value: 12, color: '#10B981' },
  { name: 'Solar', value: 8, color: '#F59E0B' },
  { name: 'Nuclear', value: 5, color: '#8B5CF6' }
]

// ==================== COMPONENTS ====================

const KPICard = ({ title, value, trend, icon: Icon, format = 'currency' }: any) => {
  const formattedValue = format === 'currency'
    ? `R$ ${value.toLocaleString('pt-BR')}`
    : format === 'percent'
    ? `${value}%`
    : value.toLocaleString('pt-BR')

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">{title}</span>
        <Icon className="w-5 h-5 text-blue-500" />
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-bold text-gray-900">{formattedValue}</div>
          {trend && (
            <div className={`flex items-center mt-1 text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? <TrendingUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
              <span>{Math.abs(trend)}% vs mês anterior</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const PLDChart = ({ data }: any) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Evolução PLD - Sudeste</h3>
          <p className="text-sm text-gray-600">Últimos 30 dias + previsão 7 dias</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md">7d</button>
          <button className="px-3 py-1 text-sm text-gray-600 rounded-md">30d</button>
          <button className="px-3 py-1 text-sm text-gray-600 rounded-md">90d</button>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPLD" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
          <YAxis stroke="#6B7280" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: 'none',
              borderRadius: '8px',
              color: '#fff'
            }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#3B82F6"
            fill="url(#colorPLD)"
            name="PLD Histórico"
          />
          <Line
            type="monotone"
            dataKey="prediction"
            stroke="#10B981"
            strokeDasharray="5 5"
            name="Previsão IA"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-gray-50 rounded-md">
          <div className="text-sm text-gray-600">Média 30d</div>
          <div className="text-lg font-semibold text-gray-900">R$ 285/MWh</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-md">
          <div className="text-sm text-blue-600">Hoje</div>
          <div className="text-lg font-semibold text-blue-900">R$ 292/MWh</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-md">
          <div className="text-sm text-green-600">Previsão 7d</div>
          <div className="text-lg font-semibold text-green-900">R$ 275/MWh</div>
        </div>
      </div>
    </div>
  )
}

const RecommendationCard = ({ rec }: any) => {
  const priorityColors = {
    HIGH: 'border-red-200 bg-red-50',
    MEDIUM: 'border-yellow-200 bg-yellow-50',
    LOW: 'border-blue-200 bg-blue-50'
  }

  const priorityBadgeColors = {
    HIGH: 'bg-red-100 text-red-700',
    MEDIUM: 'bg-yellow-100 text-yellow-700',
    LOW: 'bg-blue-100 text-blue-700'
  }

  return (
    <div className={`p-4 rounded-lg border-2 ${priorityColors[rec.priority]} hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <BoltIcon className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold text-gray-900">{rec.title}</h4>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded ${priorityBadgeColors[rec.priority]}`}>
          {rec.priority}
        </span>
      </div>
      
      <p className="text-sm text-gray-700 mb-3">{rec.description}</p>
      
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-600">Impacto estimado</div>
          <div className="text-lg font-bold text-green-600">
            R$ {rec.impact.toLocaleString('pt-BR')}/mês
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-600">Confiança</div>
          <div className="text-lg font-bold text-blue-600">
            {(rec.confidence * 100).toFixed(0)}%
          </div>
        </div>
      </div>
      
      <button className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
        Ver detalhes
        <ChevronDownIcon className="w-4 h-4" style={{ transform: 'rotate(-90deg)' }} />
      </button>
    </div>
  )
}

const GeracaoChart = ({ data }: any) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Geração por Fonte</h3>
      
      <div className="flex items-center gap-8">
        <ResponsiveContainer width="40%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        <div className="flex-1 space-y-3">
          {data.map((item: any) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm font-medium text-gray-700">{item.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{ width: `${item.value}%`, backgroundColor: item.color }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                  {item.value}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const AlertsPanel = () => {
  const alerts = [
    {
      type: 'warning',
      title: 'PLD em alta',
      message: 'Preços subiram 8% na última semana',
      time: '2 horas atrás'
    },
    {
      type: 'success',
      title: 'Nova oferta disponível',
      message: 'Energia solar a R$ 290/MWh',
      time: '5 horas atrás'
    },
    {
      type: 'info',
      title: 'Período seco se aproximando',
      message: 'Preços podem subir em junho',
      time: '1 dia atrás'
    }
  ]

  const alertColors = {
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  }

  const alertIcons = {
    warning: WarningIcon,
    success: InfoIcon,
    info: InfoIcon
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas e Notificações</h3>
      
      <div className="space-y-3">
        {alerts.map((alert, i) => {
          const Icon = alertIcons[alert.type as keyof typeof alertIcons]
          return (
            <div
              key={i}
              className={`p-3 rounded-md border ${alertColors[alert.type as keyof typeof alertColors]}`}
            >
              <div className="flex items-start gap-3">
                <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-medium text-sm">{alert.title}</div>
                  <div className="text-sm opacity-90">{alert.message}</div>
                  <div className="text-xs opacity-70 mt-1">{alert.time}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const GridStabilityMonitor = () => {
    const [stability, setStability] = useState({
      status: 'Estável',
      reverseFlow: 2.1, // MW
      curtailmentRisk: 'Baixo',
      bessStatus: 'Carregando'
    });
  
    useEffect(() => {
      const interval = setInterval(() => {
        const riskRoll = Math.random();
        let newRisk = 'Baixo';
        if (riskRoll > 0.9) newRisk = 'Alto';
        else if (riskRoll > 0.7) newRisk = 'Médio';
        
        setStability({
          status: newRisk === 'Alto' ? 'Alerta' : 'Estável',
          reverseFlow: Math.max(0, 1 + (Math.random() - 0.5) * 4),
          curtailmentRisk: newRisk as 'Baixo' | 'Médio' | 'Alto',
          bessStatus: newRisk === 'Alto' ? 'Descarregando' : 'Carregando'
        });
      }, 5000);
      return () => clearInterval(interval);
    }, []);
  
    const riskColors = {
      'Baixo': 'text-green-600',
      'Médio': 'text-yellow-600',
      'Alto': 'text-red-600',
    };
  
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monitor de Estabilidade da Rede</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Status da Rede</p>
            <p className={`text-2xl font-bold ${stability.status === 'Estável' ? 'text-green-600' : 'text-red-600 animate-pulse'}`}>
              {stability.status}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Fluxo Reverso</p>
            <p className="text-2xl font-bold text-gray-900">{stability.reverseFlow.toFixed(1)} MW</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Risco de Curtailment</p>
            <p className={`text-2xl font-bold ${riskColors[stability.curtailmentRisk]}`}>{stability.curtailmentRisk}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status BESS</p>
            <p className="text-2xl font-bold text-blue-600">{stability.bessStatus}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm font-semibold text-gray-800">Ação da IA (MEX Trade):</p>
          <p className="text-gray-600 mt-1">
            {stability.bessStatus === 'Carregando' 
              ? 'Armazenando excesso de geração renovável no BESS para evitar instabilidade e perdas por curtailment.'
              : 'Descarregando BESS para suprir pico de demanda e estabilizar a frequência da rede.'}
          </p>
        </div>
      </div>
    );
  };

// ==================== MAIN DASHBOARD ====================

export default function MainDashboard() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carregamento
    setTimeout(() => setLoading(false), 1000)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard MEX Trade</h1>
              <p className="text-sm text-gray-600">Plataforma de Inteligência e Operações no Mercado de Energia.</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Atualizar dados
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Economia Mensal"
            value={mockKPIs.economyMonthly}
            trend={15}
            icon={ChartBarIcon}
            format="currency"
          />
          <KPICard
            title="Economia Anual"
            value={mockKPIs.economyYearly}
            trend={12}
            icon={TrendingUpIcon}
            format="currency"
          />
          <KPICard
            title="PLD Hoje"
            value={mockKPIs.pldToday}
            trend={-3}
            icon={BoltIcon}
            format="number"
          />
          <KPICard
            title="Score Economia"
            value={mockKPIs.savingsScore}
            trend={5}
            icon={InfoIcon}
            format="percent"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <PLDChart data={mockPLDData} />
          </div>
          <div>
            <GeracaoChart data={mockGeracaoData} />
          </div>
        </div>

        {/* Recommendations */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <BoltIcon className="w-6 h-6 text-blue-600" />
              Recomendações Inteligentes
            </h2>
            <span className="text-sm text-gray-600">{mockRecommendations.length} recomendações</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockRecommendations.map(rec => (
              <RecommendationCard key={rec.id} rec={rec} />
            ))}
          </div>
        </div>
        
        {/* Grid Stability */}
        <div className="mb-8">
            <GridStabilityMonitor />
        </div>

        {/* Alerts */}
        <AlertsPanel />
      </main>
    </div>
  )
}