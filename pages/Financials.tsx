
import React, { useState, useEffect, useMemo } from 'react';
import DashboardCard from '../DashboardCard';
import { ChartBarIcon, BoltIcon, ArrowDownTrayIcon, ChartPieIcon, TrendingUpIcon, ComputerDesktopIcon, FactoryIcon, GlobeAltIcon } from '../application/components/icons';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, BarChart, Bar, CartesianGrid } from 'recharts';
import { PlantStatus, FuelMode } from '../types';

interface FinancialsProps {
  plantStatus: PlantStatus;
  powerOutput: number;
  fuelMode: FuelMode;
  flexMix: { h2: number, biodiesel: number };
  activeRackCount: number;
}

// --- Financial Constants for BZL11 (Real Estate Fund Mode) ---
const GLA_TOTAL = 127435; // m²
const AVG_RENT_PER_M2 = 32.50; // R$/m² (Triple A region)
const ENERGY_INFRA_RENT = 350000; // R$/month (Rental of Solar Plant + BESS to Tenant)
const ADMIN_FEE_RATE = 0.002; // 0.2% a.a. on Net Worth
const NET_WORTH = 850000000; // R$ 850M

// Sustainability Constants
const DIESEL_DISPLACEMENT_FACTOR = 0.583; // tCO2e/MWh (Replacing Diesel Generators/Peak Grid)
const GRID_EMISSION_FACTOR = 0.092; // tCO2e/MWh (Average Brazil Grid)

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(value);
};

