import React from 'react';
import DashboardCard from '../DashboardCard';
import { ChartBarIcon, TrendingUpIcon } from '../application/components/icons';

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

const DeliverableList: React.FC<{ items: { title: string; description: string; }[] }> = ({ items }) => (
    <div>
        <h4 className="font-semibold text-cyan-400 mb-2">Entregas Chave:</h4>
        <ul className="space-y-2 text-sm text-gray-300">
            {items.map((item, index) => (
                <li key={index} className="flex">
                    <span className="text-cyan-400 mr-2">&#10148;</span>
                    <span><strong>{item.title}:</strong> {item.description}</span>
                </li>
            ))}
        </ul>
    </div>
);

const ProjectStatus: React.FC = () => {
    return (
        <div className="mt-6">
            <DashboardCard title="Plano de Trabalho e Entregas: Inovação em Energia" icon={<ChartBarIcon className="w-6 h-6" />}>
                <div className="p-4 space-y-8">
                    <p className="text-center text-gray-400">
                        Síntese de um plano de trabalho para um projeto genérico de inovação no setor de energia, estruturado a partir da análise dos desafios de grandes players do mercado.
                    </p>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* FASE 1 */}
                        <PhaseCard 
                            phase="Fase 1" 
                            title="Concepção e Alinhamento Estratégico" 
                            duration="2 Semanas" 
                            objective="Definir o escopo, a proposta de valor e o alinhamento regulatório da solução."
                        >
                            <DeliverableList items={[
                                { title: "Análise de Mercado e Requisitos", description: "Incluindo LGPD e padrões do setor elétrico." },
                                { title: "Lean Canvas / Proposta de Valor", description: "Definição clara do modelo de negócio." },
                                { title: "Desenho da Arquitetura de Dados", description: "Fontes, fluxos, segurança e consentimento." }
                            ]} />
                        </PhaseCard>

                        {/* FASE 2 */}
                        <PhaseCard 
                            phase="Fase 2" 
                            title="Desenvolvimento e Prova de Conceito (PoC)" 
                            duration="4 Semanas" 
                            objective="Construir o protótipo funcional e validar a viabilidade técnica da solução."
                        >
                            <DeliverableList items={[
                                { title: "Protótipo Funcional (MVP)", description: "Código-fonte da solução mínima viável." },
                                { title: "Relatório de Teste de Integração", description: "Demonstração da capacidade de processar dados." },
                                { title: "Relatório de Prova de Conceito (PoC)", description: "Métricas de viabilidade técnica." }
                            ]} />
                        </PhaseCard>

                        {/* FASE 3 */}
                        <PhaseCard 
                            phase="Fase 3" 
                            title="Validação e Teste em Ambiente Real (Piloto)" 
                            duration="3 Semanas" 
                            objective="Testar a solução em ambiente operacional, coletando métricas de desempenho."
                        >
                            <DeliverableList items={[
                                { title: "Plano de Piloto Detalhado", description: "Escopo, métricas de sucesso e cronograma." },
                                { title: "Base de Dados de Resultados", description: "Dados brutos e processados do piloto." },
                                { title: "Relatório de Análise de Desempenho", description: "Quantificação dos ganhos de eficiência/redução de CO2." }
                            ]} />
                        </PhaseCard>

                        {/* FASE 4 */}
                        <PhaseCard 
                            phase="Fase 4" 
                            title="Resultados e Próximos Passos" 
                            duration="1 Semana" 
                            objective="Consolidar os resultados e definir a estratégia de escala/comercialização."
                        >
                            <DeliverableList items={[
                                { title: "Relatório Final do Projeto", description: "Resumo executivo, metodologia e aprendizados." },
                                { title: "Proposta de Modelo de Negócio", description: "Plano de escala e comercialização." },
                                { title: "Apresentação Executiva (Pitch Deck)", description: "Material para Demoday e investidores." }
                            ]} />
                        </PhaseCard>
                    </div>
                </div>
            </DashboardCard>

             <div className="mt-6">
                <DashboardCard title="Entregas Consolidadas do Projeto" icon={<TrendingUpIcon className="w-6 h-6" />}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
                        <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h4 className="font-bold text-cyan-400">1. Protótipo Funcional (MVP)</h4>
                            <p className="text-sm text-gray-300 mt-2">Código-fonte e documentação técnica da solução.</p>
                        </div>
                         <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h4 className="font-bold text-cyan-400">2. Relatório de Desempenho</h4>
                            <p className="text-sm text-gray-300 mt-2">Quantificação do valor gerado (eficiência operacional ou sustentabilidade).</p>
                        </div>
                         <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h4 className="font-bold text-cyan-400">3. Modelo de Negócio e Escala</h4>
                            <p className="text-sm text-gray-300 mt-2">Plano estratégico para comercialização e crescimento.</p>
                        </div>
                         <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h4 className="font-bold text-cyan-400">4. Apresentação Executiva</h4>
                            <p className="text-sm text-gray-300 mt-2">Pitch Deck para Demoday, resumindo todo o projeto.</p>
                        </div>
                    </div>
                </DashboardCard>
            </div>
        </div>
    );
};

export default ProjectStatus;
