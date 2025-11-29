
import React, { useState, useEffect } from 'react';
import {
  WalletIcon,
  BoltIcon,
  CubeTransparentIcon,
  ArrowsRightLeftIcon,
  ActivityIcon,
  GlobeAltIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  FactoryIcon,
  CheckCircleIcon,
  InfoIcon,
  TrendingUpIcon,
  ChartBarIcon,
  ServerRackIcon
} from '../application/components/icons';
import { OHLCV, OrderBookItem, FundAsset, InvestmentFund, RealEstateAsset, GalaxySubscription, BridgeTransaction } from '../types';
import DashboardCard from '../DashboardCard';
import LanguageSwitcher from '../application/components/LanguageSwitcher';
import { useSettings } from '../hooks/useSettings';
import { useTranslations } from '../hooks/useTranslations';
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// FIX: Extend window type to include ethereum property for wallet interaction.
declare global {
  interface Window {
    ethereum?: any;
  }
}

// ==================== MOCK DATA ====================

const generateOHLCV = (points: number): OHLCV[] => {
  const data: OHLCV[] = [];
  let price = 250; 
  let date = new Date();
  date.setDate(date.getDate() - points);

  for (let i = 0; i < points; i++) {
    date.setHours(date.getHours() + 1);
    const open = price;
    const change = (Math.random() - 0.5) * 10;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * 5;
    const low = Math.min(open, close) - Math.random() * 5;
    const volume = Math.floor(Math.random() * 5000) + 1000;
    price = close;
    data.push({
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      open, high, low, close, volume,
      ema7: close * (1 + (Math.random() - 0.5) * 0.02),
      ema25: close * (1 + (Math.random() - 0.5) * 0.05),
    });
  }
  return data;
};

const mockOrderBook: OrderBookItem[] = Array.from({ length: 10 }).map((_, i) => ({
    price: 250 + (i * 2) * (Math.random() > 0.5 ? 1 : -1),
    amount: Math.floor(Math.random() * 500),
    total: 0,
    type: (Math.random() > 0.5 ? 'ask' : 'bid') as 'ask' | 'bid'
})).sort((a, b) => b.price - a.price);

const fundPortfolio: FundAsset[] = [
    { symbol: 'MEX-kWh', name: 'Energy Token', allocation: 45, value: 4500000, change24h: 2.5 },
    { symbol: 'EWT', name: 'Energy Web Token', allocation: 25, value: 2500000, change24h: -1.2 },
    { symbol: 'VT', name: 'Volta Token', allocation: 20, value: 2000000, change24h: 5.8 },
    { symbol: 'USDC', name: 'Liquidity', allocation: 10, value: 1000000, change24h: 0.01 },
];

const FUND_COLORS = ['#06b6d4', '#6d28d9', '#a855f7', '#64748b'];

const GALAXY_SUBSCRIPTIONS: GalaxySubscription[] = [
    { id: '1', name: 'Green Proofs Validator', description: 'Validate renewable energy certificates (I-RECs) issuance.', apy: 12.5, minStake: 1000, participants: 450, status: 'Active' },
    { id: '2', name: 'Grid Balancer Node', description: 'Participate in frequency response markets.', apy: 18.2, minStake: 5000, participants: 120, status: 'Active' },
    { id: '3', name: 'Carbon Credit Oracle', description: 'Data feed for carbon offset verification.', apy: 8.5, minStake: 500, participants: 800, status: 'Full' },
];

// Reusing existing CVM data from previous prompts
const LOGISTIC_ASSETS_MOCK: RealEstateAsset[] = [
    { id: '1', name: 'CD 01 - Osasco (Triple A)', type: 'Logístico', address: 'Rodovia Anhanguera, Km 17,8', state: 'SP', city: 'Osasco', gla: 127435, vacancy: 0, tenants: ['Grande Varejista'], description: 'Centro de distribuição Triple A monousuário.', amenities: ['Restaurante', 'Ambulatório'], transport: ['Rodoanel', 'Marginal Tietê'] },
    { id: '2', name: 'HGLG Itupeva', type: 'Logístico', address: 'Rod. Vice-Prefeito Hermenegildo Tonoli', state: 'SP', city: 'Itupeva', gla: 85000, vacancy: 2.5, tenants: ['Volkswagen', 'DHL'] },
];

