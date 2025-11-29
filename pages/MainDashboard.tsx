
import React, { useState, useEffect, useMemo } from 'react';
import {
  WalletIcon,
  BoltIcon,
  CubeTransparentIcon,
  ArrowsRightLeftIcon,
  WarningIcon,
  ChartBarIcon,
  TrendingUpIcon,
  ActivityIcon,
  GlobeAltIcon
} from '../application/components/icons';
import { MarketParticipant, OHLCV, OrderBookItem, FundAsset } from '../types';
import DashboardCard from '../DashboardCard';
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

// ==================== MOCK DATA GENERATORS ====================

const generateOHLCV = (points: number): OHLCV[] => {
  const data: OHLCV[] = [];
  let price = 250; // Starting Price R$/MWh
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
    type: Math.random() > 0.5 ? 'ask' : 'bid'
})).sort((a, b) => b.price - a.price);

const fundPortfolio: FundAsset[] = [
    { symbol: 'MEX-kWh', name: 'Token de Energia', allocation: 45, value: 4500000, change24h: 2.5 },
    { symbol: 'CBIO', name: 'Crédito de Descarbonização', allocation: 25, value: 2500000, change24h: -1.2 },
    { symbol: 'H2-GREEN', name: 'Hidrogênio Futuro', allocation: 20, value: 2000000, change24h: 5.8 },
    { symbol: 'USDC', name: 'Liquidez (Stable)', allocation: 10, value: 1000000, change24h: 0.01 },
];

const FUND_COLORS = ['#06b6d4', '#22c55e', '#a855f7', '#64748b'];

// ==================== COMPONENTS ====================

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
                <Line yAxisId="left" type="monotone" dataKey="ema25" name="EMA 25" stroke="#f472b6" strokeWidth={1} dot={false} />
                <Bar yAxisId="right" dataKey="volume" name="Volume" fill="#374151" opacity={0.5} barSize={10} />
            </ComposedChart>
        </ResponsiveContainer>
    );
};

