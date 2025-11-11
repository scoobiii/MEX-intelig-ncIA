import React, { useState } from 'react';
import { CloseIcon, InfoIcon } from './application/components/icons';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type HelpTab = 'user' | 'tutorial' | 'glossary' | 'newAsset' | 'partners' | 'devops' | 'status';

// --- Content Components ---

const UserGuideContent: React.FC = () => (
    <div>
        <h3 className="text-xl font-bold text-white mb-4">Guia do Usuário</h3>
        <div className="space-y-4 text-gray-300">
            <p>Este painel oferece uma visão completa e em tempo real da performance, operações e finanças da usina de energia.</p>
            <h4 className="font-semibold text-lg text-cyan-400 pt-2 border-t border-gray-700">Navegação</h4>
            <p>Use o menu de navegação no topo para alternar entre as diferentes seções do dashboard.</p>
            <h4 className="font-semibold text-lg text-cyan-400 pt-2 border-t border-gray-700">Widgets do Dashboard</h4>
            <p>Cada card (widget) no dashboard foca em um aspecto específico da operação da usina:</p>
            <ul className="list-disc list-inside space-y-1 pl-4 text-sm">
                <li><strong>Usina:</strong> Visão geral da produção de energia, turbinas e emissões.</li>
                <li><strong>Utilitários:</strong> Monitoramento de sistemas auxiliares como refrigeração e fluxo de energia.</li>
                <li><strong>Data Center:</strong> Acompanhamento da performance do data center integrado.</li>
                <li><strong>Financeiro:</strong> Análise financeira, incluindo receitas, custos e projeções.</li>
                <li><strong>Configuração:</strong> Controles para ajustar parâmetros da usina e gerenciar projetos.</li>
            </ul>
            <h4 className="font-semibold text-lg text-cyan-400 pt-2 border-t border-gray-700">Maximizar Widgets</h4>
            <p>A maioria dos widgets pode ser expandida para uma visualização detalhada clicando no ícone de maximizar no canto superior direito do card.</p>
        </div>
    </div>
);

const TutorialContent: React.FC = () => (
    <div>
        <h3 className="text-xl font-bold text-white mb-4">Tutorial da Plataforma</h3>
        <p className="text-gray-400 mb-6">Siga estes passos para se familiarizar com as principais funcionalidades do dashboard.</p>
        <div className="space-y-6">
            <div>
                <h4 className="text-lg font-semibold text-cyan-400 mb-2">1. Navegue pelas Seções</h4>
                <p>Use o menu superior (Usina, Utilitários, etc.) para explorar diferentes áreas do sistema. Cada seção oferece uma visão detalhada de uma parte da operação.</p>
            </div>
            <div>
                <h4 className="text-lg font-semibold text-cyan-400 mb-2">2. Analise a Usina</h4>
                <p>Na página "Usina", você pode ver a produção de energia em tempo real, monitorar a saúde das turbinas e verificar as emissões. Use os controles para simular diferentes cenários de combustível.</p>
            </div>
            <div>
                <h4 className="text-lg font-semibold text-cyan-400 mb-2">3. Simule Cenários</h4>
                <p>Vá para "Configuração" para ligar/desligar a usina, ativar/desativar turbinas, e alterar o mix de combustível. Veja como suas ações impactam a eficiência e a produção em todo o dashboard.</p>
            </div>
            <div>
                <h4 className="text-lg font-semibold text-cyan-400 mb-2">4. Explore o Data Center</h4>
                <p>Na aba "Data Center", use o "Treemap de Consumo" para identificar rapidamente os racks que mais consomem energia ou refrigeração. Passe o mouse sobre um rack para ver detalhes.</p>
            </div>
            <div>
                <h4 className="text-lg font-semibold text-cyan-400 mb-2">5. Acompanhe as Finanças</h4>
                <p>A página "Financeiro" mostra como a operação da usina e do data center se traduz em resultados financeiros, incluindo receitas, custos e lucros. Exporte os dados para uma análise mais profunda.</p>
            </div>
        </div>
    </div>
);

