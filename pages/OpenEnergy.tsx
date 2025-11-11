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
        <span className="text-cyan-400 mr-3 mt-1">&#10148;</span>
        <span>{children}</span>
    </li>
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
                            <BulletPoint><strong>Complexidade de informações</strong> dispersas entre múltiplos agentes</BulletPoint>
                            <BulletPoint><strong>Dificuldade de comparação</strong> entre ofertas e condições comerciais</BulletPoint>
                            <BulletPoint><strong>Falta de transparência</strong> nos preços e disponibilidade</BulletPoint>
                            <BulletPoint><strong>Barreiras técnicas</strong> para consumidores elegíveis migrarem</BulletPoint>
                        </ul>
                    </SubSection>
                    <SubSection title="Nossa Solução: Plataforma Open Energy AI">
                        <p><strong>Componentes Principais:</strong></p>
                        <ol className="list-decimal list-inside space-y-2 mt-4">
                            <li><strong>Marketplace Inteligente de Energia:</strong> Agregação de ofertas, comparação automática e recomendação personalizada via IA.</li>
                            <li><strong>Motor de Precificação Preditiva:</strong> Análise histórica de preços PLD, previsão de tendências e alertas de oportunidades.</li>
                            <li><strong>Assistente Virtual para Migração:</strong> Análise de elegibilidade, simulação de economia e guia passo-a-passo.</li>
                            <li><strong>Dashboard de Gestão Energética:</strong> Monitoramento de consumo, análise de eficiência e recomendações de otimização.</li>
                        </ol>
                    </SubSection>
                </Section>
                
                <Section title="2. Diferenciais Competitivos">
                    <div className="grid md:grid-cols-2 gap-6">
                        <SubSection title="Tecnologia Proprietária">
                            <ul className="space-y-2">
                                <BulletPoint><strong>IA Generativa</strong> para análise de contratos e documentos regulatórios</BulletPoint>
                                <BulletPoint><strong>Machine Learning</strong> para previsão de preços e demanda</BulletPoint>
                                <BulletPoint><strong>NLP (Processamento de Linguagem Natural)</strong> para assistente conversacional</BulletPoint>
                            </ul>
                        </SubSection>
                        <SubSection title="Vantagens Únicas">
                             <ul className="space-y-2">
                                <BulletPoint>✅ <strong>Plataforma única</strong> que integra marketplace, análise preditiva e assistente IA</BulletPoint>
                                <BulletPoint>✅ <strong>Parceria estratégica</strong> com CCEE para dados oficiais</BulletPoint>
                                <BulletPoint>✅ <strong>Neutralidade</strong>: não somos comercializadora, somos facilitadores</BulletPoint>
                                <BulletPoint>✅ <strong>UX simplificada</strong>: experiência de app financeiro para o setor energético</BulletPoint>
                            </ul>
                        </SubSection>
                    </div>
                </Section>

                <Section title="3. Tratamento de Dados e Segurança">
                     <div className="grid md:grid-cols-2 gap-6">
                        <SubSection title="Fontes de Dados">
                             <ul className="space-y-2">
                                <BulletPoint><strong>CCEE:</strong> Preços PLD, volumes negociados</BulletPoint>
                                <BulletPoint><strong>ONS:</strong> Despacho, carga, geração</BulletPoint>
                                <BulletPoint><strong>Comercializadoras:</strong> Ofertas via API (parceiros)</BulletPoint>
                                <BulletPoint><strong>Clientes:</strong> Dados de consumo (opt-in)</BulletPoint>
                            </ul>
                        </SubSection>
                        <SubSection title="Segurança e Compliance">
                             <ul className="space-y-2">
                                <BulletPoint>🔒 <strong>LGPD Compliant:</strong> consentimento, portabilidade, anonimização</BulletPoint>
                                <BulletPoint>🔒 <strong>Criptografia end-to-end</strong> para dados sensíveis</BulletPoint>
                                <BulletPoint>🔒 <strong>ISO 27001</strong> em processo de certificação</BulletPoint>
                            </ul>
                        </SubSection>
                    </div>
                </Section>

                <Section title="4. Modelo de Negócio e Proposta de POC">
                    <SubSection title="Modelo de Receita (Três Pilares)">
                        <ol className="list-decimal list-inside space-y-2">
                            <li><strong>Freemium para Consumidores:</strong> Gratuito (análise básica) e Premium.</li>
                            <li><strong>Comissão de Marketplace (B2B2C):</strong> % sobre contratos fechados.</li>
                            <li><strong>SaaS para Distribuidoras/Comercializadoras (B2B):</strong> White-label da plataforma.</li>
                        </ol>
                    </SubSection>
                    <SubSection title="Proposta para POC Equatorial (3 meses)">
                        <p><strong>Investimento POC: R$ 180.000</strong></p>
                        <p><strong>Entregáveis:</strong> Dashboard white-label, integração com 3 comercializadoras, 500 clientes piloto, relatório de ROI.</p>
                        <p><strong>KPIs de Sucesso:</strong> Taxa de migração > 15%, NPS > 70, Redução custo médio > 10%.</p>
                    </SubSection>
                </Section>

                <Section title="5. Call to Action">
                    <SubSection title="Próximos Passos">
                         <ul className="space-y-2">
                            <BulletPoint>🚀 <strong>Imediato:</strong> Assinatura de NDA, definição de squad, Kick-off POC.</BulletPoint>
                            <BulletPoint>🚀 <strong>Curto Prazo:</strong> Início desenvolvimento, seleção clientes piloto.</BulletPoint>
                            <BulletPoint>🚀 <strong>Médio Prazo:</strong> Operação POC, medição de KPIs, decisão de escala.</BulletPoint>
                        </ul>
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
