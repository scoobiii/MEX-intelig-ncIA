/**
 * @file DataCenterTreeMap.tsx
 * @description Renders a treemap visualization of the data center server racks, showing their status and key metrics.
 * @version 1.0.1
 * @date 2024-07-26
 * @author Senior DevOps Team
 * @productowner Edivaldo Beringela (Prefeitura de Mauá)
 * 
 * @responsibility
 * Visualizes hierarchical rack data using area-proportional treemap.
 * Integrates with DashboardCard for consistent UI and maximize behavior.
 * 
 * @changelog
 * v1.0.1 - 2024-07-26
 *   - Fixed a runtime TypeError "Cannot read properties of undefined (reading 'status')" in the CustomizedContent component.
 *   - Added a defensive check to ensure the 'payload' prop and its 'status' property exist before being accessed.
 * 
 * @signature
 * GOS7 (Gang of Seven Senior Full Stack DevOps Agile Scrum Team)
 * - Claude, Grok, Gemini, Qwen, DeepSeek, GPT, Manus
 */
import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, Treemap, Tooltip } from 'recharts';
import DashboardCard from '../DashboardCard';
import { ServerRackIcon } from './components/icons';

type RackStatus = 'Online' | 'High Load' | 'Offline';

interface TreeMapNode {
  name: string;
  status: RackStatus;
  power: number; // Nominal capacity in kW
  memory: number; // GB
  networkIO: number; // Gbps
  temp: number; // °C
  cpuCores: number;
  utilization: number; // Percentage
  energyConsumption: number; // kWh
  children?: TreeMapNode[];
  [key: string]: any;
}

interface DataCenterTreeMapProps {
    isMaximizable?: boolean;
    isMaximized?: boolean;
    onToggleMaximize?: () => void;
}

const generateInitialRackData = (): TreeMapNode[] => {
  return Array.from({ length: 120 }, (_, i) => {
    const statusRoll = Math.random();
    let status: RackStatus = 'Online';
    if (statusRoll > 0.95) {
      status = 'Offline';
    } else if (statusRoll > 0.85) {
      status = 'High Load';
    }

    const power = 500; // 500 kW capacity per rack
    const energyConsumption = status === 'Offline' ? 0 : Math.round(150 + Math.random() * (status === 'High Load' ? 350 : 150));
    
    return {
      name: `Rack-${i + 1}`,
      status: status,
      power: power,
      memory: status === 'Offline' ? 0 : Math.round(512 + Math.random() * 1536), // 0.5-2TB RAM
      networkIO: status === 'Offline' ? 0 : parseFloat((50 + Math.random() * 350).toFixed(1)), // 50-400 Gbps
      temp: status === 'Offline' ? 18 : Math.round(22 + Math.random() * 10), // 22-32°C
      cpuCores: 128,
      utilization: Math.round((energyConsumption / power) * 100),
      energyConsumption,
    };
  });
};

const CustomTooltipContent = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data: TreeMapNode = payload[0].payload;
    return (
      <div className="bg-gray-800 p-3 border border-gray-600 rounded-lg shadow-xl text-sm w-56">
        <div className="flex justify-between items-baseline mb-2">
            <p className="font-bold text-white">{data.name}</p>
            <span className={`px-2 py-0.5 text-xs rounded-full ${
                data.status === 'Online' ? 'bg-green-500/30 text-green-300' : 
                data.status === 'High Load' ? 'bg-yellow-500/30 text-yellow-300' : 'bg-red-500/30 text-red-300'}`
            }>
                {data.status}
            </span>
        </div>

        <div className="border-t border-gray-700 pt-2 mt-2 space-y-1">
            <div className="flex justify-between">
                <p className="text-gray-400">Consumo de Energia:</p><p className="text-gray-200 font-mono">{data.energyConsumption} kWh</p>
            </div>
            <div className="flex justify-between">
                <p className="text-gray-400">Utilização:</p><p className="text-gray-200 font-mono">{data.utilization}%</p>
            </div>
            <div className="flex justify-between">
                <p className="text-gray-400">Temp:</p><p className="text-gray-200 font-mono">{data.temp} °C</p>
            </div>
        </div>
      </div>
    );
  }
  return null;
};

const CustomizedContent = (props: any) => {
    const { x, y, width, height, name, status } = props;
    
    // Defensive check
    if (!status) {
        return null;
    }

    let color = '#3b82f6'; // blue-500 for Online
    if (status === 'High Load') color = '#f59e0b'; // amber-500
    if (status === 'Offline') color = '#ef4444'; // red-500

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: color,
                    stroke: '#1f2937',
                    strokeWidth: 2,
                }}
            />
            {width > 80 && height > 30 && (
                <text x={x + width / 2} y={y + height / 2} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize={14} style={{ textShadow: '0 0 2px rgba(0,0,0,0.7)' }}>
                    {name}
                </text>
            )}
        </g>
    );
};


const DataCenterTreeMap: React.FC<DataCenterTreeMapProps> = ({
    isMaximizable,
    isMaximized,
    onToggleMaximize,
}) => {
    const [data, setData] = useState<TreeMapNode[]>([]);
    
    useEffect(() => {
        setData(generateInitialRackData());
    }, []);

    return (
        <DashboardCard 
            title="Treemap de Racks do Data Center"
            icon={<ServerRackIcon className="w-6 h-6" />}
            isMaximizable={isMaximizable}
            isMaximized={isMaximized}
            onToggleMaximize={onToggleMaximize}
        >
            <div className="w-full h-full min-h-[500px] flex flex-col">
                 <p className="text-center text-sm text-gray-400 mb-2">Visualizando por: <span className="font-semibold text-white">Consumo de Energia</span></p>
                <div className="flex-grow">
                    <ResponsiveContainer width="100%" height="100%">
                        <Treemap
                            data={data}
                            dataKey="energyConsumption"
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

export default DataCenterTreeMap;