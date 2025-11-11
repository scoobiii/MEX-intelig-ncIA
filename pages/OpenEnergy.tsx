import React from 'react';
import DashboardCard from '../DashboardCard';
import { InfoIcon, CogIcon, TrendingUpIcon } from '../application/components/icons';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6 border-l-4 border-cyan-400 pl-4">{title}</h2>
        <div className="space-y-4 text-lg text-gray-300 leading-relaxed">
            {children}
        </div>
    </section>
);

const OpenEnergy: React.FC = () => {
  return (
    <div className="mt-6">
        <div className="max-w-5xl mx-auto bg-gray-800 p-8 rounded-lg shadow-2xl">
            <header className="text-center mb-12">
                <h1 className="text-5xl font-extrabold text-white tracking-tight">
                    Desafio Open Energy
                </h1>
                <p className="text-xl text-gray-400 mt-4">Viabilizando, acelerando e ampliando a transformação digital do setor energético brasileiro.</p>
            </header>

            <Section title="O Contexto">
                <p>O setor energético está passando por uma transformação digital profunda, impulsionada pela descentralização da geração, avanço das tecnologias de medição e pela crescente demanda por sustentabilidade. Nesse cenário, o modelo de Open Energy surge como uma oportunidade estratégica para tornar os dados energéticos acessíveis, interoperáveis e úteis para consumidores, empresas e governos.</p>
            </Section>

            <Section title="O Desafio">
                <div className="bg-gray-900/50 p-6 rounded-lg border-l-4 border-cyan-500">
                    <p className="text-2xl font-semibold text-cyan-400">"Como podemos testar soluções que tornem o modelo de Open Energy realidade no Brasil, gerando valor para empresas, sociedade e consumidores finais?"</p>
                    <p className="mt-4 text-gray-400">Estamos abertos a relacionamentos exploratórios e colaborativos, que podem evoluir tanto para pilotos práticos quanto para o desenvolvimento de novos modelos de negócio em parceria.</p>
                </div>
            </Section>
            
            <Section title="Temas Prioritários">
                <div className="grid md:grid-cols-1 gap-6">
                    <DashboardCard title="1. Interoperabilidade de Dados Energéticos" icon={<CogIcon className="w-6 h-6 text-cyan-400" />}>
                        <p>Como integrar dados de diferentes fontes (distribuidoras, geradoras, consumidores, medidores inteligentes) de forma segura e padronizada, utilizando padrões abertos e garantindo escalabilidade?</p>
                    </DashboardCard>
                    <DashboardCard title="2. Eficiência Operacional" icon={<TrendingUpIcon className="w-6 h-6 text-green-400" />}>
                        <p>Como usar dados energéticos abertos para otimizar redes de distribuição, prever falhas ou reduzir perdas técnicas?</p>
                        <p className="text-sm text-gray-400 mt-2"><strong>Contexto adicional:</strong> redes de grande porte, cuja complexidade gera oportunidades significativas de ganhos operacionais.</p>
                    </DashboardCard>
                    <DashboardCard title="3. Modelos de Negócio Inovadores" icon={<InfoIcon className="w-6 h-6 text-purple-400" />}>
                        <p>Como criar e testar produtos e serviços baseados em dados energéticos abertos que gerem valor para empresas e sociedade?</p>
                         <p className="text-sm text-gray-400 mt-2"><strong>Nota:</strong> Estamos interessados tanto em pilotos imediatos quanto em explorações conjuntas de novos modelos.</p>
                    </DashboardCard>
                </div>
            </Section>

            <Section title="Requisitos Fundamentais">
                <div className="bg-red-900/20 border-l-4 border-red-500 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-red-400 mb-2">Conformidade e Segurança</h3>
                    <p>Garantir que o compartilhamento de dados ocorra com consentimento, segurança e em conformidade regulatória (LGPD e padrões do setor elétrico).</p>
                </div>
            </Section>

        </div>
    </div>
  );
};

export default OpenEnergy;