const FUNDS_CVM_DATA: InvestmentFund[] = [
    { ticker: 'HGLG11', cnpj: '11.111.111/0001-11', name: 'CSHG Logística', admin: 'Credit Suisse', manager: 'CSHG', type: 'FII', strategy: 'Logística', audience: 'Geral', netWorth: 5200000000, price: 165.50, p_vp: 1.05, dy_12m: 9.2, liquidityDaily: 8000000, assets: [LOGISTIC_ASSETS_MOCK[1]], startDate: '06/06/2010', adminFee: '0,6% a.a.' },
    { ticker: 'APEX11', cnpj: '55.555.555/0001-55', name: 'Apex Institucional FII', admin: 'ApexGroup', manager: 'Apex Capital', type: 'FII', strategy: 'Institucional', audience: 'Profissional', netWorth: 500000000, price: 1000.00, p_vp: 0.95, dy_12m: 12.5, liquidityDaily: 500000, assets: [], startDate: '20/02/2022', adminFee: '0,5% a.a.' },
    { ticker: 'BZEL11', cnpj: '35.507.610/0001-60', name: 'Barzel CD1 FII', admin: 'Vórtx', manager: 'Barzel Properties', type: 'FII', strategy: 'Híbrido', audience: 'Profissional', netWorth: 850000000, price: 100.00, p_vp: 1.0, dy_12m: 8.8, liquidityDaily: 0, assets: [LOGISTIC_ASSETS_MOCK[0]], startDate: '21/01/2020', adminFee: 'N/A' },
];

// ==================== SUB-COMPONENTS ====================

const FinancialChart: React.FC<{ data: OHLCV[] }> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="time" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} minTickGap={30}/>
                <YAxis yAxisId="left" orientation="left" stroke="#06b6d4" fontSize={10} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                <YAxis yAxisId="right" orientation="right" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '4px' }}
                    itemStyle={{ fontSize: '12px' }}
                    labelStyle={{ color: '#9ca3af', marginBottom: '5px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area yAxisId="left" type="monotone" dataKey="close" name="Preço (MEX-kWh)" stroke="#06b6d4" fill="url(#colorPrice)" strokeWidth={2} />
                <Line yAxisId="left" type="monotone" dataKey="ema7" name="EMA 7" stroke="#fbbf24" strokeWidth={1} dot={false} />
                <Bar yAxisId="right" dataKey="volume" name="Volume" fill="#374151" opacity={0.5} barSize={10} />
            </ComposedChart>
        </ResponsiveContainer>
    );
};

