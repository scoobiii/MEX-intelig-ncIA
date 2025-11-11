import React, { useMemo } from 'react';
import { Turbine } from '../../types';
import DashboardCard from '../../DashboardCard';
import { CloseIcon, CogIcon } from './icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';

interface MainTurbineMonitorProps {
  turbine: Turbine;
  onClose: () => void;
  allTurbines: Turbine[];
  totalPowerOutput: number;
}

const MetricDisplay: React.FC<{ label: string; value: string | number; unit: string; className?: string }> = ({ label, value, unit, className = '' }) => (
    <div className={`text-center p-4 bg-gray-900 rounded-lg ${className}`}>
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-4xl font-bold text-white tracking-tight">{value}</p>
        <p className="text-gray-400">{unit}</p>
    </div>
);

const HistoryTooltip = ({ active, payload, label, dataKey, unit }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-700 p-2 border border-gray-600 rounded-md shadow-lg">
          <p className="label text-sm text-gray-300">{`Tempo: ${label}`}</p>
          <p className="intro text-sm text-cyan-400">{`${dataKey}: ${Math.round(payload[0].value)} ${unit}`}</p>
        </div>
      );
    }
    return null;
};


const MainTurbineMonitor: React.FC<MainTurbineMonitorProps> = ({ turbine, onClose, allTurbines, totalPowerOutput }) => {
  const isWindTurbine = turbine.type === 'Eólica';

  const statusInfo = {
      active: { text: 'Ativa', color: 'text-green-400' },
      inactive: { text: 'Inativa', color: 'text-gray-500' },
      error: { text: 'Erro', color: 'text-red-500 animate-pulse' }
  }
  
  const activeTurbines = allTurbines.filter(t => t.status === 'active');
  const powerPerTurbine = activeTurbines.length > 0 ? totalPowerOutput / activeTurbines.length : 0;
  
  const powerContributionData = useMemo(() => [
      activeTurbines.reduce((acc, turbineObj) => {
          const key = `Turbina #${turbineObj.id}`;
          acc[key] = powerPerTurbine;
          return acc;
      }, { name: 'Power' })
  ], [activeTurbines, powerPerTurbine]);

  const historyData = useMemo(() => {
    if (!turbine.history) return [];
    return [...turbine.history].reverse();
  }, [turbine.history]);
  
  const historyChartConfig = isWindTurbine 
    ? { dataKey: 'powerOutput', unit: 'MW', label: 'Histórico de Potência (últimos 20s)', domain: ['dataMin - 1', 'dataMax + 1'] }
    : { dataKey: 'rpm', unit: 'RPM', label: 'Histórico de RPM (últimos 20s)', domain: [3550, 3650] };

  return (
    <div 
        className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
    >
        <div 
            className="w-full max-w-6xl bg-gray-800 rounded-lg shadow-2xl overflow-hidden" 
            onClick={e => e.stopPropagation()}
        >
            <DashboardCard 
                title={`Monitor Detalhado - Turbina #${turbine.id}`} 
                icon={<CogIcon className="w-6 h-6" />}
                action={
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors" aria-label="Fechar">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                }
                className="max-h-[90vh]"
            >
              <div className="flex flex-col h-full overflow-y-auto pr-2">
                <div className="flex-shrink-0">
                    <div className={`text-center text-xl font-bold ${statusInfo[turbine.status].color}`}>
                        Status: {statusInfo[turbine.status].text}
                    </div>
                    
                    {isWindTurbine ? (
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                            <MetricDisplay label="Potência" value={turbine.powerOutput?.toFixed(1) || '0'} unit="MW" />
                            <MetricDisplay label="Veloc. Vento" value={turbine.windSpeed?.toFixed(1) || '0'} unit="m/s" />
                            <MetricDisplay label="RPM Pás" value={turbine.bladeRPM?.toFixed(1) || '0'} unit="RPM" />
                        </div>
                    ) : (
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                            <MetricDisplay label="Rotação" value={Math.round(turbine.rpm || 0)} unit="RPM" />
                            <MetricDisplay label="Temperatura" value={Math.round(turbine.temp || 0)} unit="°C" />
                            <MetricDisplay label="Pressão" value={Math.round(turbine.pressure || 0)} unit="bar" />
                        </div>
                    )}

                    <div className="mt-4 p-4 bg-gray-900 rounded-lg">
                        <h4 className="text-md font-semibold text-gray-300 mb-2">Especificações Técnicas</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-sm">
                            <div>
                                <span className="text-gray-400">Fabricante: </span>
                                <span className="text-white font-semibold">{turbine.manufacturer}</span>
                            </div>
                            <div>
                                <span className="text-gray-400">Modelo: </span>
                                <span className="text-white font-semibold">{turbine.model}</span>
                            </div>
                             <div>
                                <span className="text-gray-400">Tipo: </span>
                                <span className="text-white font-semibold">{turbine.type}</span>
                            </div>
                             <div>
                                <span className="text-gray-400">Capacidade ISO: </span>
                                <span className="text-white font-semibold">{turbine.isoCapacity} MW</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-grow mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[300px]">
                  {/* Power Contribution Chart */}
                  <div className="flex flex-col h-full min-h-[200px]">
                    <h4 className="text-md font-semibold text-gray-300 text-center mb-2">
                      Contribuição de Potência (Turbinas Ativas)
                    </h4>
                    <div className="flex-grow">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={powerContributionData}
                                margin={{ top: 20, right: 20, left: 20, bottom: 25 }}
                                barCategoryGap="20%"
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#2A3449" />
                                <XAxis type="number" stroke="#9ca3af" fontSize={10} domain={[0, 'dataMax']} unit=" MW" />
                                <YAxis type="category" dataKey="name" hide={true} />
                                <Tooltip 
                                    cursor={{fill: 'rgba(42, 52, 73, 0.5)'}}
                                    wrapperStyle={{ backgroundColor: '#1A2233', border: '1px solid #2A3449', borderRadius: '0.5rem', outline: 'none' }}
                                    contentStyle={{ backgroundColor: '#1A2233', border: 'none' }}
                                    labelStyle={{ color: '#e5e7eb', marginBottom: '0.5rem' }}
                                    formatter={(value: number, name: string) => [
                                        <span className="text-cyan-400">{`${value.toFixed(1)} MW`}</span>,
                                        <span className="text-gray-300">{name}</span>
                                    ]}
                                    labelFormatter={() => `Total: ${totalPowerOutput.toFixed(0)} MW`}
                                />
                                <Legend wrapperStyle={{fontSize: "12px", position: 'absolute', bottom: 0 }} />
                                {activeTurbines.map((turbineObj, index) => {
                                     const isFirst = index === 0;
                                     const isLast = index === activeTurbines.length - 1;
                                     const radius: [number, number, number, number] = activeTurbines.length === 1 ? [8, 8, 8, 8] : isFirst ? [8, 0, 0, 8] : isLast ? [0, 8, 8, 0] : [0, 0, 0, 0];
                                     
                                    return (
                                        <Bar 
                                            key={`bar-${turbineObj.id}`}
                                            dataKey={`Turbina #${turbineObj.id}`}
                                            stackId="a"
                                            name={`Turbina #${turbineObj.id}`}
                                            fill={turbineObj.id === turbine.id ? '#06b6d4' : '#0891b2'}
                                            radius={radius}
                                        />
                                    );
                                })}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                  </div>
                  {/* History Chart */}
                  <div className="flex flex-col h-full min-h-[200px]">
                    <h4 className="text-md font-semibold text-gray-300 text-center mb-2">
                      {historyChartConfig.label}
                    </h4>
                    <div className="flex-grow">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={historyData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorHistory" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#2A3449" />
                          <XAxis 
                            dataKey="time" 
                            stroke="#9ca3af" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false}
                          />
                          <YAxis 
                            stroke="#9ca3af" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false} 
                            domain={historyChartConfig.domain as any}
                            unit={` ${historyChartConfig.unit}`}
                            width={55}
                          />
                          <Tooltip content={<HistoryTooltip dataKey={historyChartConfig.dataKey} unit={historyChartConfig.unit} />} cursor={{fill: 'rgba(42, 52, 73, 0.5)'}}/>
                          <Area 
                            type="monotone" 
                            dataKey={historyChartConfig.dataKey} 
                            stroke="#06b6d4" 
                            strokeWidth={2} 
                            fillOpacity={1} 
                            fill="url(#colorHistory)" 
                            isAnimationActive={false}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </DashboardCard>
        </div>
        <style>{`
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .animate-fadeIn { animation: fadeIn 0.2s ease-in-out; }
        `}</style>
    </div>
  );
};

export default MainTurbineMonitor;