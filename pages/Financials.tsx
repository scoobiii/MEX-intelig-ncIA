
import React, { useState, useEffect, useMemo } from 'react';
import DashboardCard from '../DashboardCard';
import { ChartBarIcon, BoltIcon, ArrowDownTrayIcon, ChartPieIcon, TrendingUpIcon, ComputerDesktopIcon, FactoryIcon } from '../application/components/icons';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, BarChart, Bar, CartesianGrid } from 'recharts';
import { PlantStatus, FuelMode } from '../types';

interface FinancialsProps {
  plantStatus: PlantStatus;
  powerOutput: number;
  fuelMode: FuelMode;
  flexMix: { h2: number, biodiesel: number };
  activeRackCount: number;
}

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
    const [carbonPrice, setCarbonPrice] = useState(32.50); // USD per ton
    const [monthlyRevenueHistory, setMonthlyRevenueHistory] = useState<any[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCarbonPrice(prev => Math.max(25, Math.min(45, prev + (Math.random() - 0.5) * 1.5)));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const financialMetrics = useMemo(() => {
        const isOnline = plantStatus === PlantStatus.Online;
        const isRealEstateMode = fuelMode === FuelMode.SolarBess; // BZL11 Mode

        // --- IFRS LOGIC SELECTION ---
        if (isRealEstateMode) {
            // === FII / REAL ESTATE MODEL (Triple Net) ===
            // Context: BZL11 Fund owning CD01
            
            const GLA_TOTAL = 127435; // m²
            const AVG_RENT_PER_M2 = 32.50; // R$/m² (Triple A region)
            const ENERGY_INFRA_RENT = 350000; // R$/month (Lease of Solar/BESS equipment)
            const ADMIN_FEE_RATE = 0.002; // 0.2% a.a. on Net Worth
            const NET_WORTH = 850000000; // R$ 850M

            // 1. Revenues
            const logisticsRevenue = GLA_TOTAL * AVG_RENT_PER_M2; // ~R$ 4.14M
            const energyInfraRevenue = isOnline ? ENERGY_INFRA_RENT : 0;
            const dataCenterLeaseRevenue = 150000; // Lease to Odata
            
            // Carbon Credits (Fund receives part of it)
            const BRL_USD_RATE = 5.0;
            const estimatedGenerationMWh = 1800;
            const co2AvoidedTons = estimatedGenerationMWh * 0.1;
            const carbonRevenue = co2AvoidedTons * carbonPrice * BRL_USD_RATE;

            const totalRevenue = logisticsRevenue + energyInfraRevenue + carbonRevenue + dataCenterLeaseRevenue;

            // 2. Costs (Triple Net - Tenant pays OPEX)
            const cogsFuel = 0; // No fuel cost for Fund
            const adminFee = (NET_WORTH * ADMIN_FEE_RATE) / 12; // ~R$ 141k/mo
            const structuralMaintenance = 25000; // Roof/Structure only
            const insurance = 15000;
            const legalConsulting = 10000;

            const totalExpenses = adminFee + structuralMaintenance + insurance + legalConsulting;

            // 3. Results
            const grossProfit = totalRevenue;
            const ebitda = grossProfit - totalExpenses; // NOI
            const depreciation = 60000000 / (25 * 12); // Solar CAPEX deprec.
            const ebit = ebitda - depreciation;
            const taxes = 0; // FII exempt
            const netProfit = ebit;
            const ffo = netProfit + depreciation; // Distributable

            const revenueStreamData = [
                { name: 'Aluguel Logístico (GLA)', value: logisticsRevenue, color: '#3b82f6' },
                { name: 'Aluguel Usina (Solar)', value: energyInfraRevenue, color: '#f59e0b' },
                { name: 'Lease Data Center', value: dataCenterLeaseRevenue, color: '#8b5cf6' },
                { name: 'Créditos Carbono', value: carbonRevenue, color: '#10b981' },
            ];
            
            const costData = [
                { name: 'Taxa de Administração', value: adminFee, color: '#ef4444' },
                { name: 'Manutenção Estrutural', value: structuralMaintenance, color: '#f97316' },
                { name: 'Seguros & Legal', value: insurance + legalConsulting, color: '#64748b' },
            ];

            return { 
                totalRevenue, grossProfit, ebitda, netProfit, ffo,
                co2ReducedTons: co2AvoidedTons, carbonRevenue, revenueStreamData, costData,
                totalExpenses, depreciation, mode: 'FII', netWorth: NET_WORTH
            };

        } else {
            // === INDUSTRIAL / THERMAL MODEL ===
            const REVENUE_PER_RACK_PER_MONTH = 285000;
            const OPEX_PER_RACK_PER_MONTH = 2500;
            const TAX_RATE = 0.25;
            const ENERGY_PRICE_BRL_PER_MWH = 550;
            const BRL_USD_RATE = 5.0;

            const monthlyMWh = powerOutput * 24 * 30;
            const energyRevenue = isOnline ? monthlyMWh * ENERGY_PRICE_BRL_PER_MWH : 0;
            const cloudRevenue = isOnline ? activeRackCount * REVENUE_PER_RACK_PER_MONTH : 0;
            const co2ReducedTons = isOnline && fuelMode !== FuelMode.NaturalGas ? (monthlyMWh * 0.2) : 0; // Simplified
            const carbonRevenue = co2ReducedTons * carbonPrice * BRL_USD_RATE;

            const totalRevenue = energyRevenue + cloudRevenue + carbonRevenue;

            const baseFuelCost = 950000;
            const baselinePower = 2250;
            const cogsFuel = isOnline ? baseFuelCost * (powerOutput / baselinePower) : 0;
            const grossProfit = totalRevenue - cogsFuel;

            const opexMaintenance = isOnline ? 550000 : 0;
            const opexPersonnel = isOnline ? 300000 : 0;
            const opexDataCenter = isOnline ? activeRackCount * OPEX_PER_RACK_PER_MONTH : 0;
            const totalOpex = opexMaintenance + opexPersonnel + opexDataCenter;

            const ebitda = grossProfit - totalOpex;
            const depreciation = 12500000;
            const ebit = ebitda - depreciation;
            const taxes = ebit > 0 ? ebit * TAX_RATE : 0;
            const netProfit = ebit - taxes;
            const ffo = netProfit + depreciation;

            const revenueStreamData = [
                { name: 'Venda de Energia', value: energyRevenue, color: '#f59e0b' },
                { name: 'Serviços em Nuvem', value: cloudRevenue, color: '#8b5cf6' },
                { name: 'Créditos de Carbono', value: carbonRevenue, color: '#10b981' },
            ];
            
            const costData = [
                { name: 'Combustível (CPV)', value: cogsFuel, color: '#34d399' },
                { name: 'Manutenção', value: opexMaintenance, color: '#6ee7b7' },
                { name: 'Pessoal', value: opexPersonnel, color: '#a7f3d0' },
                { name: 'Data Center (OPEX)', value: opexDataCenter, color: '#fb923c' },
            ];

            return { 
                totalRevenue, grossProfit, ebitda, netProfit, ffo,
                co2ReducedTons, carbonRevenue, revenueStreamData, costData,
                totalExpenses: cogsFuel + totalOpex, depreciation, mode: 'IND', netWorth: 0
            };
        }
    }, [plantStatus, powerOutput, fuelMode, flexMix, carbonPrice, activeRackCount]);

    // Generate History based on current metrics
    useEffect(() => {
        if(financialMetrics.totalRevenue > 0) {
            const history = [];
            const months = ['Ago', 'Set', 'Out', 'Nov', 'Dez', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'];
            const baseRev = financialMetrics.totalRevenue;
            
            months.forEach((m, i) => {
                const variation = 0.95 + (i * 0.005); 
                history.push({
                    month: m,
                    revenue: baseRev * variation,
                    ffo: (baseRev * variation) - (financialMetrics.totalExpenses * 1.02)
                });
            });
            setMonthlyRevenueHistory(history);
        }
    }, [financialMetrics]);

    return (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <DashboardCard
                title={financialMetrics.mode === 'FII' ? 'DRE Gerencial (IFRS) - BZL11' : 'Demonstração de Resultados (DRE)'}
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
                        <span className="text-gray-300">
                            {financialMetrics.mode === 'FII' ? 'Receita Bruta (Aluguéis)' : 'Receita Total'}
                        </span>
                        <span className="text-xl font-bold text-white">{formatCurrency(financialMetrics.totalRevenue)}</span>
                    </div>
                    
                    {financialMetrics.mode === 'FII' ? (
                        <>
                            <div className="flex justify-between items-baseline px-2 text-sm">
                                <span className="text-gray-400">(-) Despesas do Fundo (Adm/Manut)</span>
                                <span className="text-red-400 font-mono">-{formatCurrency(financialMetrics.totalExpenses)}</span>
                            </div>
                            <div className="flex justify-between items-baseline px-2 text-sm">
                                <span className="text-gray-400">(-) Custo Combustível/Energia (Cliente)</span>
                                <span className="text-gray-500 font-mono">R$ 0,00 (Triple Net)</span>
                            </div>
                        </>
                    ) : (
                        <div className="flex justify-between items-baseline px-2 text-sm">
                            <span className="text-gray-400">(-) Custos Totais</span>
                            <span className="text-red-400 font-mono">-{formatCurrency(financialMetrics.totalExpenses)}</span>
                        </div>
                    )}

                    <div className="w-full border-t border-gray-700 my-1"></div>
                    <div className="flex justify-between items-baseline p-2">
                        <span className="text-gray-300 font-semibold">NOI (EBITDA)</span>
                        <span className="font-bold text-green-400">{formatCurrency(financialMetrics.ebitda)}</span>
                    </div>
                    <div className="flex justify-between items-baseline p-2 bg-green-900/20 rounded-lg border border-green-900">
                        <span className="text-green-400 font-bold">
                            {financialMetrics.mode === 'FII' ? 'FFO (Fluxo de Caixa Distribuível)' : 'Lucro Líquido'}
                        </span>
                        <span className="text-2xl font-bold text-green-400">
                            {formatCurrency(financialMetrics.mode === 'FII' ? financialMetrics.ffo : financialMetrics.netProfit)}
                        </span>
                    </div>
                    {financialMetrics.mode === 'FII' && (
                        <p className="text-right text-[10px] text-gray-500 mt-1">* Yield Mensal estimado: {((financialMetrics.ffo / financialMetrics.netWorth) * 100).toFixed(2)}% (Isento IR)</p>
                    )}
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
                            <Area type="monotone" dataKey="ffo" name={financialMetrics.mode === 'FII' ? 'FFO' : 'Lucro'} stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorFFO)" />
                            <Area type="monotone" dataKey="revenue" name={'Receita Total'} stroke="#3b82f6" strokeWidth={1} fill="none" strokeDasharray="3 3"/>
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </DashboardCard>
            
            <DashboardCard title={'Composição de Receitas'} icon={<ChartPieIcon className="w-6 h-6" />}>
                 <div className="h-full flex flex-col justify-center">
                    <div className="flex-grow h-56 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={financialMetrics.revenueStreamData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2}>
                                    {financialMetrics.revenueStreamData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                                </Pie>
                                <Tooltip content={<CustomTooltip formatter={formatCurrency} />} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-gray-400 text-xs">Receita Mensal</span>
                            <span className="text-xl font-bold text-white">{formatCurrency(financialMetrics.totalRevenue).split(',')[0]}</span>
                        </div>
                    </div>
                    <div className="space-y-2 mt-2 px-2">
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

            {financialMetrics.mode === 'FII' ? (
                <DashboardCard title={'Valuation & Métricas do Fundo'} icon={<TrendingUpIcon className="w-6 h-6 text-purple-400" />} className="lg:col-span-3">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-2">
                        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
                            <p className="text-gray-400 text-sm mb-1">Cap Rate Implícito</p>
                            <p className="text-3xl font-bold text-white">{( (financialMetrics.totalRevenue * 12) / financialMetrics.netWorth * 100 ).toFixed(2)}%</p>
                            <p className="text-xs text-green-400 mt-1">▲ 150bps vs NTN-B</p>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
                            <p className="text-gray-400 text-sm mb-1">DY Anualizado (Proj.)</p>
                            <p className="text-3xl font-bold text-green-400">{( (financialMetrics.ffo * 12) / financialMetrics.netWorth * 100 ).toFixed(2)}%</p>
                            <p className="text-xs text-gray-500 mt-1">Isento de IR</p>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
                            <p className="text-gray-400 text-sm mb-1">Valor Patrimonial</p>
                            <p className="text-3xl font-bold text-white">R$ {(financialMetrics.netWorth / 1000000).toFixed(0)}M</p>
                            <p className="text-xs text-gray-500 mt-1">R$ 100,00 / cota</p>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
                            <p className="text-gray-400 text-sm mb-1">Redução Custo Inquilino</p>
                            <p className="text-3xl font-bold text-cyan-400">18%</p>
                            <p className="text-xs text-gray-500 mt-1">Energia + Manutenção</p>
                        </div>
                    </div>
                </DashboardCard>
            ) : (
                <DashboardCard title={'Eficiência Operacional'} icon={<FactoryIcon className="w-6 h-6" />} className="lg:col-span-3">
                     <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={[{ name: 'Margem', receita: 100, custo: (financialMetrics.totalExpenses / financialMetrics.totalRevenue) * 100 }]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2A3449" horizontal={false}/>
                                <XAxis type="number" domain={[0, 100]} hide />
                                <YAxis type="category" dataKey="name" hide />
                                <Tooltip cursor={{fill: 'transparent'}} content={() => null} />
                                <Bar dataKey="receita" name="Receita Total" fill="#1f2937" radius={[4, 4, 4, 4]} barSize={40} background={{ fill: '#374151' }} />
                                <Bar dataKey="receita" name="Margem Líquida" fill="#10b981" radius={[4, 4, 4, 4]} barSize={40} label={{ position: 'right', fill: '#fff', formatter: () => `Margem: ${((financialMetrics.netProfit/financialMetrics.totalRevenue)*100).toFixed(1)}%` }} />
                            </BarChart>
                        </ResponsiveContainer>
                     </div>
                </DashboardCard>
            )}

        </div>
    );
};

export default Financials;