const GlossaryContent: React.FC = () => (
     <div>
        <h3 className="text-xl font-bold text-white mb-4">Glossário e Análise Estratégica</h3>
        <div className="space-y-6 text-gray-300">
             <div>
                <h4 className="font-semibold text-lg text-cyan-400 mb-2">Termos da Plataforma</h4>
                <div className="space-y-3 text-sm">
                    <p><strong>PUE (Power Usage Effectiveness):</strong> Uma métrica que descreve a eficiência energética de um data center. Quanto mais próximo de 1.0, mais eficiente é o data center.</p>
                    <p><strong>Trigeração:</strong> Produção simultânea de eletricidade, calor e frio a partir de uma única fonte de combustível, aumentando drasticamente a eficiência geral do sistema.</p>
                    <p><strong>TIAC (Turbine Inlet Air Cooling):</strong> Sistema que resfria o ar de admissão da turbina a gás, aumentando a densidade do ar e, consequentemente, a potência e a eficiência da turbina.</p>
                    <p><strong>Diagrama de Sankey:</strong> Um tipo de fluxograma em que a largura das setas é mostrada proporcionalmente à quantidade de fluxo, ideal para visualizar fluxos de energia ou materiais.</p>
                </div>
            </div>

            <div className="border-t border-gray-700 pt-4">
                <h4 className="font-semibold text-lg text-cyan-400 mb-2">Análise Comparativa e Estratégica</h4>

                <div className="mt-4 bg-gray-900/50 p-4 rounded-lg">
                    <p className="font-semibold text-white">Por que a China, com dimensões continentais similares, tem perdas elétricas muito menores (6% vs. 16%) que o Brasil?</p>
                    <ul className="list-disc list-inside space-y-2 mt-2 text-sm">
                        <li><strong>Geração Próxima ao Consumo:</strong> Grandes centros industriais e populacionais da China foram desenvolvidos com geração de energia local massiva, ao contrário do modelo brasileiro, que depende de hidrelétricas remotas.</li>
                        <li><strong>Investimento Massivo em UHVDC:</strong> A China investiu mais de US$ 95 bilhões em linhas de transmissão de Ultra-Alta Tensão (UHVDC), que reduzem as perdas em longas distâncias para menos de 3%, comparado a 7-10% em linhas de corrente alternada (AC) equivalentes.</li>
                        <li><strong>Rede Moderna e Inteligente (Smart Grid):</strong> A rede chinesa é mais nova, digitalizada e automatizada, permitindo um monitoramento e balanceamento de carga muito mais preciso, o que minimiza perdas técnicas.</li>
                        <li><strong>Gestão Centralizada e Agressiva:</strong> A State Grid Corporation of China (SGCC) opera com um mandato para eficiência máxima, implementando rapidamente novas tecnologias e padrões rigorosos de manutenção.</li>
                        <li><strong>Combate a Perdas Não-Técnicas:</strong> Medição inteligente e políticas rigorosas reduziram drasticamente o furto de energia ("gatos"), que ainda é um problema significativo no Brasil.</li>
                    </ul>
                </div>

                <div className="mt-4 bg-gray-900/50 p-4 rounded-lg">
                    <p className="font-semibold text-white">Onde aprender na China e qual seria o custo/benefício para o Brasil?</p>
                    <ul className="list-disc list-inside space-y-2 mt-2 text-sm">
                        <li><strong>Onde Aprender:</strong> O principal alvo é a <strong>State Grid Corporation of China (SGCC)</strong> em Pequim. A visita técnica deve focar nos seus centros de P&D em tecnologia UHVDC e na operação dos centros de controle de Smart Grid.</li>
                        <li><strong>CAPEX Estimado para o Brasil:</strong> Um programa de modernização similar, focado em UHVDC e smart grids, exigiria um investimento na ordem de <strong>US$ 50 a US$ 100 bilhões</strong> distribuídos ao longo de 10-15 anos.</li>
                        <li><strong>OPEX:</strong> Aumentaria nos primeiros anos devido à implantação e treinamento, mas reduziria a longo prazo com a automação e a diminuição de falhas e custos de manutenção corretiva.</li>
                        <li><strong>ROI para o Brasil:</strong> O retorno é de longo prazo (15-20 anos). Os benefícios são sistêmicos: redução do "Custo Brasil", aumento da competitividade industrial, atração de indústrias eletro-intensivas (como data centers) e maior segurança energética.</li>
                        <li><strong>Impacto no Consumo e PIB:</strong> Uma rede mais confiável e barata poderia destravar um aumento do consumo per capita em <strong>~15-25%</strong> e adicionar de <strong>0.5% a 1%</strong> ao crescimento anual do PIB per capita, ao viabilizar novos setores industriais.</li>
                    </ul>
                </div>

                <div className="mt-4 bg-gray-900/50 p-4 rounded-lg">
                    <p className="font-semibold text-white">Qual o ROI para as distribuidoras de energia?</p>
                     <ul className="list-disc list-inside space-y-2 mt-2 text-sm">
                        <li><strong>Retorno Direto:</strong> O benefício é imediato. Cada 1% de redução nas perdas técnicas e não-técnicas se traduz diretamente em aumento de receita, pois a distribuidora deixa de pagar por uma energia que "vaza" do sistema antes de ser faturada.</li>
                        <li><strong>ROI Estimado:</strong> Para as distribuidoras, o ROI de investimentos em medição inteligente e modernização da rede de distribuição é muito mais rápido, estimado entre <strong>5 a 7 anos</strong>.</li>
                        <li><strong>Benefícios Adicionais:</strong> Redução de custos operacionais com equipes de campo (leitura e corte/religação remotos), maior estabilidade da rede (menos multas por interrupção), e a possibilidade de oferecer novos serviços de gestão de energia aos clientes.</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
);

