import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter } from 'recharts';
import { BoltIcon as Power, FactoryIcon as Factory, CogIcon as Settings, InfoIcon as Info, ChevronDownIcon as ChevronDown, ChevronUpIcon as ChevronUp, ChartBarIcon as BarChart3, TrendingUpIcon as TrendingUp, MagnifyingGlassIcon as Search, CloseIcon } from '../application/components/icons';
import { POWER_PLANTS } from '../data/plants';
import { Plant } from '../types';

interface PowerPlantSystemProps {
}

const Metric = ({ label, value, unit, icon: Icon, colorClass = "text-blue-600" }) => (
  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
    <div className="flex items-center space-x-2">
      <Icon className={`w-5 h-5 ${colorClass}`} />
      <span className="text-sm text-gray-600 font-medium">{label}</span>
    </div>
    <span className={`text-lg font-bold font-mono ${colorClass}`}>
      {value != null ? `${value.toLocaleString('pt-BR')} ${unit || ''}`.trim() : 'N/A'}
    </span>
  </div>
);

const PowerPlantSystem: React.FC<PowerPlantSystemProps> = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlant, setSelectedPlant] = useState('all');
  const [expandedSections, setExpandedSections] = useState({
    plants: true,
    analytics: true,
    emissions: true,
    efficiency: true
  });

  const plantsData = POWER_PLANTS.filter(p => p.cycleKey);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const filteredPlants = plantsData.filter(plant => {
    const matchesFilter = selectedFilter === 'all' || 
                         (plant.fuelKey && plant.fuelKey.toLowerCase().includes(selectedFilter.toLowerCase()));
    
    const matchesSearch = searchTerm === '' ||
                         plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (plant.locationKey && plant.locationKey.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const highlightedPlant = selectedPlant === 'all' ? null : plantsData.find(p => p.name === selectedPlant);

  const fuelTypeData = [
    { name: 'Gás Natural', count: plantsData.filter(p => p.fuelKey.includes('NATURAL_GAS')).length, generation: plantsData.filter(p => p.fuelKey.includes('NATURAL_GAS')).reduce((sum, p) => sum + (p.generation2023 || 0), 0) },
    { name: 'Carvão Mineral', count: plantsData.filter(p => p.fuelKey.includes('COAL')).length, generation: plantsData.filter(p => p.fuelKey.includes('COAL')).reduce((sum, p) => sum + (p.generation2023 || 0), 0) },
    { name: 'Óleo Combustível', count: plantsData.filter(p => p.fuelKey.includes('OIL')).length, generation: plantsData.filter(p => p.fuelKey.includes('OIL')).reduce((sum, p) => sum + (p.generation2023 || 0), 0) }
  ];

  const topEmitters = plantsData
    .filter(p => p.emissions2023)
    .sort((a, b) => (b.emissions2023 ?? 0) - (a.emissions2023 ?? 0))
    .slice(0, 10);

  const efficiencyData = plantsData
    .filter(p => p.efficiency && p.rate)
    .map(p => ({
      name: p.name,
      efficiency: p.efficiency,
      rate: p.rate,
      fuel: p.fuelKey
    }));

  const COLORS = ['#3B82F6', '#EF4444', '#F59E0B', '#10B981', '#8B5CF6'];

  const SectionCard: React.FC<{title: string, icon: React.FC<any>, isExpanded: boolean, onToggle: () => void, children: React.ReactNode}> = ({ title, icon: Icon, isExpanded, onToggle, children }) => (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-4">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-3">
          <Icon className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">{title}</h3>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
      </div>
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          {children}
        </div>
      )}
    </div>
  );

  const getFuelColor = (fuel: string) => {
    if (fuel.includes('NATURAL_GAS')) return 'text-blue-600';
    if (fuel.includes('COAL')) return 'text-red-600';
    if (fuel.includes('OIL')) return 'text-orange-600';
    return 'text-gray-600';
  };

  const getFuelBgColor = (fuel: string) => {
    if (fuel.includes('NATURAL_GAS')) return 'bg-blue-50 border-blue-200';
    if (fuel.includes('COAL')) return 'bg-red-50 border-red-200';
    if (fuel.includes('OIL')) return 'bg-orange-50 border-orange-200';
    return 'bg-gray-50 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 text-gray-800">
        <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { 
          animation: fadeIn 0.3s ease-in-out; 
        }
      `}</style>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Factory className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">Inventário Nacional de Usinas Termelétricas</h1>
          </div>
          <p className="text-gray-600 text-lg">Análise de Performance, Emissões e Eficiência (Ano Base 2023)</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="search-plant" className="block text-sm font-medium text-gray-700 mb-1">Buscar Usina</label>
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="search-plant"
                  type="text"
                  placeholder="Nome ou localização..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="fuel-filter" className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Combustível</label>
              <select
                id="fuel-filter"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="w-full py-2 px-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todos os Combustíveis</option>
                <option value="NATURAL_GAS">Gás Natural</option>
                <option value="COAL">Carvão Mineral</option>
                <option value="OIL">Óleo Combustível</option>
              </select>
            </div>

            <div>
              <label htmlFor="locate-plant" className="block text-sm font-medium text-gray-700 mb-1">Destacar Usina no Mapa</label>
              <select
                id="locate-plant"
                value={selectedPlant}
                onChange={(e) => setSelectedPlant(e.target.value)}
                className="w-full py-2 px-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Sem destaque</option>
                {plantsData.sort((a, b) => a.name.localeCompare(b.name)).map(plant => (
                  <option key={plant.name} value={plant.name}>
                    {plant.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {highlightedPlant && (
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-lg border-2 border-blue-500 p-6 animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-3">
                  <Info className="w-8 h-8 text-blue-600" />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Destaque: {highlightedPlant.name}</h2>
                    <p className="text-gray-500">{highlightedPlant.locationKey}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPlant('all')}
                  className="p-2 rounded-full text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Fechar destaque"
                >
                  <CloseIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-lg text-gray-800 mb-3">Visão Geral</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p><strong>Combustível:</strong> {highlightedPlant.fuelKey}</p>
                    <p><strong>Tecnologia:</strong> {highlightedPlant.cycleKey}</p>
                    {highlightedPlant.descriptionKey && (
                      <p className="pt-2 italic border-t border-gray-200 mt-2">{highlightedPlant.descriptionKey}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg text-gray-800 mb-3">Indicadores Chave</h4>
                  
                  <div>
                    <h5 className="font-medium text-gray-500 text-sm uppercase tracking-wider mb-2">Capacidade e Produção</h5>
                    <div className="space-y-2">
                        <Metric label="Potência" value={highlightedPlant.power} unit="MW" icon={Power} colorClass="text-blue-600" />
                        <Metric label="Geração" value={highlightedPlant.generation2023} unit="GWh" icon={TrendingUp} colorClass="text-green-600" />
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-500 text-sm uppercase tracking-wider mb-2">Dados de Emissão</h5>
                     <div className="space-y-2">
                        <Metric label="Emissões" value={highlightedPlant.emissions2023} unit="mil tCO₂e" icon={Factory} colorClass="text-red-600" />
                    </div>
                  </div>

                   <div>
                    <h5 className="font-medium text-gray-500 text-sm uppercase tracking-wider mb-2">Performance de Eficiência</h5>
                     <div className="space-y-2">
                        <Metric label="Eficiência Total" value={highlightedPlant.efficiency} unit="%" icon={Settings} colorClass="text-purple-600" />
                        <Metric label="Taxa de Emissão" value={highlightedPlant.rate} unit="tCO₂e/GWh" icon={BarChart3} colorClass="text-orange-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <SectionCard
              title="Distribuição por Combustível"
              icon={BarChart3}
              isExpanded={expandedSections.analytics}
              onToggle={() => toggleSection('analytics')}
            >
              <div className="space-y-6 mt-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Contagem de Usinas por Combustível</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={fuelTypeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3B82F6" name="Quantidade" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Geração por Combustível (GWh)</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={fuelTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({name, value}) => `${name}: ${(Number(value)/1000).toFixed(1)}K GWh`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="generation"
                      >
                        {fuelTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${value.toLocaleString()} GWh`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Top 10 Emissores de GEE (2023)"
              icon={TrendingUp}
              isExpanded={expandedSections.emissions}
              onToggle={() => toggleSection('emissions')}
            >
              <div className="space-y-6 mt-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topEmitters} layout="vertical" margin={{ left: 100 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} fontSize={10} interval={0}/>
                      <Tooltip formatter={(value: number) => `${value.toLocaleString()} mil tCO₂e`} />
                      <Legend />
                      <Bar dataKey="emissions2023" name="Emissões (k tCO₂e)" fill="#EF4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </SectionCard>
          </div>

          <div>
            <SectionCard
              title="Análise de Eficiência"
              icon={Settings}
              isExpanded={expandedSections.efficiency}
              onToggle={() => toggleSection('efficiency')}
            >
              <div className="space-y-6 mt-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Relação Eficiência vs. Taxa de Emissão</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" dataKey="efficiency" name="Eficiência (%)" unit="%" />
                      <YAxis type="number" dataKey="rate" name="Taxa Emissão (tCO₂e/GWh)" unit="t/GWh" />
                      <Tooltip 
                        cursor={{ strokeDasharray: '3 3' }}
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                    <div className="bg-white p-2 border border-gray-300 rounded shadow-lg">
                                        <p className="font-bold">{data.name}</p>
                                        <p>Eficiência: {data.efficiency}%</p>
                                        <p>Taxa Emissão: {data.rate} tCO₂e/GWh</p>
                                        <p>Combustível: {data.fuel}</p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                      />
                      <Scatter data={efficiencyData} fill="#3B82F6" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title={`Lista de Usinas (${filteredPlants.length})`}
              icon={Factory}
              isExpanded={expandedSections.plants}
              onToggle={() => toggleSection('plants')}
            >
              <div className="space-y-3 mt-4 max-h-[500px] overflow-y-auto pr-2">
                {filteredPlants.length > 0 ? filteredPlants.map((plant, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${getFuelBgColor(plant.fuelKey)}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-800">{plant.name}</h4>
                      <span className={`text-sm font-medium ${getFuelColor(plant.fuelKey)}`}>
                        {plant.fuelKey}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium">Localização:</span> {plant.locationKey}</p>
                      <p><span className="font-medium">Tecnologia:</span> {plant.cycleKey}</p>
                      <p><span className="font-medium">Potência:</span> {plant.power} MW</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3 text-xs">
                      <div className="bg-white p-2 rounded">
                        <p className="text-gray-500">Geração 2023</p>
                        <p className="font-bold text-blue-600">{(plant.generation2023 || 0).toLocaleString()} GWh</p>
                      </div>
                      <div className="bg-white p-2 rounded">
                        <p className="text-gray-500">Emissões 2023</p>
                        <p className="font-bold text-red-600">{plant.emissions2023?.toLocaleString() || 'N/A'} mil tCO₂e</p>
                      </div>
                    </div>
                  </div>
                )) : (
                  <p className="text-center text-gray-500 py-8">Nenhuma usina encontrada com os filtros atuais.</p>
                )}
              </div>
            </SectionCard>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Resumo do Inventário</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{plantsData.length}</div>
              <div className="text-gray-600">Usinas Inventariadas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">26,9</div>
              <div className="text-gray-600">TWh Gerados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">17,9</div>
              <div className="text-gray-600">MtCO₂e Emitidos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">671</div>
              <div className="text-gray-600">Taxa Média de Emissão (tCO₂e/GWh)</div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-start space-x-3">
            <Info className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Sobre o Inventário</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Este sistema apresenta dados do 4º Inventário de Emissões Atmosféricas em Usinas Termelétricas (ano-base 2023) 
                realizado pelo Instituto de Energia e Meio Ambiente (IEMA). O inventário abrange 67 usinas termelétricas a 
                combustíveis fósseis que forneceram energia ao Sistema Interligado Nacional (SIN). Destaca-se que 69% da 
                geração foi proveniente de usinas a gás natural, enquanto apenas 10 usinas foram responsáveis por 71% das 
                emissões de gases de efeito estufa. A geração termelétrica fóssil voltou aos níveis de antes da crise hídrica 
                de 2014, representando 9% da geração total nacional em 2023.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PowerPlantSystem;