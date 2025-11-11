import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import DashboardCard from '../DashboardCard';
import { BoltIcon, CogIcon } from '../application/components/icons';

const SimpleMarkdown: React.FC<{ text: string }> = ({ text }) => {
    const renderContent = () => {
        const blocks = text.split('\n\n');
        return blocks.map((block, index) => {
            if (block.startsWith('## ')) {
                return <h2 key={index} className="text-2xl font-bold text-white mt-6 mb-3">{block.substring(3)}</h2>;
            }
            if (block.startsWith('* ')) {
                const items = block.split('\n').map((item, i) => {
                    const content = item.replace(/^\* /, '').replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>');
                    return (
                        <li key={i} className="flex items-start">
                            <span className="text-cyan-400 mr-3 mt-1">&#10148;</span>
                            <span dangerouslySetInnerHTML={{ __html: content }} />
                        </li>
                    );
                });
                return <ul key={index} className="space-y-3 mt-4">{items}</ul>;
            }
            const p_content = block.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>');
            return <p key={index} className="mb-4" dangerouslySetInnerHTML={{ __html: p_content }} />;
        });
    };

    return <div className="prose text-gray-300 leading-relaxed">{renderContent()}</div>;
};

const GridAnalysis: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setAnalysis(null);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Você é um engenheiro especialista em redes elétricas e um analista de IA. A rede de distribuição de energia elétrica do Brasil, o Sistema Interligado Nacional (SIN), tem uma perda média de 16%. Em comparação, a China, um país com dimensões continentais semelhantes, tem perdas de apenas 6%. Os principais componentes do SIN são extensas linhas de transmissão de longa distância, inúmeras subestações e uma vasta rede de distribuição urbana e rural.

Com base nesse contexto, identifique os pontos críticos mais prováveis que contribuem para essas altas perdas no Brasil e sugira soluções concretas e acionáveis para resolvê-los. Formate sua resposta em markdown, com seções distintas para 'Pontos Críticos' e 'Soluções Propostas'. Use negrito para destacar termos chave.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      setAnalysis(response.text);
    } catch (e) {
      console.error("Error calling Gemini API:", e);
      setError("Falha ao se comunicar com a IA. Verifique a chave de API e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 space-y-6">
      <DashboardCard title="Análise de Perdas na Rede Elétrica (SIN)" icon={<BoltIcon className="w-6 h-6" />}>
        <div className="p-4">
          <p className="text-gray-400 mb-4">
            O Brasil enfrenta um desafio significativo com perdas de 16% na distribuição de energia, em contraste com os 6% da China. Esta ferramenta utiliza IA para analisar as causas prováveis e propor soluções estratégicas para otimizar o Sistema Interligado Nacional.
          </p>
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-500 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <CogIcon className="w-5 h-5 animate-spin" />
                Analisando...
              </>
            ) : (
              'Analisar Pontos Críticos com IA'
            )}
          </button>
        </div>
      </DashboardCard>
      
      {error && (
        <div className="p-4 bg-red-900/50 border border-red-500 text-red-300 rounded-lg">
          {error}
        </div>
      )}
      
      {analysis && (
        <DashboardCard title="Resultados da Análise de IA" icon={<BoltIcon className="w-6 h-6 text-green-400" />}>
          <div className="p-4 animate-fadeIn">
            <SimpleMarkdown text={analysis} />
          </div>
        </DashboardCard>
      )}
       <style>{`
            @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
            }
            .animate-fadeIn { 
            animation: fadeIn 0.3s ease-in-out; 
            }
        `}</style>
    </div>
  );
};

export default GridAnalysis;