const NewAssetGuideContent: React.FC = () => (
    <div>
        <h3 className="text-xl font-bold text-white mb-4">Novo Ativo</h3>
        <p>Para adicionar um novo projeto de usina no sistema, siga os passos na página de Configuração:</p>
        <ol className="list-decimal list-inside space-y-2 mt-4">
            <li>Navegue até a página "Configuração".</li>
            <li>No card "Gerenciamento de Projetos", clique no botão "Criar Novo Projeto".</li>
            <li>Um novo projeto será adicionado à lista e selecionado automaticamente.</li>
            <li>Use os campos no card "Detalhes do Projeto" para editar o nome, potência e outras informações do novo ativo.</li>
        </ol>
    </div>
);


const PartnersGuideContent: React.FC = () => (
     <div className="pt-4">
        <h3 className="font-semibold text-xl text-cyan-400 mb-2">Guia para Parceiros e Investidores</h3>
        <p className="text-gray-400 mb-4">Esta seção fornece uma visão estratégica do Projeto Mauá, destacando a tese de investimento e o potencial tecnológico para investidores.</p>

        <h4 className="font-semibold text-lg text-cyan-400 mt-4 mb-2">Potencial do Data Cloud: Rumo à Computação de Exaescala</h4>
        <p className="text-gray-300 mb-4">O Data Cloud do projeto MAUAX não é apenas uma infraestrutura de TI; é uma ambição estratégica de posicionar Mauá no mapa global da supercomputação. Inspirado pelos sistemas mais poderosos do mundo, o projeto foi desenhado em fases, cada uma com um potencial de computação e retorno financeiro significativos.</p>

        <div className="space-y-4">
            <div className="bg-gray-700/50 p-4 rounded-lg">
                <h5 className="font-bold text-white">Fase 1: Arquitetura 'Selene' (Base para o Top 10 Mundial)</h5>
                <p className="text-gray-300 text-sm mt-1">Nossa fase inicial se espelha na arquitetura do supercomputador Selene da NVIDIA (Top 5 mundial), um sistema NVIDIA DGX A100 SuperPOD. Esta configuração oferece um desempenho inicial de <strong>63.4 petaflops</strong> em HPL.</p>
                <p className="text-gray-300 text-sm mt-2 font-semibold"><strong>Potencial de Mercado:</strong> Esta capacidade nos posiciona para atender a uma demanda massiva por treinamento de IA, simulações complexas e HPC comercial, competindo diretamente com os principais players globais.</p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg">
                <h5 className="font-bold text-white">Fase 2: Arquitetura 'Fugaku' (Liderança em Exaescala)</h5>
                <p className="text-gray-300 text-sm mt-1">A segunda fase visa um salto quântico, mirando a escala do supercomputador Fugaku (Nº 1 do mundo). Com uma expansão massiva, o potencial de desempenho HPL ultrapassaria os <strong>442 petaflops</strong>, consolidando a liderança no Hemisfério Sul.</p>
                <p className="text-gray-300 text-sm mt-2 font-semibold"><strong>Potencial de IA de Precisão Mista:</strong> Mais importante, esta escala nos permitiria alcançar <strong>2.0 exaflops</strong> em benchmarks de IA de precisão mista (HPC-AI), um marco alcançado por poucos. Isso nos tornaria um centro nevrálgico para o desenvolvimento dos maiores modelos de linguagem e pesquisa científica avançada.</p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg">
                <h5 className="font-bold text-white">Diferencial Estratégico: Eficiência Energética</h5>
                <p className="text-gray-300 text-sm mt-1">Inspirados pelos sistemas do Green500, como o NVIDIA DGX SuperPOD (26.2 gigaflops/watt), nosso projeto integra o Data Cloud diretamente com a usina de trigeração. Isso permite uma eficiência energética sem precedentes, reduzindo drasticamente o OPEX e o PUE (Power Usage Effectiveness) para níveis abaixo de 1.1, um grande atrativo para clientes com uso intensivo de computação.</p>
            </div>
        </div>
    </div>
);

