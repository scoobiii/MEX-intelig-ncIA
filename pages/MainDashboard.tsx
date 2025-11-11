import React, { useState, useEffect } from 'react';
import {
  WalletIcon,
  BoltIcon,
  CubeTransparentIcon,
  ArrowsRightLeftIcon,
  WarningIcon,
} from '../application/components/icons';
import { MarketParticipant, EnergyTransaction } from '../types';
import DashboardCard from '../DashboardCard';

// ==================== MOCK DATA ====================
const mockParticipants: MarketParticipant[] = [
    { id: 'gen1', name: 'UHE Belo Monte', type: 'Gerador', capacity: 11233, price: 250 },
    { id: 'gen2', name: 'EOL Ventos de São Vitor', type: 'Gerador', capacity: 465, price: 280 },
    { id: 'dist1', name: 'Distribuidora Sudeste', type: 'Distribuidor', price: 350 },
    { id: 'con1', name: 'Indústria ABC', type: 'Consumidor', demand: 50, price: 400 },
    { id: 'con2', name: 'Shopping Center XYZ', type: 'Consumidor', demand: 20, price: 410 },
];

const mockTransactions: EnergyTransaction[] = [
    { id: 'tx1', from: 'UHE Belo Monte', to: 'Indústria ABC', amount: 50000, token: 'MEX-kWh', txHash: '0x12...a_b_c', timestamp: new Date(Date.now() - 3600000).toLocaleString() },
    { id: 'tx2', from: 'EOL Ventos de São Vitor', to: 'Distribuidora Sudeste', amount: 25000, token: 'MEX-kWh', txHash: '0x34...d_e_f', timestamp: new Date(Date.now() - 7200000).toLocaleString() },
];

// FIX: Extend window type to include ethereum property for wallet interaction.
declare global {
  interface Window {
    ethereum?: any;
  }
}

// ==================== MAIN DASHBOARD ====================
export default function MainDashboard() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [tokenBalance, setTokenBalance] = useState(125000);
  const [mintAmount, setMintAmount] = useState('10000');
  const [isMinting, setIsMinting] = useState(false);

  const handleConnectWallet = async () => {
    setWalletError(null);
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
      } catch (err) {
        console.error("User denied account access", err);
        setWalletError("Conexão com a carteira foi rejeitada.");
      }
    } else {
      setWalletError("Nenhuma carteira Ethereum detectada. Por favor, instale a MetaMask.");
    }
  };

  const handleDisconnectWallet = () => {
    setWalletAddress(null);
  };

  const handleMint = () => {
    const amount = parseInt(mintAmount, 10);
    if (isNaN(amount) || amount <= 0) return;
    
    setIsMinting(true);
    setTimeout(() => {
        setTokenBalance(prev => prev + amount);
        setIsMinting(false);
    }, 1500); // Simulate transaction time
  };
  
  const ParticipantList: React.FC<{ title: string; participants: MarketParticipant[]; type: MarketParticipant['type'] }> = ({ title, participants, type }) => (
    <DashboardCard title={title} icon={<BoltIcon className="w-6 h-6"/>}>
        <div className="space-y-3">
            {participants.filter(p => p.type === type).map(p => (
                <div key={p.id} className="bg-gray-700/50 p-3 rounded-lg flex justify-between items-center">
                    <div>
                        <p className="font-semibold text-white">{p.name}</p>
                        <p className="text-xs text-gray-400">
                            {p.capacity ? `Capacidade: ${p.capacity} MW` : `Demanda: ${p.demand} MW`}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="font-mono text-cyan-400">{`R$ ${p.price}/MWh`}</p>
                        <button className="mt-1 px-3 py-1 text-xs bg-cyan-600 hover:bg-cyan-500 text-white rounded-md transition">
                            Negociar
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </DashboardCard>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">EnerTradeZK</h1>
              <p className="text-sm text-gray-400">P2P Energy Trading & Tokenization Platform</p>
            </div>
            <div className="flex items-center">
              {walletAddress ? (
                <div className="flex items-center gap-4">
                  <div className="text-sm text-center">
                    <span className="font-mono bg-gray-700 text-gray-300 px-3 py-2 rounded-md block">
                      {`${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`}
                    </span>
                    <span className="text-xs text-gray-500">Conectado</span>
                  </div>
                  <button onClick={handleDisconnectWallet} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium">
                    Desconectar
                  </button>
                </div>
              ) : (
                <button onClick={handleConnectWallet} className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors flex items-center gap-2">
                  <WalletIcon className="w-5 h-5" />
                  Conectar Carteira
                </button>
              )}
            </div>
          </div>
          {walletError && (
              <div className="mt-4 p-3 bg-red-900/50 border border-red-500 text-red-300 text-sm rounded-lg flex items-center gap-2">
                  <WarningIcon className="w-5 h-5" /> {walletError}
              </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Column 1: Tokenization & Participants */}
            <div className="lg:col-span-1 space-y-6">
                <DashboardCard title="Meus Tokens de Energia" icon={<CubeTransparentIcon className="w-6 h-6 text-cyan-400"/>}>
                    <div className="text-center">
                        <p className="text-5xl font-bold text-cyan-400">{tokenBalance.toLocaleString('pt-BR')}</p>
                        <p className="text-lg text-gray-400">MEX-kWh</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-700">
                        <h4 className="font-semibold text-center text-gray-300 mb-2">Tokenizar Energia (Mint)</h4>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={mintAmount}
                                onChange={(e) => setMintAmount(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500"
                                placeholder="MWh a tokenizar"
                                disabled={isMinting}
                            />
                            <button onClick={handleMint} disabled={isMinting} className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors whitespace-nowrap disabled:bg-gray-600">
                                {isMinting ? 'Minting...' : 'Mint'}
                            </button>
                        </div>
                    </div>
                </DashboardCard>

                <ParticipantList title="Geradores" participants={mockParticipants} type="Gerador" />
            </div>

            {/* Column 2 & 3: Participants & Transactions */}
            <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ParticipantList title="Distribuidores" participants={mockParticipants} type="Distribuidor" />
                    <ParticipantList title="Consumidores" participants={mockParticipants} type="Consumidor" />
                </div>
                <DashboardCard title="Transações Recentes" icon={<ArrowsRightLeftIcon className="w-6 h-6"/>}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                                <tr>
                                    <th className="px-4 py-2">De</th>
                                    <th className="px-4 py-2">Para</th>
                                    <th className="px-4 py-2 text-right">Quantidade</th>
                                    <th className="px-4 py-2">Tx Hash</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockTransactions.map(tx => (
                                    <tr key={tx.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                        <td className="px-4 py-3">{tx.from}</td>
                                        <td className="px-4 py-3">{tx.to}</td>
                                        <td className="px-4 py-3 font-mono text-right text-cyan-400">{tx.amount.toLocaleString('pt-BR')}</td>
                                        <td className="px-4 py-3 font-mono text-gray-500">{tx.txHash}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </DashboardCard>
            </div>
        </div>
      </main>
    </div>
  )
}