const OrderBook: React.FC<{ orders: OrderBookItem[], t: (k:string)=>string }> = ({ orders, t }) => {
    const asks = orders.filter(o => o.type === 'ask').sort((a, b) => a.price - b.price).slice(0, 7).reverse();
    const bids = orders.filter(o => o.type === 'bid').sort((a, b) => b.price - a.price).slice(0, 7);

    return (
        <div className="text-xs font-mono">
            <div className="grid grid-cols-3 text-gray-500 mb-2 px-2">
                <span>{t('ewx.funds.price')} (R$)</span>
                <span className="text-right">Quant (MWh)</span>
                <span className="text-right">Total</span>
            </div>
            <div className="space-y-0.5">
                {asks.map((order, i) => (
                    <div key={`ask-${i}`} className="grid grid-cols-3 px-2 py-1 hover:bg-gray-700/50 cursor-pointer relative">
                        <span className="text-red-400">{order.price.toFixed(2)}</span>
                        <span className="text-right text-gray-300">{order.amount}</span>
                        <span className="text-right text-gray-400">{(order.price * order.amount).toLocaleString()}</span>
                        <div className="absolute right-0 top-0 bottom-0 bg-red-500/10" style={{ width: `${Math.random() * 40}%` }}></div>
                    </div>
                ))}
                <div className="py-2 border-y border-gray-700 my-1 text-center font-bold text-lg text-white">
                    250.00 <span className="text-xs font-normal text-gray-400">R$/MWh</span>
                </div>
                {bids.map((order, i) => (
                    <div key={`bid-${i}`} className="grid grid-cols-3 px-2 py-1 hover:bg-gray-700/50 cursor-pointer relative">
                        <span className="text-green-400">{order.price.toFixed(2)}</span>
                        <span className="text-right text-gray-300">{order.amount}</span>
                        <span className="text-right text-gray-400">{(order.price * order.amount).toLocaleString()}</span>
                        <div className="absolute right-0 top-0 bottom-0 bg-green-500/10" style={{ width: `${Math.random() * 40}%` }}></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const GalaxySubscriptionsView: React.FC<{ subscriptions: GalaxySubscription[], t: (k:string)=>string }> = ({ subscriptions, t }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscriptions.map(sub => (
            <div key={sub.id} className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-purple-500 transition-all shadow-lg">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-purple-900/30 rounded-lg">
                        <GlobeAltIcon className="w-8 h-8 text-purple-400" />
                    </div>
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${sub.status === 'Active' ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}>
                        {sub.status}
                    </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{sub.name}</h3>
                <p className="text-sm text-gray-400 mb-6">{sub.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div>
                        <p className="text-gray-500">{t('ewx.galaxy.apy')}</p>
                        <p className="text-lg font-bold text-green-400">{sub.apy}%</p>
                    </div>
                    <div>
                        <p className="text-gray-500">{t('ewx.galaxy.minStake')}</p>
                        <p className="text-lg font-bold text-white">{sub.minStake} EWT</p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-gray-500">{t('ewx.galaxy.activeWorkers')}</p>
                        <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(sub.participants / 1000) * 100}%` }}></div>
                        </div>
                        <p className="text-xs text-right mt-1 text-purple-300">{sub.participants} Nodes</p>
                    </div>
                </div>

                <button disabled={sub.status !== 'Active'} className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 text-white font-bold rounded-lg transition-colors shadow-lg shadow-purple-900/20">
                    {sub.status === 'Active' ? t('ewx.galaxy.subscribe') : t('ewx.galaxy.poolFull')}
                </button>
            </div>
        ))}
    </div>
);

const EWTBridge: React.FC<{ t: (k:string)=>string }> = ({ t }) => {
    const [direction, setDirection] = useState<'Lift' | 'Lower'>('Lift');
    const [amount, setAmount] = useState('');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <DashboardCard title={t('ewx.bridge.title')} icon={<ArrowsRightLeftIcon className="w-6 h-6 text-cyan-400" />}>
                <div className="space-y-6 p-2">
                    <div className="flex justify-center items-center gap-4 bg-gray-900/50 p-4 rounded-lg">
                        <div className={`text-center transition-all ${direction === 'Lift' ? 'scale-110' : 'opacity-50'}`}>
                            <p className="text-sm text-gray-400">{t('ewx.bridge.source')}</p>
                            <p className="text-xl font-bold text-purple-400">Energy Web Chain</p>
                            <p className="text-xs text-gray-500">EWC</p>
                        </div>
                        <button 
                            onClick={() => setDirection(prev => prev === 'Lift' ? 'Lower' : 'Lift')}
                            className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
                        >
                            <ArrowsRightLeftIcon className="w-6 h-6 text-white" />
                        </button>
                        <div className={`text-center transition-all ${direction === 'Lower' ? 'scale-110' : 'opacity-50'}`}>
                            <p className="text-sm text-gray-400">{t('ewx.bridge.destination')}</p>
                            <p className="text-xl font-bold text-cyan-400">EWX Ecosystem</p>
                            <p className="text-xs text-gray-500">EWX</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">{t('ewx.bridge.amount')}</label>
                        <div className="relative">
                            <input 
                                type="number" 
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white text-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                                placeholder="0.00"
                            />
                            <span className="absolute right-4 top-3.5 text-gray-500 font-bold">EWT</span>
                        </div>
                        <p className="text-xs text-right mt-2 text-gray-500">{t('ewx.bridge.balance')}: 1,250.00 EWT</p>
                    </div>

                    <button className="w-full py-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold rounded-lg shadow-xl transition-all">
                        {direction === 'Lift' ? t('ewx.bridge.lift') : t('ewx.bridge.lower')}
                    </button>
                </div>
            </DashboardCard>

            <div className="space-y-6">
                <div className="bg-blue-900/20 border border-blue-800 p-4 rounded-lg flex items-start gap-3">
                    <InfoIcon className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                    <div>
                        <h4 className="font-bold text-blue-400">{t('ewx.bridge.info.title')}</h4>
                        <p className="text-sm text-gray-300 mt-1">
                            {t('ewx.bridge.info.desc')}
                        </p>
                    </div>
                </div>

                <DashboardCard title={t('ewx.bridge.recentTx')} icon={<ActivityIcon className="w-6 h-6 text-gray-400" />}>
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex justify-between items-center p-3 bg-gray-800/50 rounded hover:bg-gray-800 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${i % 2 === 0 ? 'bg-purple-900/50' : 'bg-cyan-900/50'}`}>
                                        <ArrowsRightLeftIcon className={`w-4 h-4 ${i % 2 === 0 ? 'text-purple-400' : 'text-cyan-400'}`} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">{i % 2 === 0 ? t('ewx.bridge.lift') : t('ewx.bridge.lower')}</p>
                                        <p className="text-xs text-gray-500">2 mins {t('ewx.bridge.ago')}</p>
                                    </div>
                                </div>
                                <span className="font-mono text-white">500.00 EWT</span>
                            </div>
                        ))}
                    </div>
                </DashboardCard>
            </div>
        </div>
    );
};

const EWXInstallationDocs: React.FC<{ t: (k:string)=>string }> = ({ t }) => {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">{t('ewx.docs.title')}</h2>
                <p className="text-gray-400">{t('ewx.docs.subtitle')}</p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                    <ServerRackIcon className="w-6 h-6" /> {t('ewx.docs.install')}
                </h3>
                <div className="space-y-4 text-gray-300">
                    <p>{t('ewx.docs.steps')}</p>
                    
                    <div className="bg-gray-900 p-4 rounded-lg font-mono text-sm border-l-4 border-purple-500">
                        <p className="text-gray-500"># 1. Clone o repositório</p>
                        <p className="text-green-400">git clone https://github.com/energywebfoundation/ew-marketplace.git</p>
                        <p className="text-green-400">cd ew-marketplace</p>
                        <br/>
                        <p className="text-gray-500"># 2. Instale as dependências</p>
                        <p className="text-green-400">npm install</p>
                        <p className="text-gray-500"># ou se usar yarn:</p>
                        <p className="text-green-400">yarn install</p>
                        <br/>
                        <p className="text-gray-500"># 3. Inicie a aplicação (Modo Dev)</p>
                        <p className="text-green-400">npm run dev</p>
                    </div>

                    <div className="mt-4">
                        <h4 className="font-semibold text-white mb-2">{t('ewx.docs.reqs')}</h4>
                        <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                            <li>Node.js v16+</li>
                            <li>Git</li>
                            <li>Web3 Wallet (MetaMask/Frame) -> Volta (Testnet) / EWC (Mainnet)</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-white mb-3">{t('ewx.docs.faucet')}</h3>
                    <p className="text-sm text-gray-400 mb-4">To test Bridge and Subscriptions on Volta Testnet:</p>
                    <ol className="list-decimal list-inside text-sm text-gray-300 space-y-2">
                        <li>Visit <a href="#" className="text-cyan-400 hover:underline">Volta Faucet</a>.</li>
                        <li>Copy wallet address (0x...).</li>
                        <li>Paste in faucet & request VT.</li>
                        <li>Wait for confirmation.</li>
                    </ol>
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-white mb-3">{t('ewx.docs.arch')}</h3>
                    <p className="text-sm text-gray-400 mb-4">
                        EWX app is built with <strong>Electron</strong> and <strong>TypeScript</strong>, using <strong>React</strong> as frontend framework and <strong>Vite</strong> as bundler.
                    </p>
                    <div className="flex gap-2">
                        <span className="px-2 py-1 bg-gray-700 rounded text-xs text-white">Electron</span>
                        <span className="px-2 py-1 bg-blue-900 rounded text-xs text-white">TypeScript</span>
                        <span className="px-2 py-1 bg-cyan-900 rounded text-xs text-white">React</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==================== MAIN DASHBOARD ====================

export default function MainDashboard() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [chartData, setChartData] = useState<OHLCV[]>([]);
  const [activeTab, setActiveTab] = useState<'ENERGY' | 'FUNDS' | 'BRIDGE' | 'GALAXY' | 'DOCS'>('GALAXY');
  const [walletBalance, setWalletBalance] = useState({ EWT: 1250.00, MEX: 5000.00, BRL: 150000.00 });
  const { language, setLanguage } = useSettings();
  const { t } = useTranslations(language);

  useEffect(() => {
    // Generate initial data
    setChartData(generateOHLCV(50));
    
    // Simulate live feed
    const interval = setInterval(() => {
        setChartData(prev => {
            const last = prev[prev.length - 1];
            const newClose = last.close * (1 + (Math.random() - 0.5) * 0.01);
            const newPoint: OHLCV = {
                time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                open: last.close,
                close: newClose,
                high: Math.max(last.close, newClose) + 1,
                low: Math.min(last.close, newClose) - 1,
                volume: Math.floor(Math.random() * 2000) + 500,
                ema7: newClose, 
                ema25: newClose 
            };
            return [...prev.slice(1), newPoint];
        });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleConnectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
      } catch (err) {
        console.error("User denied account access", err);
      }
    } else {
        alert("MetaMask não encontrada.");
    }
  };

  const FundCardActions: React.FC<{ fund: InvestmentFund }> = ({ fund }) => (
      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700">
          <button 
            className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded text-sm font-bold transition shadow-lg shadow-green-900/20"
            onClick={() => {
                alert(`${t('ewx.funds.buying')} ${fund.ticker}...`);
                setWalletBalance(prev => ({...prev, BRL: prev.BRL - (fund.price || 0) * 10}));
            }}
          >
              {t('ewx.market.buy')}
          </button>
          <button 
            className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded text-sm font-bold transition shadow-lg shadow-red-900/20"
            onClick={() => {
                alert(`${t('ewx.funds.selling')} ${fund.ticker}...`);
                setWalletBalance(prev => ({...prev, BRL: prev.BRL + (fund.price || 0) * 10}));
            }}
          >
              {t('ewx.market.sell')}
          </button>
      </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans selection:bg-cyan-500/30">
      
      {/* Top Bar / Ticker */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between text-xs overflow-x-auto whitespace-nowrap">
        <div className="flex gap-6 font-mono">
            <span className="flex items-center gap-1 text-purple-400">EWT <strong className="text-white">$ 2.45 (+1.2%)</strong></span>
            <span className="flex items-center gap-1 text-cyan-400">MEX <strong className="text-white">R$ 250.00 (+0.8%)</strong></span>
            <span className="flex items-center gap-1 text-green-400">HGLG11 <strong className="text-white">R$ 165.50 (+0.3%)</strong></span>
        </div>
        <div className="flex items-center gap-4">
            <span className="text-gray-400">Wallet: <span className="text-white font-bold">{walletBalance.EWT.toFixed(2)} EWT</span> | <span className="text-white font-bold">R$ {walletBalance.BRL.toLocaleString()}</span></span>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-gray-400">EWX MAINNET</span>
            </div>
            <div className="ml-2 border-l border-gray-600 pl-4">
                <LanguageSwitcher language={language} setLanguage={setLanguage} />
            </div>
        </div>
      </div>

      <main className="p-4 grid grid-cols-12 gap-4">
        
        {/* Header & Controls */}
        <div className="col-span-12 flex flex-wrap items-center justify-between gap-4 mb-4 bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-xl">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-extrabold text-white flex items-center gap-2 tracking-tight">
                    <BoltIcon className="w-8 h-8 text-cyan-400" />
                    EWX <span className="text-purple-400">Marketplace</span> <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded border border-gray-600">v2.0</span>
                </h1>
                
                <div className="h-8 w-px bg-gray-600 mx-2 hidden md:block"></div>

                <div className="flex space-x-1 overflow-x-auto">
                    {[
                        { id: 'GALAXY', label: t('ewx.nav.galaxy'), icon: GlobeAltIcon },
                        { id: 'BRIDGE', label: t('ewx.nav.bridge'), icon: ArrowsRightLeftIcon },
                        { id: 'ENERGY', label: t('ewx.nav.energy'), icon: BoltIcon },
                        { id: 'FUNDS', label: t('ewx.nav.funds'), icon: FactoryIcon },
                        { id: 'DOCS', label: t('ewx.nav.docs'), icon: InfoIcon },
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === tab.id ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                {walletAddress ? (
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-green-500/50 text-green-400 rounded-lg text-sm font-mono shadow-inner">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {walletAddress.substring(0, 6)}...{walletAddress.substring(38)}
                    </button>
                ) : (
                    <button onClick={handleConnectWallet} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-lg text-sm font-bold transition shadow-lg">
                        <WalletIcon className="w-4 h-4" />
                        {t('ewx.connectWallet')}
                    </button>
                )}
            </div>
        </div>

        {/* ================= CONTENT AREAS ================= */}

        {activeTab === 'GALAXY' && (
            <div className="col-span-12 space-y-6">
                <div className="bg-gradient-to-r from-purple-900 to-gray-900 p-8 rounded-xl border border-purple-700 relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold text-white mb-2">{t('ewx.galaxy.title')}</h2>
                        <p className="text-purple-200 max-w-2xl">
                            {t('ewx.galaxy.desc')}
                        </p>
                    </div>
                    <GlobeAltIcon className="absolute right-0 top-0 w-64 h-64 text-purple-800 opacity-20 -mr-16 -mt-16" />
                </div>
                <GalaxySubscriptionsView subscriptions={GALAXY_SUBSCRIPTIONS} t={t} />
            </div>
        )}

        {activeTab === 'BRIDGE' && (
            <div className="col-span-12">
                <EWTBridge t={t} />
            </div>
        )}

        {activeTab === 'DOCS' && (
            <div className="col-span-12">
                <EWXInstallationDocs t={t} />
            </div>
        )}

        {activeTab === 'ENERGY' && (
            <>
                <div className="col-span-12 lg:col-span-8 space-y-4">
                    <DashboardCard title={`Energy Market (MEX-kWh / BRL)`} icon={<TrendingUpIcon className="w-5 h-5 text-gray-400"/>} className="min-h-[450px]">
                        <FinancialChart data={chartData} />
                    </DashboardCard>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DashboardCard title={t('ewx.market.walletAlloc')} icon={<CubeTransparentIcon className="w-5 h-5 text-purple-400"/>}>
                            <div className="flex items-center h-48">
                                <ResponsiveContainer width="50%" height="100%">
                                    <PieChart>
                                        <Pie data={fundPortfolio} dataKey="allocation" cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={5}>
                                            {fundPortfolio.map((entry, index) => <Cell key={`cell-${index}`} fill={FUND_COLORS[index % FUND_COLORS.length]} stroke="none" />)}
                                        </Pie>
                                        <Tooltip contentStyle={{backgroundColor: '#1f2937', border: 'none'}} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="w-1/2 space-y-2 text-xs">
                                    {fundPortfolio.map((asset, i) => (
                                        <div key={asset.symbol} className="flex justify-between"><span style={{color: FUND_COLORS[i]}}>{asset.symbol}</span><span>{asset.allocation}%</span></div>
                                    ))}
                                </div>
                            </div>
                        </DashboardCard>
                        <DashboardCard title={t('ewx.market.alpha')} icon={<ActivityIcon className="w-5 h-5 text-yellow-400"/>}>
                            <div className="space-y-4 p-2">
                                <div className="flex justify-between border-b border-gray-700 pb-2"><span className="text-gray-400">{t('ewx.market.pldPred')}</span><span className="text-green-400 font-bold">Bearish (-5%)</span></div>
                                <div className="flex justify-between border-b border-gray-700 pb-2"><span className="text-gray-400">{t('ewx.market.hydroStorage')}</span><span className="text-white font-bold">62% (Avg)</span></div>
                                <div className="flex justify-between"><span className="text-gray-400">{t('ewx.market.gridLoad')}</span><span className="text-yellow-400 font-bold">Heavy</span></div>
                            </div>
                        </DashboardCard>
                    </div>
                </div>
                <div className="col-span-12 lg:col-span-4 space-y-4">
                    <DashboardCard title={t('ewx.market.orderBook')} icon={<ArrowsRightLeftIcon className="w-5 h-5 text-gray-400"/>}>
                        <OrderBook orders={mockOrderBook} t={t} />
                        <div className="flex gap-2 mt-4">
                            <button className="flex-1 bg-green-600 py-2 rounded text-white font-bold">{t('ewx.market.buy')}</button>
                            <button className="flex-1 bg-red-600 py-2 rounded text-white font-bold">{t('ewx.market.sell')}</button>
                        </div>
                    </DashboardCard>
                </div>
            </>
        )}

        {activeTab === 'FUNDS' && (
            <div className="col-span-12 h-[85vh]">
                <DashboardCard title={t('ewx.funds.title')} icon={<FactoryIcon className="w-5 h-5 text-cyan-400"/>} className="h-full">
                    <div className="h-full flex flex-col gap-4">
                        <div className="flex gap-4 mb-2 p-2 bg-gray-800 rounded-lg">
                            <div className="relative flex-grow">
                                <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                <input type="text" placeholder={t('ewx.funds.search')} className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-sm text-white" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto pb-4">
                            {FUNDS_CVM_DATA.map(fund => (
                                <div key={fund.ticker} className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-cyan-500 transition-all flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-white text-lg">{fund.ticker}</h3>
                                        <span className="px-2 py-0.5 bg-gray-700 rounded text-xs text-gray-300">{fund.strategy}</span>
                                    </div>
                                    <p className="text-sm text-gray-400 mb-4 h-10 line-clamp-2">{fund.name}</p>
                                    <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                                        <div><p className="text-gray-500">{t('ewx.funds.price')}</p><p className="font-mono text-white">R$ {fund.price?.toFixed(2)}</p></div>
                                        <div><p className="text-gray-500">{t('ewx.funds.dy')}</p><p className="font-mono text-green-400">{fund.dy_12m}%</p></div>
                                        <div><p className="text-gray-500">{t('ewx.funds.pvp')}</p><p className="font-mono text-white">{fund.p_vp}</p></div>
                                        <div><p className="text-gray-500">{t('ewx.funds.liq')}</p><p className="font-mono text-white">{(fund.liquidityDaily || 0 / 1000).toFixed(0)}k</p></div>
                                    </div>
                                    <FundCardActions fund={fund} />
                                </div>
                            ))}
                        </div>
                    </div>
                </DashboardCard>
            </div>
        )}

      </main>
    </div>
  );
}