const CustomTooltip = ({ active, payload, label, formatter }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-700 p-2 border border-gray-600 rounded-md shadow-lg">
          <p className="label text-sm text-gray-300">{label}</p>
          {payload.map((p: any, i: number) => (
            <p key={i} style={{ color: p.color || p.fill }} className="text-sm">
              {`${p.name}: ${formatter ? formatter(p.value) : p.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
};

const Financials: React.FC<FinancialsProps> = ({
  plantStatus,
  powerOutput,
  fuelMode,
  flexMix,
  activeRackCount,
}) => {
    const [carbonPrice, setCarbonPrice] = useState(32.76); // USD per ton (I-REC + CBio blend)
    const [monthlyRevenueHistory, setMonthlyRevenueHistory] = useState<any[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCarbonPrice(prev => Math.max(28, Math.min(38, prev + (Math.random() - 0.5) * 0.5)));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const financialMetrics = useMemo(() => {
        const isOnline = plantStatus === PlantStatus.Online;
        
        // --- 1. RECEITAS (IFRS - REGIME DE COMPETÊNCIA) ---
        
        // a) Receita de Locação Logística (GLA)
        const logisticsRevenue = GLA_TOTAL * AVG_RENT_PER_M2; 

        // b) Receita de Infraestrutura (Aluguel da Usina Solar/BESS)
        const energyInfraRevenue = isOnline ? ENERGY_INFRA_RENT : 0;

        // c) Créditos de Carbono (Receita Acessória de Sustentabilidade)
        // Cálculo baseado no deslocamento de geradores a diesel (Retrofit)
        const BRL_USD_RATE = 5.0;
        const estimatedGenerationMWh = 1800; // Geração Mensal Solar
        
        // Se a usina solar substitui diesel (peak shaving) ou matriz suja
        const co2AvoidedTons = estimatedGenerationMWh * DIESEL_DISPLACEMENT_FACTOR; // ~1.050 tons
        
        const carbonRevenue = isOnline ? (co2AvoidedTons * carbonPrice * BRL_USD_RATE) : 0;

        // d) Data Center Lease (Odata - Terreno/Colocation)
        const dataCenterLeaseRevenue = 150000; 

        const totalRevenue = logisticsRevenue + energyInfraRevenue + carbonRevenue + dataCenterLeaseRevenue;

        // --- 2. CUSTOS E DESPESAS (Triple Net Lease Logic) ---
        const cogsFuel = 0; // ZERO. O sol é de graça.
        
        // Despesas do Fundo (Fund Expenses)
        const adminFee = (NET_WORTH * ADMIN_FEE_RATE) / 12; 
        const structuralMaintenance = 25000; 
        const insurance = 15000; 
        const legalConsulting = 10000;

        const totalExpenses = adminFee + structuralMaintenance + insurance + legalConsulting;

        // --- 3. RESULTADOS ---
        const grossProfit = totalRevenue; 
        const ebitda = grossProfit - totalExpenses; // NOI
        
        // Depreciação
        const solarCapex = 60000000;
        const depreciation = solarCapex / (25 * 12); 

        const ebit = ebitda - depreciation;
        const taxes = 0; 
        const netProfit = ebit - taxes; 
        const ffo = netProfit + depreciation; 

        // --- Data for Charts ---
        const revenueStreamData = [
            { name: 'Aluguel Logístico (GLA)', value: logisticsRevenue, color: '#3b82f6' }, 
            { name: 'Aluguel Usina (Solar)', value: energyInfraRevenue, color: '#f59e0b' }, 
            { name: 'Lease Data Center', value: dataCenterLeaseRevenue, color: '#8b5cf6' }, 
            { name: 'Créditos Carbono (ESG)', value: carbonRevenue, color: '#10b981' }, 
        ];
        
        const costData = [
            { name: 'Taxa de Administração', value: adminFee, color: '#ef4444' },
            { name: 'Manutenção Estrutural', value: structuralMaintenance, color: '#f97316' },
            { name: 'Seguros & Legal', value: insurance + legalConsulting, color: '#64748b' },
        ];

        return { 
            totalRevenue, grossProfit, ebitda, netProfit, ffo,
            co2AvoidedTons, carbonRevenue, revenueStreamData, costData,
            totalExpenses, depreciation
        };
    }, [plantStatus, powerOutput, fuelMode, carbonPrice]);

    // Generate History based on current metrics
    useEffect(() => {
        if(financialMetrics.totalRevenue > 0) {
            const history = [];
            const months = ['Set', 'Out', 'Nov', 'Dez', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'];
            const baseRev = financialMetrics.totalRevenue;
            
            months.forEach((m, i) => {
                const variation = 0.95 + (i * 0.005); 
                history.push({
                    month: m,
                    revenue: baseRev * variation,
                    costs: financialMetrics.totalExpenses * (1 + Math.random() * 0.05),
                    ffo: (baseRev * variation) - (financialMetrics.totalExpenses * 1.02)
                });
            });
            setMonthlyRevenueHistory(history);
        }
    }, [financialMetrics]);

    return (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <DashboardCard
                title={'DRE Gerencial (IFRS) - BZL11'}
                icon={<ChartBarIcon className="w-6 h-6" />}
                className="lg:col-span-2"
                action={
                <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors">
                    <ArrowDownTrayIcon className="w-4 h-4" /> Exportar
                </button>
                }
            >
                <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-baseline p-2 bg-gray-900/50 rounded-lg border-l-4 border-blue-500">
                        <span className="text-gray-300">Receita Bruta (Aluguéis + ESG)</span>
                        <span className="text-xl font-bold text-white">{formatCurrency(financialMetrics.totalRevenue)}</span>
                    </div>
                    <div className="flex justify-between items-baseline px-2 text-sm">
                        <span className="text-gray-400">(-) Despesas do Fundo (Adm/Manut)</span>
                        <span className="text-red-400 font-mono">-{formatCurrency(financialMetrics.totalExpenses)}</span>
                    </div>
                    <div className="flex justify-between items-baseline px-2 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="text-green-400 font-semibold text-xs py-0.5 px-1.5 bg-green-900/30 rounded border border-green-800">ZERO GEE</span>
                            <span className="text-gray-400">Custo Combustível</span>
                        </div>
                        <span className="text-gray-500 font-mono">R$ 0,00</span>
                    </div>
                    <div className="w-full border-t border-gray-700 my-1"></div>
                    <div className="flex justify-between items-baseline p-2">
                        <span className="text-gray-300 font-semibold">NOI (Lucro Operacional Líquido)</span>
                        <span className="font-bold text-green-400">{formatCurrency(financialMetrics.ebitda)}</span>
                    </div>
                    <div className="flex justify-between items-baseline p-2 bg-green-900/20 rounded-lg border border-green-900">
                        <span className="text-green-400 font-bold">FFO (Fluxo de Caixa Distribuível)</span>
                        <span className="text-2xl font-bold text-green-400">
                            {formatCurrency(financialMetrics.ffo)}
                        </span>
                    </div>
                    <p className="text-right text-[10px] text-gray-500 mt-1">* Yield Mensal estimado: {((financialMetrics.ffo / NET_WORTH) * 100).toFixed(2)}% (Isento IR)</p>
                </div>
                <div className="h-48 -ml-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={monthlyRevenueHistory} margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorFFO" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                             <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${(value/1000000).toFixed(1)}M`} />
                            <Tooltip 
                                content={<CustomTooltip formatter={formatCurrency} />}
                                wrapperStyle={{ backgroundColor: '#1A2233', border: '1px solid #2A3449', borderRadius: '0.5rem' }} 
                            />
                            <Area type="monotone" dataKey="ffo" name={'FFO (Distribuível)'} stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorFFO)" />
                            <Area type="monotone" dataKey="revenue" name={'Receita Total'} stroke="#3b82f6" strokeWidth={1} fill="none" strokeDasharray="3 3"/>
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </DashboardCard>
            
            <div className="lg:col-span-1 space-y-6">
                <DashboardCard title={'Receita de Sustentabilidade'} icon={<GlobeAltIcon className="w-6 h-6 text-green-400" />}>
                    <div className="flex flex-col h-full justify-between">
                        <div className="grid grid-cols-2 gap-4 text-center mt-2">
                            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                                <p className="text-gray-400 text-xs mb-1">CO₂ Reduzido</p>
                                <p className="text-2xl font-bold text-white">{financialMetrics.co2AvoidedTons.toFixed(0)}</p>
                                <p className="text-[10px] text-gray-500">toneladas/mês</p>
                            </div>
                            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                                <p className="text-gray-400 text-xs mb-1">Preço do Crédito</p>
                                <p className="text-2xl font-bold text-green-400">${carbonPrice.toFixed(2)}</p>
                                <p className="text-[10px] text-gray-500">USD/ton</p>
                            </div>
                        </div>
                        <div className="mt-4 p-4 bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-lg border border-green-800 text-center">
                            <p className="text-sm text-gray-300 mb-1">Receita Adicional Estimada</p>
                            <p className="text-3xl font-bold text-green-400">{formatCurrency(financialMetrics.carbonRevenue)}</p>
                            <p className="text-xs text-gray-400">Mensal</p>
                        </div>
                    </div>
                </DashboardCard>

                <DashboardCard title={'Composição de Receitas'} icon={<ChartPieIcon className="w-6 h-6" />}>
                     <div className="h-full flex flex-col justify-center">
                        <div className="flex-grow h-40 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={financialMetrics.revenueStreamData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2}>
                                        {financialMetrics.revenueStreamData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip formatter={formatCurrency} />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-1 mt-2 px-2">
                            {financialMetrics.revenueStreamData.map((item) => (
                                <div key={item.name} className="flex justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></div>
                                        <span className="text-gray-300">{item.name}</span>
                                    </div>
                                    <span className="font-mono text-white">{((item.value / financialMetrics.totalRevenue) * 100).toFixed(1)}%</span>
                                </div>
                            ))}
                        </div>
                     </div>
                </DashboardCard>
            </div>

            <DashboardCard title={'Valuation & Métricas do Fundo'} icon={<TrendingUpIcon className="w-6 h-6 text-purple-400" />} className="lg:col-span-3">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-2">
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
                        <p className="text-gray-400 text-sm mb-1">Cap Rate Implícito</p>
                        <p className="text-3xl font-bold text-white">{( (financialMetrics.totalRevenue * 12) / NET_WORTH * 100 ).toFixed(2)}%</p>
                        <p className="text-xs text-green-400 mt-1">▲ 150bps vs NTN-B</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
                        <p className="text-gray-400 text-sm mb-1">DY Anualizado (Proj.)</p>
                        <p className="text-3xl font-bold text-green-400">{( (financialMetrics.ffo * 12) / NET_WORTH * 100 ).toFixed(2)}%</p>
                        <p className="text-xs text-gray-500 mt-1">Isento de IR</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
                        <p className="text-gray-400 text-sm mb-1">Valor Patrimonial</p>
                        <p className="text-3xl font-bold text-white">R$ {(NET_WORTH / 1000000).toFixed(0)}M</p>
                        <p className="text-xs text-gray-500 mt-1">R$ 100,00 / cota</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
                        <p className="text-gray-400 text-sm mb-1">Redução Custo Inquilino</p>
                        <p className="text-3xl font-bold text-cyan-400">18%</p>
                        <p className="text-xs text-gray-500 mt-1">Energia + Manutenção</p>
                    </div>
                </div>
            </DashboardCard>

        </div>
    );
};

export default Financials;
