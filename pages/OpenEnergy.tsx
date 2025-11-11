import React from 'react';
import DashboardCard from '../DashboardCard';
import { MagnifyingGlassIcon, TrendingUpIcon, PaperAirplaneIcon, ChartPieIcon } from '../application/components/icons';

interface OpenEnergyProps {
}

const OpenEnergy: React.FC<OpenEnergyProps> = () => {
  return (
    <div className="mt-6">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white">Plataforma Open Energy AI</h1>
        <p className="text-lg text-gray-400 mt-2">Democratizando o acesso ao Mercado Livre de Energia através de Inteligência Artificial.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard 
          title="Marketplace Inteligente"
          icon={<MagnifyingGlassIcon className="w-6 h-6 text-cyan-400" />}
        >
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-gray-300">Agregue, compare e contrate as melhores ofertas de energia de diversas comercializadoras em um único lugar.</p>
            <p className="mt-4 text-sm font-semibold text-yellow-400">[Em Desenvolvimento]</p>
          </div>
        </DashboardCard>
        
        <DashboardCard 
          title="Motor de Precificação Preditiva"
          icon={<TrendingUpIcon className="w-6 h-6 text-green-400" />}
        >
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-gray-300">Utilize IA para prever tendências do Preço de Liquidação das Diferenças (PLD) e tome decisões mais inteligentes.</p>
            <p className="mt-4 text-sm font-semibold text-yellow-400">[Em Desenvolvimento]</p>
          </div>
        </DashboardCard>
        
        <DashboardCard 
          title="Assistente Virtual de Migração"
          icon={<PaperAirplaneIcon className="w-6 h-6 text-purple-400" />}
        >
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-gray-300">Um guia passo-a-passo para analisar sua elegibilidade, simular economias e facilitar sua migração para o Mercado Livre.</p>
            <p className="mt-4 text-sm font-semibold text-yellow-400">[Em Desenvolvimento]</p>
          </div>
        </DashboardCard>
        
        <DashboardCard 
          title="Dashboard de Gestão Energética"
          icon={<ChartPieIcon className="w-6 h-6 text-orange-400" />}
        >
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-gray-300">Monitore seu consumo em tempo real, identifique oportunidades de economia e receba insights para otimizar seu perfil energético.</p>
            <p className="mt-4 text-sm font-semibold text-yellow-400">[Em Desenvolvimento]</p>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default OpenEnergy;