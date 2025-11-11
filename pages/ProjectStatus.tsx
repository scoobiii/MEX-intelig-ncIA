
import React from 'react';
import DashboardCard from '../DashboardCard';
import { ChartBarIcon, TrendingUpIcon, BoltIcon, CogIcon, ComputerDesktopIcon } from '../application/components/icons';

const FeatureList: React.FC<{ title: string; features: string[]; }> = ({ title, features }) => (
    <div className="mb-4">
        <h4 className="font-semibold text-cyan-400 mb-2">{title}</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
            {features.map((feature, index) => <li key={index}>{feature}</li>)}
        </ul>
    </div>
);

const SprintCard: React.FC<{ sprint: string; title: string; description: string; }> = ({ sprint, title, description }) => (
    <div className="bg-gray-700/50 p-4 rounded-lg">
        <p className="text-sm font-bold text-cyan-400">{sprint}</p>
        <h4 className="font-semibold text-white mt-1">{title}</h4>
        <p className="text-sm text-gray-300 mt-2">{description}</p>
    </div>
);

const ProjectStatus: React.FC = () => {
    return (
        <div className="mt-6 space-y-6">
            <header className="text-center">
                <h2 className="text-3xl font-bold text-white">Status do Projeto e Roadmap</h2>
                <p className="text-gray-400 mt-1">Visão geral das funcionalidades atuais e planejamento de futuras entregas.</p>
            </header>

            <DashboardCard title="Funcionalidades Implementadas (Sprints 1-2)" icon={<ChartBarIcon className="w-6 h-6" />}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                    <FeatureList title="Simulação da Usina" features={[
                        "Monitoramento de produção e eficiência em tempo real.",
                        "Seleção de múltiplos projetos de usinas (Standard, Nuclear, Renováveis).",
                        "Controle de status da usina (Online, Offline, Manutenção).",
                        "Ajuste de modo de combustível e mix flexível (H₂, Biodiesel).",
                        "Simulação de perda de potência por temperatura ambiente.",
                    ]} />
                     <FeatureList title="Gestão de Turbinas" features={[
                        "Visualização do status individual das turbinas (Térmicas e Eólicas).",
                        "Controle de status (Ativa, Inativa, Erro) e simulação de manutenção.",
                        "Modal de monitoramento detalhado com histórico de performance.",
                        "Filtragem de turbinas por tipo.",
                    ]} />
                     <FeatureList title="Sistemas Utilitários" features={[
                        "Visualização do fluxo de energia da trigeração.",
                        "Monitoramento de Chiller de Absorção e recuperação de calor.",
                        "Alocação de refrigeração para TIAC, Fogging e Data Center.",
                        "Cálculo de economia energética da trigeração.",
                        "Gestão de recursos (água, gás, etc.) com níveis de armazenamento.",
                    ]} />
                    <FeatureList title="Data Center" features={[
                        "Dashboard com status de 120 racks de servidores.",
                        "Monitoramento de PUE, consumo de energia e carga de refrigeração.",
                        "Modal com detalhes de cada rack (CPU, GPU, Temp, Rede).",
                        "Treemap interativo para análise de consumo de energia por rack.",
                        "Diagrama de Sankey para fluxo de energia do Data Center.",
                    ]} />
                    <FeatureList title="Análise Financeira" features={[
                        "Demonstração de Resultados (DRE) em tempo real.",
                        "Análise de fontes de receita (Energia, Cloud, Créditos de Carbono).",
                        "Estrutura de custos operacionais (OPEX).",
                        "Acompanhamento de metas de receita e lucro.",
                        "Exportação de relatório DRE para CSV.",
                    ]} />
                    <FeatureList title="Plataforma e UX" features={[
                        "Navegação entre todas as seções principais.",
                        "Criação e edição de novos projetos de usinas.",
                        "Assistente de IA (Chatbot) com conhecimento do projeto.",
                        "Páginas de conteúdo estático (Open Energy, MAUAX, etc.).",
                        "Conexão com carteira de criptomoedas (MetaMask) na página de Trade.",
                    ]} />
                </div>
            </DashboardCard>

             <DashboardCard title="Roadmap de Desenvolvimento (Próximos Sprints)" icon={<TrendingUpIcon className="w-6 h-6" />}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                    <SprintCard 
                        sprint="Sprint 3"
                        title="Análise Nuclear Detalhada"
                        description="Aprofundar a simulação da usina nuclear, substituindo a análise SMR genérica por dados e diagramas detalhados baseados em papers técnicos (ex: 'Energies 2024'), incluindo múltiplos ciclos (SRC, IRC)."
                    />
                     <SprintCard 
                        sprint="Sprint 4"
                        title="Refinamento de UI/UX e Acessibilidade"
                        description="Realizar uma revisão completa da interface do usuário para garantir consistência visual, melhorar a experiência de navegação e implementar padrões de acessibilidade (ARIA)."
                    />
                     <SprintCard 
                        sprint="Sprint 5"
                        title="Modo Offline e PWA"
                        description="Implementar funcionalidades offline usando Service Workers para permitir a consulta de dados em cache e converter a aplicação em um Progressive Web App (PWA) para instalação em dispositivos."
                    />
                     <SprintCard 
                        sprint="Sprint 6"
                        title="Integração de Dados Reais (POC)"
                        description="Conectar a plataforma a APIs reais do setor elétrico (ex: CCEE, ONS) para substituir dados simulados de PLD e geração por informações em tempo real, validando o motor de precificação."
                    />
                     <SprintCard 
                        sprint="Sprint 7"
                        title="Módulo P2P Trading (EnerTradeZK)"
                        description="Desenvolver e integrar smart contracts (ex: em uma L2 Ethereum) para permitir a tokenização real de energia (MEX-kWh) e a execução de transações P2P na plataforma."
                    />
                     <SprintCard 
                        sprint="Sprint 8"
                        title="Inteligência Artificial Avançada"
                        description="Expandir as capacidades do assistente de IA para incluir análise preditiva proativa, geração de relatórios automáticos e recomendações personalizadas com base no perfil do usuário."
                    />
                </div>
            </DashboardCard>
        </div>
    );
};

export default ProjectStatus;
