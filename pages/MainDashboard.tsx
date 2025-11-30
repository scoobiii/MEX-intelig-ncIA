
import React, { useState, useEffect } from 'react';
import DashboardCard from '../DashboardCard';
import {
  WalletIcon,
  BoltIcon,
  CubeTransparentIcon,
  ActivityIcon,
  GlobeAltIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  FactoryIcon,
  CheckCircleIcon,
  InfoIcon,
  TrendingUpIcon,
  ChartBarIcon,
  CloseIcon,
  SignalIcon,
  ArrowsRightLeftIcon
} from '../application/components/icons';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from 'recharts';
import { useTranslations } from '../hooks/useTranslations';
import { useSettings } from '../hooks/useSettings';
import { InvestmentFund, RealEstateAsset } from '../types';
import AssetRetrofitSimulator from '../application/components/AssetRetrofitSimulator'; // Import simulator
import IoTPlantMonitor from '../application/components/IoTPlantMonitor'; // Import Monitor

// Mock Data for Funds
const MOCK_FUNDS: InvestmentFund[] = [
    {
        ticker: 'BZL11',
        cnpj: '12.345.678/0001-90',
        name: 'BZL11 Energy & Logistics',
        admin: 'Apex Group',
        manager: 'MEX Capital',
        type: 'FII',
        strategy: 'Híbrido',
        audience: 'Qualificado',
        netWorth: 850000000,
        price: 105.50,
        p_vp: 0.98,
        dy_12m: 11.2,
        liquidityDaily: 1500000,
        assets: [
            {
                id: 'asset-1',
                name: 'CD01 BESS Solar',
                type: 'Logístico',
                address: 'Rodovia Anhanguera, km 18',
                city: 'Osasco',
                state: 'SP',
                gla: 127435,
                vacancy: 0,
                tenants: ['GPA', 'Mercado Livre'],
                energyInfrastructure: {
                    generators: ['3x 750kVA'],
                    totalBackupCapacity: 2250
                },
                retrofitDetails: {
                    solarCapacityMWp: 12,
                    bessCapacityMWh: 4,
                    annualGenerationGWh: 18,
                    co2AvoidedTons: 1500,
                    investmentCapex: 60000000,
                    equipment: ['Painéis 550W', 'Inversores Huawei', 'BESS BYD'],
                    contractType: 'Bot (Build-Operate-Transfer)',
                    technology: {
                        panels: 'Monocristalino',
                        inverters: 'String',
                        batteries: 'LFP',
                        structure: 'Carport'
                    }
                }
            }
        ],
        startDate: '15/01/2021',
        adminFee: '0.20% a.a.'
    },
    {
        ticker: 'MXRF11',
        cnpj: '98.765.432/0001-10',
        name: 'Maxi Renda FII',
        admin: 'BTG Pactual',
        manager: 'XP Vista',
        type: 'FII',
        strategy: 'Papel',
        audience: 'Geral',
        netWorth: 2500000000,
        price: 10.55,
        p_vp: 1.02,
        dy_12m: 12.5,
        liquidityDaily: 8000000,
        assets: [],
        startDate: '01/01/2012',
        adminFee: '0.90% a.a.'
    }
];

// ... (Existing FundDetailModal and other subcomponents code) ...
// To save space, I'm assuming FundDetailModal is defined above or imported.
// For the purpose of this output, I will redefine it briefly if needed, but ideally it wraps the existing one.
// Since I need to output the FULL file, I will include the full previous logic + the update.

// ==================== FUND DETAIL MODAL WITH INTEGRATION STATUS ====================

