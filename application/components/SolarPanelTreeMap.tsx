import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, Treemap, Tooltip } from 'recharts';
import DashboardCard from '../../DashboardCard';
import { ChartBarIcon } from './icons';

type PanelStatus = 'Ótimo' | 'Degradado' | 'Offline';

interface TreeMapNode {
  name: string;
  status: PanelStatus;
  powerOutput: number; // in kW
  temperature: number; // °C
  voltage: number; // V
  current: number; // A
  efficiency: number; // %
  irradiance: number; // W/m²
}

const generateSolarPanelData = (): TreeMapNode[] => {
  return Array.from({ length: 200 }, (_, i) => {
    const statusRoll = Math.random();
    let status: PanelStatus = 'Ótimo';
    let efficiencyMultiplier = 1.0;
    if (statusRoll > 0.97) {
      status = 'Offline';
      efficiencyMultiplier = 0;
    } else if (statusRoll > 0.90) {
      status = 'Degradado';
      efficiencyMultiplier = 0.6 + Math.random() * 0.2; // 60-80% of optimal
    }

    const baseIrradiance = 800 + Math.random() * 200; // W/m²
    const baseEfficiency = 22.5; // %
    const panelArea = 1.8; // m²

    const powerOutput = (baseIrradiance * (baseEfficiency / 100) * panelArea * efficiencyMultiplier) / 1000; // in kW
    const temperature = 25 + (baseIrradiance / 50) + (status === 'Degradado' ? 10 : 0) + (status === 'Offline' ? -10 : 0);
    const voltage = status === 'Offline' ? 0 : 40 + Math.random() * 5;
    const current = status === 'Offline' ? 0 : (powerOutput * 1000) / voltage;
    
    return {
      name: `String-${i + 1}`,
      status: status,
      powerOutput: parseFloat(powerOutput.toFixed(2)),
      temperature: parseFloat(temperature.toFixed(1)),
      voltage: parseFloat(voltage.toFixed(1)),
      current: parseFloat(current.toFixed(2)),
      efficiency: parseFloat((baseEfficiency * efficiencyMultiplier).toFixed(1)),
      irradiance: parseFloat(baseIrradiance.toFixed(0)),
    };
  });
};

const CustomTooltipContent = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data: TreeMapNode = payload[0].payload;
    const statusColors = {
        'Ótimo': 'bg-green-500/30 text-green-300',
        'Degradado': 'bg-yellow-500/30 text-yellow-300',
        'Offline': 'bg-red-500/30 text-red-300'
    };
    return (
      <div className="bg-gray-800 p-3 border border-gray-600 rounded-lg shadow-xl text-sm w-64">
        <div className="flex justify-between items-baseline mb-2">
            <p className="font-bold text-white">{data.name}</p>
            <span className={`px-2 py-0.5 text-xs rounded-full ${statusColors[data.status]}`}>
                {data.status}
            </span>
        </div>

        <div className="border-t border-gray-700 pt-2 mt-2 space-y-1">
            <div className="flex justify-between"><p className="text-gray-400">Produção:</p><p className="text-gray-200 font-mono">{data.powerOutput} kW</p></div>
            <div className="flex justify-between"><p className="text-gray-400">Eficiência:</p><p className="text-gray-200 font-mono">{data.efficiency}%</p></div>
            <div className="flex justify-between"><p className="text-gray-400">Temperatura:</p><p className="text-gray-200 font-mono">{data.temperature} °C</p></div>
            <div className="flex justify-between"><p className="text-gray-400">Tensão:</p><p className="text-gray-200 font-mono">{data.voltage} V</p></div>
            <div className="flex justify-between"><p className="text-gray-400">Corrente:</p><p className="text-gray-200 font-mono">{data.current} A</p></div>
            <div className="flex justify-between"><p className="text-gray-400">Irradiância:</p><p className="text-gray-200 font-mono">{data.irradiance} W/m²</p></div>
        </div>
      </div>
    );
  }
  return null;
};

const CustomizedContent = (props: any) => {
    const { x, y, width, height, name, status } = props;
    
    if (!status) return null;

    const colorMapping = {
        'Ótimo': '#22c55e', // green-500
        'Degradado': '#f59e0b', // amber-500
        'Offline': '#ef4444' // red-500
    };

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: colorMapping[status],
                    stroke: '#1f2937',
                    strokeWidth: 2,
                }}
            />
            {width > 80 && height > 30 && (
                <text x={x + width / 2} y={y + height / 2} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize={12} style={{ textShadow: '0 0 2px rgba(0,0,0,0.7)' }}>
                    {name}
                </text>
            )}
        </g>
    );
};

const SolarPanelTreeMap: React.FC = () => {
    const [data, setData] = useState<TreeMapNode[]>([]);
    
    useEffect(() => {
        setData(generateSolarPanelData());
    }, []);

    const totalProduction = data.reduce((sum, item) => sum + item.powerOutput, 0);
    const statusCounts = data.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
    }, {} as Record<PanelStatus, number>);

    return (
        <DashboardCard 
            title="Status dos Painéis Solares (Treemap)"
            icon={<ChartBarIcon className="w-6 h-6" />}
        >
            <div className="w-full h-full min-h-[500px] flex flex-col">
                 <div className="flex justify-around items-center text-center mb-4 p-2 bg-gray-900/50 rounded-lg">
                    <div>
                        <p className="text-sm text-gray-400">Produção Total</p>
                        <p className="text-2xl font-bold text-cyan-400">{(totalProduction / 1000).toFixed(2)} MW</p>
                    </div>
                     <div className="h-12 w-px bg-gray-700"></div>
                     <div>
                        <p className="text-sm text-green-400">Ótimo</p>
                        <p className="text-2xl font-bold text-white">{statusCounts['Ótimo'] || 0}</p>
                    </div>
                     <div>
                        <p className="text-sm text-yellow-400">Degradado</p>
                        <p className="text-2xl font-bold text-white">{statusCounts['Degradado'] || 0}</p>
                    </div>
                     <div>
                        <p className="text-sm text-red-400">Offline</p>
                        <p className="text-2xl font-bold text-white">{statusCounts['Offline'] || 0}</p>
                    </div>
                 </div>
                <div className="flex-grow">
                    <ResponsiveContainer width="100%" height="100%">
                        <Treemap
                            data={data}
                            dataKey="powerOutput"
                            stroke="#fff"
                            fill="#8884d8"
                            content={<CustomizedContent />}
                            isAnimationActive={false}
                            aspectRatio={16/9}
                        >
                            <Tooltip content={<CustomTooltipContent />} />
                        </Treemap>
                    </ResponsiveContainer>
                </div>
            </div>
        </DashboardCard>
    );
};

export default SolarPanelTreeMap;