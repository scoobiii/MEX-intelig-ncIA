import React from 'react';

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
    <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700 h-full flex flex-col">
        <div className="flex items-baseline gap-4 mb-3">
            <span className="text-xl font-bold text-cyan-500">{phase}</span>
            <h3 className="text-2xl font-bold text-white">{title}</h3>
        </div>
        <p className="text-sm text-gray-400 mb-2"><strong>Duração Estimada:</strong> {duration}</p>
        <p className="text-sm text-gray-300 mb-4 flex-grow"><strong>Objetivo:</strong> {objective}</p>
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
                        <ul className="list-none space-y-2 mt-4 text-base">
                            <li><strong>Marketplace Inteligente de Energia:</strong> Agregação de ofertas, comparação automática e recomendação personalizada via IA.</li>
                            <li><strong>Motor de Precificação Preditiva:</strong> Análise histórica de preços PLD, previsão de tendências e alertas de oportunidades.</li>
                            <li><strong>Assistente Virtual para Migração:</strong> Análise de elegibilidade, simulação de economia e guia passo-a-passo.</li>
                            <li><strong>Dashboard de Gestão Energética:</strong> Monitoramento de consumo, análise de eficiência e recomendações de otimização.</li>
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

                <Section title="Contexto do Setor: Novo Modelo Simplificado da CCEE">
                    <div className="bg-gray-900/50 p-6 rounded-lg text-gray-300 text-sm leading-6">
                        <p className="text-xs text-gray-500 text-right">Publicado em: 06/06/25 | Fonte: CCEE</p>
                        <h3 className="text-xl font-bold text-cyan-400 mb-4">
                            CO – Tudo o que você precisa saber sobre o novo modelo simplificado de gestão do varejo
                        </h3>
                        <p className="mb-4">
                            A partir de 1º de julho de 2025, todas as novas migrações ao mercado livre de energia de consumidores com demanda contratada inferior a 0,5 MW — e, portanto, representados por agentes varejistas — serão realizadas exclusivamente por meio do modelo simplificado, via APIs (Application Programming Interface) disponibilizadas pela CCEE. A nova tecnologia torna mais ágeis os processos de cadastro das unidades consumidoras, amplia as possibilidades de automação dos serviços necessários à gestão do Contrato para Comercialização Varejista (CCV) e gera ganhos de escala para o setor, em linha com o cenário de abertura do ambiente.
                        </p>
                        <p className="mb-4">
                            Idealizado pela CCEE e proposto à Agência Nacional de Energia Elétrica – ANEEL, que determinou sua obrigatoriedade por meio da Resolução Normativa nº 1.110/24, o modelo simplificado revoluciona a maneira como o mercado troca informações e realiza suas principais atividades. As APIs substituem interações manuais feitas pelos sistemas tradicionais (SigaCCEE e SCDE), tornando os processos mais rápidos, confiáveis e fáceis.
                        </p>
                        <p className="font-semibold text-white mb-2">Principais Mudanças:</p>
                        <ul className="list-disc list-inside space-y-2 mb-4">
                            <li>A partir de 1º de julho de 2025, não será mais possível iniciar processos de migração por meio dos sistemas SigaCCEE e SCDE para unidades consumidoras cuja representação varejista seja obrigatória.</li>
                            <li>Solicitações iniciadas no SigaCCEE até 30 de junho de 2025 poderão ser concluídas no modelo atual, desde que finalizadas em até 12 meses.</li>
                            <li>A CCEE irá desconsiderar solicitações de assinatura de CCV feitas no sistema "Minhas Empresas" para unidades consumidoras elegíveis ao modelo simplificado e cujas migrações não tenham sido iniciadas no SigaCCEE até 30 de junho de 2025.</li>
                        </ul>
                        <p>
                            Contamos com a colaboração de todos para uma mudança eficiente e segura rumo a um mercado mais dinâmico e preparado para a abertura total do ambiente de contratação livre e continuamos à disposição para apoiar os agentes nesse momento tão relevante e especial para nosso setor.
                        </p>
                    </div>
                </Section>

                <footer className="text-center mt-12 pt-8 border-t border-gray-700">
                    <p className="font-bold text-white">mex inteligêncIAl</p>
                    <p className="text-gray-400">Website: <a href="https://mex.eco.br" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">mex.eco.br</a> | E-mail: contato@mex.eco.br</p>
                </footer>
            </div>
        </div>
    );
};

export default OpenEnergy;