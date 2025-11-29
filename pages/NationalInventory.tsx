import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
// FIX: Add all required icon imports with aliases to resolve "Cannot find name" errors.
import { FactoryIcon as Factory, MagnifyingGlassIcon as Search, ChevronDownIcon as ChevronDown, ChevronUpIcon as ChevronUp, InfoIcon as Info, CloseIcon, BoltIcon as Power, TrendingUpIcon as TrendingUp, ChartBarIcon as BarChart3 } from '../application/components/icons';
import { NATIONAL_PLANTS_DATA, BRAZIL_STATES } from '../data/nationalInventory';
import { Plant } from '../types';

interface NationalPlant {
    name: string;
    uf: string;
    fuel: string;
    status: 'Em Operação' | 'Em Construção' | 'Outorgada';
    powerMW: number;
}

type SortKey = keyof NationalPlant;
type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 15;

// FIX: Define Metric component used in the highlighted plant section. It was missing from this file, causing a "Cannot find name" error.
const Metric: React.FC<{ label: string; value: string | number | null | undefined; unit?: string; icon: React.FC<any>; colorClass?: string }> = ({ label, value, unit, icon: Icon, colorClass = "text-blue-600" }) => (
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

const NationalInventory: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [fuelFilter, setFuelFilter] = useState('all');
    const [stateFilter, setStateFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'powerMW', direction: 'desc' });
    const [selectedPlant, setSelectedPlant] = useState('all');
    // FIX: Updated `expandedSections` state to match the sections rendered in the component. The previous state contained keys for components not present in this file, causing runtime errors.
    const [expandedSections, setExpandedSections] = useState({
        plants: true,
        analytics: true,
        powerByState: true,
    });

    const plantsData = NATIONAL_PLANTS_DATA;

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const filteredPlants = useMemo(() => {
        let plants = plantsData.filter(plant => {
            const matchesSearch = searchTerm === '' || plant.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFuel = fuelFilter === 'all' || plant.fuel === fuelFilter;
            const matchesState = stateFilter === 'all' || plant.uf === stateFilter;
            return matchesSearch && matchesFuel && matchesState;
        });

        if (sortConfig.key) {
            plants.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return plants;
    }, [searchTerm, fuelFilter, stateFilter, sortConfig]);

    const paginatedPlants = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredPlants.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredPlants, currentPage]);

    const totalPages = Math.ceil(filteredPlants.length / ITEMS_PER_PAGE);

    const handleSort = (key: SortKey) => {
        let direction: SortDirection = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const highlightedPlant = selectedPlant === 'all' ? undefined : plantsData.find(p => p.name === selectedPlant);
    
    const fuelTypeData = useMemo(() => {
        const fuelMap = filteredPlants.reduce<Record<string, { count: number; power: number }>>((acc, p) => {
            if (!acc[p.fuel]) {
                acc[p.fuel] = { count: 0, power: 0 };
            }
            acc[p.fuel].count++;
            acc[p.fuel].power += p.powerMW;
            return acc;
        }, {});

        return Object.entries(fuelMap).map(([name, data]) => ({ name, ...data }));
    }, [filteredPlants]);
    
    const powerByState = useMemo(() => {
        const powerMap = filteredPlants.reduce<Record<string, number>>((acc, p) => {
            acc[p.uf] = (acc[p.uf] || 0) + p.powerMW;
            return acc;
        }, {});
        
        return Object.entries(powerMap)
            .map(([uf, power]) => ({ uf, power }))
            .sort((a, b) => b.power - a.power)
            .slice(0, 10);
    }, [filteredPlants]);

    const COLORS = ['#3B82F6', '#EF4444', '#F59E0B', '#10B981', '#8B5CF6', '#0EA5E9', '#EAB308'];

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
        if (fuel.includes('Gás Natural')) return 'text-blue-600';
        if (fuel.includes('Carvão Mineral')) return 'text-red-600';
        if (fuel.includes('Óleo')) return 'text-orange-600';
        if (fuel.includes('Hidráulica')) return 'text-sky-600';
        if (fuel.includes('Eólica')) return 'text-teal-600';
        if (fuel.includes('Solar')) return 'text-yellow-500';
        if (fuel.includes('Nuclear')) return 'text-purple-600';
        return 'text-gray-600';
      };
    
      const getFuelBgColor = (fuel: string) => {
        if (fuel.includes('Gás Natural')) return 'bg-blue-50 border-blue-200';
        if (fuel.includes('Carvão Mineral')) return 'bg-red-50 border-red-200';
        if (fuel.includes('Óleo')) return 'bg-orange-50 border-orange-200';
        if (fuel.includes('Hidráulica')) return 'bg-sky-50 border-sky-200';
        if (fuel.includes('Eólica')) return 'bg-teal-50 border-teal-200';
        if (fuel.includes('Solar')) return 'bg-yellow-50 border-yellow-200';
        if (fuel.includes('Nuclear')) return 'bg-purple-50 border-purple-200';
        return 'bg-gray-50 border-gray-200';
      };

    const summaryStats = useMemo(() => {
        const totalPower = filteredPlants.reduce((sum, p) => sum + p.powerMW, 0);
        const statusCounts = filteredPlants.reduce<Record<NationalPlant['status'], number>>((acc, p) => {
            acc[p.status] = (acc[p.status] || 0) + 1;
            return acc;
        }, {} as Record<NationalPlant['status'], number>);
        return { totalPower, statusCounts };
    }, [filteredPlants]);
    
    const fuelTypes = useMemo(() => ['all', ...Array.from(new Set(NATIONAL_PLANTS_DATA.map(p => p.fuel)))], []);

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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="search-plant" className="block text-sm font-medium text-gray-700 mb-1">Buscar Usina</label>
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      id="search-plant"
                      type="text"
                      placeholder="Nome da usina..."
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
                    value={fuelFilter}
                    onChange={(e) => setFuelFilter(e.target.value)}
                    className="w-full py-2 px-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {fuelTypes.map(fuel => <option key={fuel} value={fuel}>{fuel === 'all' ? 'Todos os Combustíveis' : fuel}</option>)}
                  </select>
                </div>
    
                <div>
                  <label htmlFor="state-filter" className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Estado</label>
                  <select
                    id="state-filter"
                    value={stateFilter}
                    onChange={(e) => setStateFilter(e.target.value)}
                    className="w-full py-2 px-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">Todos os Estados</option>
                    {BRAZIL_STATES.map(state => <option key={state} value={state}>{state}</option>)}
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
                        <p className="text-gray-500">{highlightedPlant.uf}</p>
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
                        <p><strong>Combustível:</strong> {highlightedPlant.fuel}</p>
                        <p><strong>Status:</strong> {highlightedPlant.status}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg text-gray-800 mb-3">Indicadores Chave</h4>
                      <Metric label="Potência" value={highlightedPlant.powerMW} unit="MW" icon={Power} colorClass="text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>
            )}
    
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <SectionCard
                  title="Análise Agregada"
                  icon={BarChart3}
                  isExpanded={expandedSections.analytics}
                  onToggle={() => toggleSection('analytics')}
                >
                  <div className="space-y-6 mt-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-3">Potência Instalada por Combustível (MW)</h4>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={fuelTypeData}
                            dataKey="power"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            label={({ name, value }) => `${name}: ${(value / 1000).toFixed(1)} GW`}
                          >
                            {fuelTypeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => `${value.toLocaleString('pt-BR')} MW`} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </SectionCard>
                
                <SectionCard
                    title="Top 10 Estados por Potência Instalada"
                    icon={TrendingUp}
                    isExpanded={expandedSections.powerByState}
                    onToggle={() => toggleSection('powerByState')}
                >
                    <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={powerByState} layout="vertical" margin={{ left: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" unit="MW" />
                                <YAxis dataKey="uf" type="category" width={40} />
                                <Tooltip formatter={(value: number) => `${value.toLocaleString('pt-BR')} MW`} />
                                <Legend />
                                <Bar dataKey="power" name="Potência (MW)" fill="#3B82F6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </SectionCard>
              </div>
    
              <div>
                <SectionCard
                  title={`Lista de Usinas (${filteredPlants.length})`}
                  icon={Factory}
                  isExpanded={expandedSections.plants}
                  onToggle={() => toggleSection('plants')}
                >
                  <div className="space-y-3 mt-4 max-h-[800px] overflow-y-auto pr-2">
                    {paginatedPlants.length > 0 ? paginatedPlants.map((plant, index) => (
                      <div key={index} className={`p-4 rounded-lg border ${getFuelBgColor(plant.fuel)}`}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-800">{plant.name}</h4>
                          <span className={`text-sm font-medium ${getFuelColor(plant.fuel)}`}>
                            {plant.fuel}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><span className="font-medium">Localização:</span> {plant.uf}</p>
                          <p><span className="font-medium">Status:</span> {plant.status}</p>
                          <p><span className="font-medium">Potência:</span> {plant.powerMW.toLocaleString('pt-BR')} MW</p>
                        </div>
                      </div>
                    )) : (
                      <p className="text-center text-gray-500 py-8">Nenhuma usina encontrada com os filtros atuais.</p>
                    )}
                  </div>
                   {totalPages > 1 && (
                        <div className="flex justify-center items-center mt-4 space-x-2">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Anterior</button>
                            <span>Página {currentPage} de {totalPages}</span>
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Próxima</button>
                        </div>
                    )}
                </SectionCard>
              </div>
            </div>
    
            <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Resumo do Inventário Filtrado</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{filteredPlants.length.toLocaleString('pt-BR')}</div>
                  <div className="text-gray-600">Usinas Encontradas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{(summaryStats.totalPower / 1000).toLocaleString('pt-BR', {maximumFractionDigits: 1})}</div>
                  <div className="text-gray-600">GW de Potência Total</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{summaryStats.statusCounts['Em Operação'] || 0}</div>
                  <div className="text-gray-600">Em Operação</div>
                </div>
                 <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{summaryStats.statusCounts['Em Construção'] || 0}</div>
                  <div className="text-gray-600">Em Construção</div>
                </div>
              </div>
            </div>
    
            <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-start space-x-3">
                <Info className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Sobre o Inventário</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Este sistema apresenta dados simulados inspirados em fontes de dados públicas como o SIGA (ANEEL) para fins de demonstração. 
                    Ele abrange um conjunto diversificado de usinas termelétricas, hidrelétricas, eólicas e solares em todo o Brasil, permitindo a análise da matriz energética sob diferentes perspectivas. Os dados de potência, status e localização são representativos, mas não devem ser usados para planejamento oficial.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
};

export default NationalInventory;