const OrderBook: React.FC<{ orders: OrderBookItem[] }> = ({ orders }) => {
    const asks = orders.filter(o => o.type === 'ask').sort((a, b) => a.price - b.price).slice(0, 7).reverse();
    const bids = orders.filter(o => o.type === 'bid').sort((a, b) => b.price - a.price).slice(0, 7);

    return (
        <div className="text-xs font-mono">
            <div className="grid grid-cols-3 text-gray-500 mb-2 px-2">
                <span>Preço (R$)</span>
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

const PredictionWidget: React.FC = () => {
    return (
        <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 p-4 rounded-lg border border-indigo-500/30">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h4 className="font-bold text-white flex items-center gap-2">
                        <ActivityIcon className="w-5 h-5 text-cyan-400" />
                        Apex Predictive Alpha
                    </h4>
                    <p className="text-xs text-indigo-200">Powered by ApexGroup Data</p>
                </div>
                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded font-bold">BULLISH</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="text-center bg-gray-900/40 p-2 rounded">
                    <p className="text-xs text-gray-400">Confiança IA</p>
                    <p className="text-xl font-bold text-white">94.2%</p>
                </div>
                <div className="text-center bg-gray-900/40 p-2 rounded">
                    <p className="text-xs text-gray-400">Previsão 24h</p>
                    <p className="text-xl font-bold text-green-400">+3.5%</p>
                </div>
            </div>
            
            <div className="mt-4 text-xs text-gray-300 space-y-2">
                <p><strong>Sinais de Mercado:</strong></p>
                <div className="flex items-center justify-between">
                    <span>Volatilidade PLD</span>
                    <div className="w-20 h-1.5 bg-gray-700 rounded-full"><div className="h-full bg-yellow-500 rounded-full" style={{width: '70%'}}></div></div>
                </div>
                <div className="flex items-center justify-between">
                    <span>Pressão de Compra</span>
                    <div className="w-20 h-1.5 bg-gray-700 rounded-full"><div className="h-full bg-green-500 rounded-full" style={{width: '85%'}}></div></div>
                </div>
                <div className="flex items-center justify-between">
                    <span>Risco Regulatório</span>
                    <div className="w-20 h-1.5 bg-gray-700 rounded-full"><div className="h-full bg-green-500 rounded-full" style={{width: '20%'}}></div></div>
                </div>
            </div>
        </div>
    );
};

// ==================== MAIN DASHBOARD ====================

export default function MainDashboard() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [chartData, setChartData] = useState<OHLCV[]>([]);
  const [timeframe, setTimeframe] = useState<'1H' | '1D' | '1W'>('1H');

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
                ema7: newClose, // Simplified for mock
                ema25: newClose // Simplified for mock
            };
            return [...prev.slice(1), newPoint];
        });
    }, 3000);

    return () => clearInterval(interval);
  }, [timeframe]);

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

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans selection:bg-cyan-500/30">
      
      {/* Top Bar / Ticker */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between text-xs overflow-x-auto whitespace-nowrap">
        <div className="flex gap-6">
            <span className="flex items-center gap-1"><span className="text-gray-400">MEX-kWh</span> <strong className="text-green-400">R$ 250.00 (+1.2%)</strong></span>
            <span className="flex items-center gap-1"><span className="text-gray-400">PLD Sudeste</span> <strong className="text-red-400">R$ 180.50 (-0.5%)</strong></span>
            <span className="flex items-center gap-1"><span className="text-gray-400">CBIO</span> <strong className="text-green-400">R$ 95.20 (+0.8%)</strong></span>
            <span className="flex items-center gap-1"><span className="text-gray-400">Carbon Token</span> <strong className="text-gray-200">$ 32.50 (0.0%)</strong></span>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-gray-400 font-mono">SYSTEM: ONLINE</span>
        </div>
      </div>

      <main className="p-4 grid grid-cols-12 gap-4">
        
        {/* Header & Controls */}
        <div className="col-span-12 flex flex-wrap items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <BoltIcon className="w-8 h-8 text-cyan-400" />
                    Terminal Apex <span className="text-xs bg-cyan-900 text-cyan-300 px-2 py-0.5 rounded border border-cyan-700">PRO</span>
                </h1>
                <div className="flex bg-gray-800 rounded p-1">
                    {['1H', '1D', '1W'].map(tf => (
                        <button 
                            key={tf}
                            onClick={() => setTimeframe(tf as any)}
                            className={`px-3 py-1 text-xs font-bold rounded transition-colors ${timeframe === tf ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            {tf}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-600 rounded text-sm hover:bg-gray-700 transition">
                    <GlobeAltIcon className="w-4 h-4 text-gray-400" />
                    Apex Feed
                </button>
                {walletAddress ? (
                    <button className="px-4 py-2 bg-gray-800 border border-green-500/50 text-green-400 rounded text-sm font-mono">
                        {walletAddress.substring(0, 6)}...{walletAddress.substring(38)}
                    </button>
                ) : (
                    <button onClick={handleConnectWallet} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-sm font-bold transition shadow-lg shadow-cyan-500/20">
                        <WalletIcon className="w-4 h-4" />
                        Conectar Carteira
                    </button>
                )}
            </div>
        </div>

        {/* LEFT COLUMN: Chart & Portfolio */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
            {/* Main Chart */}
            <DashboardCard title="MEX-kWh / BRL" icon={<TrendingUpIcon className="w-5 h-5 text-gray-400"/>} className="min-h-[450px]">
                <div className="flex justify-between items-end px-2 mb-2 absolute top-4 right-16 z-10">
                    <div className="text-right">
                        <p className="text-3xl font-bold text-white">250.00</p>
                        <p className="text-sm font-mono text-green-400">▲ 3.00 (1.20%)</p>
                    </div>
                </div>
                <FinancialChart data={chartData} />
            </DashboardCard>

            {/* Fund Performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DashboardCard title="Alocação do Fundo Apex" icon={<CubeTransparentIcon className="w-5 h-5 text-purple-400"/>}>
                    <div className="flex items-center">
                        <div className="w-1/2 h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie 
                                        data={fundPortfolio} 
                                        dataKey="allocation" 
                                        cx="50%" cy="50%" 
                                        innerRadius={40} outerRadius={60} 
                                        paddingAngle={5}
                                    >
                                        {fundPortfolio.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={FUND_COLORS[index % FUND_COLORS.length]} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{backgroundColor: '#1f2937', border: 'none'}} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-1/2 space-y-2 text-sm">
                            {fundPortfolio.map((asset, i) => (
                                <div key={asset.symbol} className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{backgroundColor: FUND_COLORS[i]}}></div>
                                        <span className="text-gray-300">{asset.symbol}</span>
                                    </div>
                                    <span className="font-mono text-white">{asset.allocation}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </DashboardCard>

                <DashboardCard title="Métricas de Risco & Retorno" icon={<ActivityIcon className="w-5 h-5 text-yellow-400"/>}>
                    <div className="grid grid-cols-2 gap-4 h-full content-center">
                        <div className="bg-gray-800 p-3 rounded border-l-2 border-green-500">
                            <p className="text-gray-400 text-xs">Sharpe Ratio</p>
                            <p className="text-xl font-bold text-white">2.45</p>
                        </div>
                        <div className="bg-gray-800 p-3 rounded border-l-2 border-blue-500">
                            <p className="text-gray-400 text-xs">Volatilidade (30d)</p>
                            <p className="text-xl font-bold text-white">12.8%</p>
                        </div>
                        <div className="bg-gray-800 p-3 rounded border-l-2 border-purple-500">
                            <p className="text-gray-400 text-xs">Alpha (vs CDI)</p>
                            <p className="text-xl font-bold text-white">+8.2%</p>
                        </div>
                        <div className="bg-gray-800 p-3 rounded border-l-2 border-gray-500">
                            <p className="text-gray-400 text-xs">Total AUM</p>
                            <p className="text-xl font-bold text-white">R$ 10.5M</p>
                        </div>
                    </div>
                </DashboardCard>
            </div>
        </div>

        {/* RIGHT COLUMN: Order Book, Trades, AI */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
            
            <PredictionWidget />

            <DashboardCard title="Order Book" icon={<ArrowsRightLeftIcon className="w-5 h-5 text-gray-400"/>}>
                <OrderBook orders={mockOrderBook} />
                <div className="p-3 border-t border-gray-700 mt-2">
                    <div className="flex gap-2">
                        <button className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded font-bold transition">
                            COMPRAR
                        </button>
                        <button className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded font-bold transition">
                            VENDER
                        </button>
                    </div>
                </div>
            </DashboardCard>

            <DashboardCard title="Execuções Recentes" icon={<ChartBarIcon className="w-5 h-5 text-gray-400"/>}>
                <div className="text-xs space-y-1 font-mono">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex justify-between text-gray-400 hover:bg-gray-800 p-1 rounded">
                            <span className={Math.random() > 0.5 ? 'text-green-400' : 'text-red-400'}>
                                {Math.random() > 0.5 ? 'COMPRA' : 'VENDA'}
                            </span>
                            <span className="text-white">{(250 + Math.random()*5).toFixed(2)}</span>
                            <span>{(Math.random()*100).toFixed(0)} MWh</span>
                            <span className="text-gray-600">{new Date().toLocaleTimeString()}</span>
                        </div>
                    ))}
                </div>
            </DashboardCard>

        </div>

      </main>
    </div>
  );
}
