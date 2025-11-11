import React from 'react';
import DashboardCard from '../DashboardCard';
import { ChartBarIcon, TrendingUpIcon } from '../application/components/icons';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-12 animate-fadeIn" style={{ animationDelay: '100ms' }}>
        <h2 className="text-3xl font-bold text-white mb-6 border-l-4 border-cyan-400 pl-4">{title}</h2>
        <div className="space-y-4 text-lg text-gray-300 leading-relaxed">
            {children}
        </div>
    </section>
);

const SubSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mt-6 bg-gray-900/50 p-6 rounded-lg">
        <h3 className="text-2xl font-semibold text-cyan-400 mb-4">{title}</h3>
        {children}
    </div>
);

const BulletPoint: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-start">
        <span className="text-cyan-400 mr-3 mt-1">➤</span>
        <span>{children}</span>
    </li>
);

const PhaseCard: React.FC<{ phase: string; title: string; duration: string; objective: string; children: React.ReactNode; }> = ({ phase, title, duration, objective, children }) => (
    <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
        <div className="flex items-baseline gap-4 mb-3">
            <span className="text-xl font-bold text-cyan-500">{phase}</span>
            <h3 className="text-2xl font-bold text-white">{title}</h3>
        </div>
        <p className="text-sm text-gray-400 mb-2"><strong>Duração Estimada:</strong> {duration}</p>
        <p className="text-sm text-gray-300 mb-4"><strong>Objetivo:</strong> {objective}</p>
        <div className="border-t border-gray-600 pt-4">
            {children}
        </div>
    </div>
);

const DeliverableList: React.FC<{ items: string[] }> = ({ items }) => (
    <div>
        <h4 className="font-semibold text-cyan-400 mb-2">Entregas Chave:</h4>
        <ul className="space-y-2 text-sm text-gray-300">
            {items.map((item, index) => (
                <li key={index} className="flex">
                    <span className="text-cyan-400 mr-2">➤</span>
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    </div>
);


const OpenEnergy: React.FC = () => {
    return (
        <div className="mt-6 text-gray-200">
             <style>{`
                @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn { 
                animation: fadeIn 0.5s ease-out forwards; 
                opacity: 0;
                }
            `}</style>
            <div className="max-w-5xl mx-auto bg-gray-800 p-8 rounded-lg shadow-2xl">
                <header className="text-center mb-12 animate-fadeIn">
                    <h1 className="text-5xl font-extrabold text-white tracking-tight">
                        mex inteligênc<span className="text-cyan-400">IA</span>l
                    </h1>
                    <p className="text-2xl text-gray-400 mt-2">Soluções para Open Energy</p>
                </header>

                <Section title="1. O Desafio Open Energy e Nossa Solução">
                    <SubSection title="O Problema">
                        <p>O mercado livre de energia no Brasil enfrenta:</p>
                        <ul className="space-y-2 mt-4">
                            <BulletPoint>Complexidade de informações dispersas entre múltiplos agentes</BulletPoint>
                            <BulletPoint>Dificuldade de comparação entre ofertas e condições comerciais</BulletPoint>
                            <BulletPoint>Falta de transparência nos preços e disponibilidade</BulletPoint>
                            <BulletPoint>Barreiras técnicas para consumidores elegíveis migrarem</BulletPoint>
                        </ul>
                    </SubSection>
                    <SubSection title="Nossa Solução: Plataforma Open Energy AI">
                        <p><strong>Componentes Principais:</strong></p>
                        <ul className="list-none space-y-2 mt-4">
                            <li>Marketplace Inteligente de Energia: Agregação de ofertas, comparação automática e recomendação personalizada via IA.</li>
                            <li>Motor de Precificação Preditiva: Análise histórica de preços PLD, previsão de tendências e alertas de oportunidades.</li>
                            <li>Assistente Virtual para Migração: Análise de elegibilidade, simulação de economia e guia passo-a-passo.</li>
                            <li>Dashboard de Gestão Energética: Monitoramento de consumo, análise de eficiência e recomendações de otimização.</li>
                        </ul>
                    </SubSection>
                </Section>
                
                <Section title="2. Status do Projeto e Roadmap">
                    <SubSection title="Plano de Trabalho e Entregas">
                         <div className="p-4 space-y-8">
                            <p className="text-center text-gray-400">
                                Síntese de um plano de trabalho para um projeto genérico de inovação no setor de energia, estruturado a partir da análise dos desafios de grandes players do mercado.
                            </p>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <PhaseCard 
                                    phase="Fase 1" 
                                    title="Concepção e Alinhamento Estratégico" 
                                    duration="2 Semanas" 
                                    objective="Definir o escopo, a proposta de valor e o alinhamento regulatório da solução."
                                >
                                    <DeliverableList items={[
                                        "Análise de Mercado e Requisitos: Incluindo LGPD e padrões do setor elétrico.",
                                        "Lean Canvas / Proposta de Valor: Definição clara do modelo de negócio.",
                                        "Desenho da Arquitetura de Dados: Fontes, fluxos, segurança e consentimento."
                                    ]} />
                                </PhaseCard>

                                <PhaseCard 
                                    phase="Fase 2" 
                                    title="Desenvolvimento e Prova de Conceito (PoC)" 
                                    duration="4 Semanas" 
                                    objective="Construir o protótipo funcional e validar a viabilidade técnica da solução."
                                >
                                    <DeliverableList items={[
                                        "Protótipo Funcional (MVP): Código-fonte da solução mínima viável.",
                                        "Relatório de Teste de Integração: Demonstração da capacidade de processar dados.",
                                        "Relatório de Prova de Conceito (PoC): Métricas de viabilidade técnica."
                                    ]} />
                                </PhaseCard>

                                <PhaseCard 
                                    phase="Fase 3" 
                                    title="Validação e Teste em Ambiente Real (Piloto)" 
                                    duration="3 Semanas" 
                                    objective="Testar a solução em ambiente operacional, coletando métricas de desempenho."
                                >
                                    <DeliverableList items={[
                                        "Plano de Piloto Detalhado: Escopo, métricas de sucesso e cronograma.",
                                        "Base de Dados de Resultados: Dados brutos e processados do piloto.",
                                        "Relatório de Análise de Desempenho: Quantificação dos ganhos de eficiência/redução de CO2."
                                    ]} />
                                </PhaseCard>

                                <PhaseCard 
                                    phase="Fase 4" 
                                    title="Resultados e Próximos Passos" 
                                    duration="1 Semana" 
                                    objective="Consolidar os resultados e definir a estratégia de escala/comercialização."
                                >
                                    <DeliverableList items={[
                                        "Relatório Final do Projeto: Resumo executivo, metodologia e aprendizados.",
                                        "Proposta de Modelo de Negócio: Plano de escala e comercialização.",
                                        "Apresentação Executiva (Pitch Deck): Material para Demoday e investidores."
                                    ]} />
                                </PhaseCard>
                            </div>
                        </div>
                    </SubSection>
                </Section>

                <footer className="text-center mt-12 pt-8 border-t border-gray-700">
                    <p className="font-bold text-white">mex inteligêncIAl</p>
                    <p className="text-gray-400">Website: <a href="#" className="text-cyan-400 hover:underline">mex.eco.br</a> | E-mail: contato@mex.eco.br</p>
                </footer>

            </div>
        </div>
    );
};

export default OpenEnergy;