const DevOpsGuideContent: React.FC = () => (
    <div>
        <h3 className="text-xl font-bold text-white mb-4">Guia DevOps</h3>
        <p>Este dashboard usa o localStorage do navegador para persistir as configurações do usuário e o estado da simulação.</p>
        <div className="bg-gray-900 p-4 rounded-md mt-4 font-mono text-sm text-gray-300">
            <p>Você pode inspecionar ou limpar os seguintes itens no seu DevTools:</p>
            <p className="mt-2 text-cyan-400">Chaves do localStorage:</p>
            <ul className="list-disc pl-5 mt-1 text-xs">
                <li>app-all-configs</li>
                <li>app-resource-config</li>
                <li>app-selected-plant</li>
                <li>app-available-plants</li>
                <li>app-user-settings</li>
            </ul>
        </div>
    </div>
);

const ProjectStatusContent: React.FC = () => (
    <div>
        <h3 className="text-xl font-bold text-white mb-4">Status do Projeto</h3>
        <div className="space-y-6">
            <div>
                <h4 className="text-lg font-semibold text-cyan-400 mb-2">Status Atual</h4>
                <p>Em desenvolvimento ativo - Sprint 2.</p>
            </div>
            
            <div className="border-t border-gray-700 pt-4">
                <h4 className="text-lg font-semibold text-cyan-400 mb-2">Histórico de Mudanças (Changelog)</h4>
                <div className="space-y-3">
                     <div className="bg-gray-700/50 p-3 rounded-lg">
                        <p className="font-semibold text-white">v1.2.0 - Central de Ajuda Expandida</p>
                        <p className="text-sm text-gray-300">Adição das seções Tutorial, Parceiros/Investidores e Guia DevOps na Central de Ajuda.</p>
                    </div>
                     <div className="bg-gray-700/50 p-3 rounded-lg">
                        <p className="font-semibold text-white">v1.1.0 - Treemap de Consumo</p>
                        <p className="text-sm text-gray-300">Implementação do Treemap interativo no Data Center para análise de consumo de energia e refrigeração por rack.</p>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-700 pt-4">
                <h4 className="text-lg font-semibold text-cyan-400 mb-2">Próximos Sprints (Roadmap)</h4>
                <div className="space-y-3">
                    <div>
                        <p className="font-semibold text-white">Sprint 3: Análise Nuclear Detalhada</p>
                        <p className="text-sm text-gray-300">Substituição da análise SMR por dados detalhados do paper "Energies 2024".</p>
                    </div>
                     <div>
                        <p className="font-semibold text-white">Sprint 4: Refinamento de UI/UX</p>
                        <p className="text-sm text-gray-300">Melhoria geral da interface, consistência visual e experiência do usuário em todos os componentes.</p>
                    </div>
                     <div>
                        <p className="font-semibold text-white">Sprint 5: Modo Offline e PWA</p>
                        <p className="text-sm text-gray-300">Implementação de funcionalidades offline e conversão da aplicação para um Progressive Web App (PWA).</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);


// --- Main Modal Component ---

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<HelpTab>('glossary');

  const tabs: { id: HelpTab, label: string }[] = [
      { id: 'status', label: 'Status do Projeto' },
      { id: 'tutorial', label: 'Tutorial' },
      { id: 'user', label: 'Guia do Usuário' },
      { id: 'glossary', label: 'Glossário' },
      { id: 'newAsset', label: 'Novo Ativo' },
      { id: 'partners', label: 'Parceiros e Investidores' },
      { id: 'devops', label: 'Guia DevOps' },
  ];

  const renderContent = () => {
    switch (activeTab) {
        case 'user': return <UserGuideContent />;
        case 'tutorial': return <TutorialContent />;
        case 'glossary': return <GlossaryContent />;
        case 'newAsset': return <NewAssetGuideContent />;
        case 'partners': return <PartnersGuideContent />;
        case 'devops': return <DevOpsGuideContent />;
        case 'status': return <ProjectStatusContent />;
        default: return <GlossaryContent />;
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
    >
      <div
        className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <InfoIcon className="w-6 h-6 text-cyan-400" />
            <h2 id="help-modal-title" className="text-xl font-semibold text-white">
              Central de Ajuda
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            aria-label="Fechar"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>
        
        <div className="flex flex-grow min-h-0">
          <nav className="w-1/4 p-4 border-r border-gray-700 flex-shrink-0 overflow-y-auto">
            <ul className="space-y-2">
              {tabs.map(tab => (
                  <li key={tab.id}>
                      <button 
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full text-left p-2 rounded-md transition-colors text-sm font-medium ${
                            activeTab === tab.id
                            ? 'bg-cyan-500/20 text-cyan-300'
                            : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                        }`}
                      >
                          {tab.label}
                      </button>
                  </li>
              ))}
            </ul>
          </nav>
          <main className="w-3/4 p-6 overflow-y-auto">
              {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;