const FundDetailModal: React.FC<{ 
    fund: InvestmentFund; 
    onClose: () => void; 
    onAssetClick: (asset: RealEstateAsset) => void;
    onRetrofitClick: () => void;
    t: (k:string)=>string 
}> = ({ fund, onClose, onAssetClick, onRetrofitClick, t }) => {
    
    const IntegrationMetric: React.FC<{ label: string; value: number; color: string; icon?: React.ReactNode }> = ({ label, value, color, icon }) => (
        <div className="bg-gray-700/30 p-3 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    {icon}
                    <span className="text-gray-300 text-xs font-semibold">{label}</span>
                </div>
                <span className={`text-xs font-bold ${color}`}>{value}%</span>
            </div>
            <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                <div 
                    className={`h-full rounded-full transition-all duration-1000 ${color.replace('text-', 'bg-')}`} 
                    style={{ width: `${value}%` }}
                ></div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-gray-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-gray-800 w-full max-w-5xl rounded-xl border border-gray-700 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-700 flex justify-between items-start bg-gradient-to-r from-gray-800 to-gray-900">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="bg-gray-700 p-2 rounded-lg">
                                <FactoryIcon className="w-8 h-8 text-cyan-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    {fund.ticker} 
                                    <span className="text-sm bg-cyan-900/50 text-cyan-300 px-2 py-0.5 rounded border border-cyan-700/50 font-normal">
                                        {fund.type}
                                    </span>
                                </h2>
                                <p className="text-gray-400 text-sm mt-0.5">{fund.name}</p>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* LEFT COL: Status & Financials */}
                        <div className="space-y-6">
                            {/* INTEGRATION STATUS SECTION */}
                            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
                                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                    <ActivityIcon className="w-4 h-4 text-green-400" />
                                    Status de Integração (MEX Inteligência)
                                </h3>
                                <div className="space-y-3">
                                    <IntegrationMetric 
                                        label="CVM (Regulatório)" 
                                        value={100} 
                                        color="text-green-400" 
                                        icon={<CheckCircleIcon className="w-3 h-3 text-green-400"/>}
                                    />
                                    <IntegrationMetric 
                                        label="CCEE (Energia)" 
                                        value={85} 
                                        color="text-yellow-400" 
                                        icon={<BoltIcon className="w-3 h-3 text-yellow-400"/>}
                                    />
                                    <IntegrationMetric 
                                        label="EWX (Blockchain)" 
                                        value={100} 
                                        color="text-purple-400" 
                                        icon={<CubeTransparentIcon className="w-3 h-3 text-purple-400"/>}
                                    />
                                    <IntegrationMetric 
                                        label="MEX IA (Analítica)" 
                                        value={100} 
                                        color="text-cyan-400" 
                                        icon={<SignalIcon className="w-3 h-3 text-cyan-400"/>}
                                    />
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-700 flex justify-between text-[10px] text-gray-500">
                                    <span>Última sinc: {new Date().toLocaleTimeString()}</span>
                                    <span className="flex items-center gap-1 text-green-500">● Sistema Operacional</span>
                                </div>
                            </div>

                            {/* Financial Data */}
                            <div className="bg-gray-700/20 p-4 rounded-xl border border-gray-700">
                                <h3 className="text-sm font-bold text-white mb-3">Dados Financeiros</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-400">Preço Atual</p>
                                        <p className="text-xl font-mono text-white font-bold">R$ {fund.price?.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Dividend Yield (12m)</p>
                                        <p className="text-xl font-mono text-green-400 font-bold">{fund.dy_12m}%</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">P/VP</p>
                                        <p className="text-lg font-mono text-white">{fund.p_vp}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Patrimônio Líquido</p>
                                        <p className="text-lg font-mono text-white">R$ {(fund.netWorth/1000000).toFixed(0)}M</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COL: Assets & Docs */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            {/* Assets / Portfolio */}
                            <div>
                                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                    <MapPinIcon className="w-5 h-5 text-gray-400" />
                                    Portfólio de Ativos
                                </h3>
                                {fund.assets.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {fund.assets.map(asset => (
                                            <div 
                                                key={asset.id} 
                                                onClick={() => onAssetClick(asset)}
                                                className="bg-gray-700/40 hover:bg-gray-700/70 border border-gray-700 hover:border-cyan-500 rounded-lg p-4 cursor-pointer transition-all group"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-bold text-white group-hover:text-cyan-400 transition-colors">{asset.name}</h4>
                                                        <p className="text-xs text-gray-400 mt-1">{asset.city} - {asset.state}</p>
                                                    </div>
                                                    <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300">{asset.type}</span>
                                                </div>
                                                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-400">
                                                    <div>GLA: <span className="text-white">{asset.gla.toLocaleString()} m²</span></div>
                                                    <div>Vacância: <span className="text-white">{asset.vacancy}%</span></div>
                                                </div>
                                                {/* Specific CTA for Retrofit if applicable */}
                                                {fund.ticker === 'BZL11' && (
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onRetrofitClick();
                                                        }}
                                                        className="mt-3 w-full py-1.5 bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-white border border-green-600/50 rounded text-xs font-bold transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <BoltIcon className="w-3 h-3" /> Simular Retrofit & Tokenização
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center border border-dashed border-gray-700 rounded-lg text-gray-500">
                                        Este fundo não possui ativos físicos listados ou é um fundo de papel/multimercado.
                                    </div>
                                )}
                            </div>

                            {/* Documents */}
                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">Documentação Regulatória</h3>
                                <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
                                    {[
                                        { name: 'Relatório Gerencial (Mensal)', date: '15/10/2023', type: 'PDF' },
                                        { name: 'Informe Trimestral (3T23)', date: '30/09/2023', type: 'PDF' },
                                        { name: 'Fato Relevante - Distribuição de Rendimentos', date: '01/10/2023', type: 'PDF' },
                                        { name: 'Regulamento do Fundo', date: fund.startDate, type: 'PDF' }
                                    ].map((doc, idx) => (
                                        <div key={idx} className="p-3 border-b border-gray-800 flex justify-between items-center hover:bg-gray-800 transition-colors cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-red-900/30 p-1.5 rounded">
                                                    <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" /><path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" /></svg>
                                                </div>
                                                <span className="text-sm text-gray-300">{doc.name}</span>
                                            </div>
                                            <span className="text-xs text-gray-500">{doc.date}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==================== ASSET DETAIL MODAL ====================

const AssetDetailModal: React.FC<{ asset: RealEstateAsset; onClose: () => void }> = ({ asset, onClose }) => (
    <div className="fixed inset-0 bg-gray-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-gray-800 w-full max-w-4xl rounded-xl border border-gray-700 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-700 flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-white">{asset.name}</h2>
                    <p className="text-gray-400">{asset.address} - {asset.city}/{asset.state}</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition">
                    <CloseIcon className="w-6 h-6" />
                </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
                {/* Main Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-700/30 p-3 rounded-lg">
                        <p className="text-gray-400 text-xs">Área Locável (GLA)</p>
                        <p className="text-xl font-bold text-white">{asset.gla.toLocaleString()} m²</p>
                    </div>
                    <div className="bg-gray-700/30 p-3 rounded-lg">
                        <p className="text-gray-400 text-xs">Vacância Física</p>
                        <p className="text-xl font-bold text-green-400">{asset.vacancy}%</p>
                    </div>
                    <div className="bg-gray-700/30 p-3 rounded-lg">
                        <p className="text-gray-400 text-xs">Inquilinos</p>
                        <p className="text-sm font-semibold text-white truncate">{asset.tenants.join(', ')}</p>
                    </div>
                    <div className="bg-gray-700/30 p-3 rounded-lg">
                        <p className="text-gray-400 text-xs">Tipo</p>
                        <p className="text-lg font-bold text-cyan-400">{asset.type}</p>
                    </div>
                </div>

                {/* Retrofit Details Section */}
                {asset.retrofitDetails && (
                    <div className="mb-6 border border-green-500/30 bg-green-900/10 rounded-xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10">
                            <BoltIcon className="w-32 h-32 text-green-400" />
                        </div>
                        <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2 relative z-10">
                            <BoltIcon className="w-5 h-5" />
                            Usina de Energia Integrada (Retrofit BESS + Solar)
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                            <div>
                                <h4 className="text-sm font-bold text-white mb-2 border-b border-green-500/30 pb-1">Geração Solar</h4>
                                <ul className="space-y-1 text-sm text-gray-300">
                                    <li><span className="text-gray-500">Capacidade:</span> <span className="font-bold text-white">{asset.retrofitDetails.solarCapacityMWp} MWp</span></li>
                                    <li><span className="text-gray-500">Geração Anual:</span> {asset.retrofitDetails.annualGenerationGWh} GWh</li>
                                    <li><span className="text-gray-500">Tecnologia:</span> {asset.retrofitDetails.technology.panels}</li>
                                    <li><span className="text-gray-500">Inversores:</span> {asset.retrofitDetails.technology.inverters}</li>
                                </ul>
                            </div>
                            
                            <div>
                                <h4 className="text-sm font-bold text-white mb-2 border-b border-green-500/30 pb-1">Armazenamento (BESS)</h4>
                                <ul className="space-y-1 text-sm text-gray-300">
                                    <li><span className="text-gray-500">Capacidade:</span> <span className="font-bold text-white">{asset.retrofitDetails.bessCapacityMWh} MWh</span></li>
                                    <li><span className="text-gray-500">Química:</span> {asset.retrofitDetails.technology.batteries}</li>
                                    <li><span className="text-gray-500">Uso:</span> Peak Shaving</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-sm font-bold text-white mb-2 border-b border-green-500/30 pb-1">Performance ESG</h4>
                                <ul className="space-y-1 text-sm text-gray-300">
                                    <li><span className="text-gray-500">CO2 Evitado:</span> <span className="font-bold text-green-400">{asset.retrofitDetails.co2AvoidedTons} t/ano</span></li>
                                    <li><span className="text-gray-500">Contrato:</span> {asset.retrofitDetails.contractType}</li>
                                    <li><span className="text-gray-500">Status:</span> <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-xs">Operacional</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Technical Specs & Amenities */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-bold text-white mb-3">Especificações Técnicas</h3>
                        <div className="bg-gray-900 rounded-lg p-4 space-y-2 text-sm text-gray-300">
                            {asset.ceilingHeight && <div className="flex justify-between border-b border-gray-800 pb-1"><span>Pé-direito livre:</span> <span className="text-white">{asset.ceilingHeight} m</span></div>}
                            {asset.floorCapacity && <div className="flex justify-between border-b border-gray-800 pb-1"><span>Capacidade do piso:</span> <span className="text-white">{asset.floorCapacity} ton/m²</span></div>}
                            {asset.dockCount && <div className="flex justify-between border-b border-gray-800 pb-1"><span>Docas:</span> <span className="text-white">{asset.dockCount}</span></div>}
                            {asset.security && <div className="flex justify-between border-b border-gray-800 pb-1"><span>Segurança:</span> <span className="text-white">{asset.security}</span></div>}
                            {asset.energyInfrastructure && (
                                <div className="pt-2">
                                    <span className="text-gray-500 block mb-1">Infraestrutura de Energia (Legado):</span>
                                    <span className="text-white block bg-gray-800 p-2 rounded border border-gray-700">
                                        {asset.energyInfrastructure.generators.join(', ')} ({asset.energyInfrastructure.totalBackupCapacity} kVA)
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-bold text-white mb-3">Amenidades e Transporte</h3>
                        <div className="bg-gray-900 rounded-lg p-4 space-y-4">
                            {asset.amenities && (
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Serviços no Condomínio</p>
                                    <div className="flex flex-wrap gap-2">
                                        {asset.amenities.map(a => <span key={a} className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs text-gray-300">{a}</span>)}
                                    </div>
                                </div>
                            )}
                            {asset.transport && (
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Acesso e Logística</p>
                                    <ul className="space-y-1">
                                        {asset.transport.map(t => (
                                            <li key={t} className="flex items-center gap-2 text-sm text-gray-300">
                                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span> {t}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// ==================== MAIN DASHBOARD COMPONENT ====================

const MainDashboard: React.FC = () => {
    const { language } = useSettings();
    const { t } = useTranslations(language);
    const [selectedFund, setSelectedFund] = useState<InvestmentFund | null>(null);
    const [selectedAssetDetail, setSelectedAssetDetail] = useState<RealEstateAsset | null>(null);
    const [selectedFundForRetrofit, setSelectedFundForRetrofit] = useState<{fund: InvestmentFund, asset: RealEstateAsset} | null>(null);
    const [selectedFundDetail, setSelectedFundDetail] = useState<InvestmentFund | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Filters
    const [strategyFilter, setStrategyFilter] = useState('Todas');
    const [audienceFilter, setAudienceFilter] = useState('Todos');

    const strategies = ['Todas', 'Logística', 'Híbrido', 'Papel', 'Shopping', 'Desenvolvimento'];
    const audiences = ['Todos', 'Geral', 'Qualificado', 'Profissional'];

    // Trading data
    const [mockOrderBook] = useState([
        { price: 105.60, amount: 50, total: 5280, type: 'ask' },
        { price: 105.55, amount: 120, total: 12666, type: 'ask' },
        { price: 105.50, amount: 300, total: 31650, type: 'ask' }, // Current
        { price: 105.45, amount: 200, total: 21090, type: 'bid' },
        { price: 105.40, amount: 80, total: 8432, type: 'bid' },
    ]);

    const handleFundClick = (fund: InvestmentFund) => {
        setSelectedFund(fund);
    };

    const filteredFunds = MOCK_FUNDS.filter(f => {
        const matchesSearch = f.ticker.toLowerCase().includes(searchQuery.toLowerCase()) || f.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStrategy = strategyFilter === 'Todas' || f.strategy === strategyFilter;
        const matchesAudience = audienceFilter === 'Todos' || f.audience === audienceFilter;
        return matchesSearch && matchesStrategy && matchesAudience;
    });

    return (
        <div className="mt-6 space-y-6">
            
            {/* Header / Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <DashboardCard title={t('ewx.funds.equity')} icon={<WalletIcon className="w-5 h-5 text-green-400" />}>
                    <div className="flex flex-col justify-center h-20">
                        <p className="text-3xl font-bold text-white">R$ 1.250.450</p>
                        <p className="text-sm text-green-400 flex items-center gap-1">
                            <TrendingUpIcon className="w-3 h-3" /> +2.4% (Hoje)
                        </p>
                    </div>
                </DashboardCard>
                <DashboardCard title={t('ewx.funds.daily_pnl')} icon={<ChartBarIcon className="w-5 h-5 text-cyan-400" />}>
                    <div className="flex flex-col justify-center h-20">
                        <p className="text-3xl font-bold text-cyan-400">+ R$ 4.250</p>
                        <p className="text-sm text-gray-400">12 transações</p>
                    </div>
                </DashboardCard>
                <DashboardCard title="Tokens de Energia" icon={<BoltIcon className="w-5 h-5 text-yellow-400" />}>
                    <div className="flex flex-col justify-center h-20">
                        <p className="text-3xl font-bold text-white">450.000 <span className="text-base text-gray-400 font-normal">MEX-kWh</span></p>
                        <p className="text-sm text-gray-400">Equiv. R$ 225.000</p>
                    </div>
                </DashboardCard>
                <DashboardCard title="Nós Galaxy" icon={<GlobeAltIcon className="w-5 h-5 text-purple-400" />}>
                    <div className="flex flex-col justify-center h-20">
                        <p className="text-3xl font-bold text-white">3 <span className="text-base text-gray-400 font-normal">Ativos</span></p>
                        <p className="text-sm text-purple-400">APY Est. 14%</p>
                    </div>
                </DashboardCard>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left: Fund Marketplace */}
                <div className="lg:col-span-2">
                    <DashboardCard 
                        title={t('ewx.funds.title')} 
                        icon={<MagnifyingGlassIcon className="w-6 h-6" />}
                        action={
                            <div className="flex gap-2">
                                <select 
                                    className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500"
                                    value={strategyFilter}
                                    onChange={(e) => setStrategyFilter(e.target.value)}
                                >
                                    {strategies.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <select 
                                    className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500"
                                    value={audienceFilter}
                                    onChange={(e) => setAudienceFilter(e.target.value)}
                                >
                                    {audiences.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                                <div className="relative w-48">
                                    <input 
                                        type="text" 
                                        placeholder={t('ewx.funds.search')}
                                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1 text-xs text-white focus:outline-none focus:border-cyan-500"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <MagnifyingGlassIcon className="w-3 h-3 text-gray-400 absolute right-2 top-1.5" />
                                </div>
                            </div>
                        }
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-300">
                                <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                                    <tr>
                                        <th className="px-4 py-3">Ticker</th>
                                        <th className="px-4 py-3">Nome</th>
                                        <th className="px-4 py-3">Preço</th>
                                        <th className="px-4 py-3">DY (12m)</th>
                                        <th className="px-4 py-3">P/VP</th>
                                        <th className="px-4 py-3 text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {filteredFunds.map((fund) => (
                                        <tr 
                                            key={fund.ticker} 
                                            className="hover:bg-gray-700/30 transition-colors cursor-pointer"
                                            onClick={() => setSelectedFundDetail(fund)}
                                        >
                                            <td className="px-4 py-3 font-medium text-white">{fund.ticker}</td>
                                            <td className="px-4 py-3">{fund.name}</td>
                                            <td className="px-4 py-3 font-mono text-cyan-400">R$ {fund.price?.toFixed(2)}</td>
                                            <td className="px-4 py-3 text-green-400 font-bold">{fund.dy_12m}%</td>
                                            <td className="px-4 py-3">{fund.p_vp}</td>
                                            <td className="px-4 py-3 text-right">
                                                <button 
                                                    className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-bold transition-colors"
                                                >
                                                    Detalhes
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </DashboardCard>
                </div>

                {/* Right: Order Book & Trading */}
                <div className="lg:col-span-1 space-y-6">
                    <DashboardCard title={t('ewx.market.trade_title')} icon={<ArrowsRightLeftIcon className="w-6 h-6" />}>
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <button className="flex-1 bg-green-600 hover:bg-green-500 py-2 rounded text-sm font-bold text-white transition-colors">{t('ewx.market.buy')}</button>
                                <button className="flex-1 bg-gray-700 hover:bg-red-500 py-2 rounded text-sm font-bold text-gray-300 hover:text-white transition-colors">{t('ewx.market.sell')}</button>
                            </div>
                            
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">{t('ewx.market.limit_order')}</label>
                                <div className="relative">
                                    <input type="number" className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white font-mono text-right focus:border-cyan-500 focus:outline-none" defaultValue={105.50} />
                                    <span className="absolute left-3 top-2 text-gray-500 text-sm">R$</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Quantidade</label>
                                <input type="number" className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white font-mono text-right focus:border-cyan-500 focus:outline-none" defaultValue={100} />
                            </div>

                            <button className="w-full bg-cyan-600 hover:bg-cyan-500 py-3 rounded text-white font-bold transition-colors shadow-lg">
                                {t('ewx.market.execute')}
                            </button>
                        </div>
                    </DashboardCard>

                    <DashboardCard title={t('ewx.market.orderBook')} icon={<InfoIcon className="w-6 h-6" />}>
                        <div className="space-y-1 font-mono text-xs">
                            <div className="grid grid-cols-3 text-gray-500 pb-1 border-b border-gray-700 mb-1">
                                <span>Preço</span>
                                <span className="text-right">Quant.</span>
                                <span className="text-right">Total</span>
                            </div>
                            {mockOrderBook.map((order, idx) => (
                                <div key={idx} className="grid grid-cols-3 hover:bg-gray-700/50 cursor-pointer">
                                    <span className={order.type === 'ask' ? 'text-red-400' : 'text-green-400'}>{order.price.toFixed(2)}</span>
                                    <span className="text-right text-gray-300">{order.amount}</span>
                                    <span className="text-right text-gray-500">{order.total.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </DashboardCard>
                </div>
            </div>

            {/* IoT Monitor Widget (Added to main dashboard flow for visibility) */}
            <div className="col-span-12">
               <IoTPlantMonitor />
            </div>

            {/* Fund Detail Modal */}
            {selectedFundDetail && (
                <FundDetailModal 
                    fund={selectedFundDetail} 
                    onClose={() => setSelectedFundDetail(null)} 
                    onAssetClick={(asset) => {
                        setSelectedFundDetail(null); 
                        setSelectedAssetDetail(asset);
                    }}
                    onRetrofitClick={() => {
                        if(selectedFundDetail.assets.length > 0) {
                            setSelectedFundDetail(null);
                            setSelectedFundForRetrofit({ fund: selectedFundDetail, asset: selectedFundDetail.assets[0] });
                        }
                    }}
                    t={t}
                />
            )}

            {/* Asset Detail Modal */}
            {selectedAssetDetail && (
                <AssetDetailModal 
                    asset={selectedAssetDetail} 
                    onClose={() => setSelectedAssetDetail(null)} 
                />
            )}

            {/* Retrofit Simulator */}
            {selectedFundForRetrofit && (
                <AssetRetrofitSimulator 
                    fund={selectedFundForRetrofit.fund}
                    asset={selectedFundForRetrofit.asset}
                    onClose={() => setSelectedFundForRetrofit(null)}
                    t={t}
                />
            )}
        </div>
    );
};

export default MainDashboard;
