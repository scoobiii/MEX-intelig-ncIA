import React, { useState, useEffect } from 'react';
import DashboardCard from '../../DashboardCard';
import { Rack } from './ServerRackStatus';
import { FlameIcon, BoltIcon } from './icons';

const generateInitialRackData = (): Rack[] => {
  return Array.from({ length: 120 }, (_, i) => {
    const statusRoll = Math.random();
    let status: 'online' | 'high-load' | 'offline' = 'online';
    if (statusRoll > 0.95) {
      status = 'offline';
    } else if (statusRoll > 0.85) {
      status = 'high-load';
    }

    return {
      id: i + 1,
      cpuLoad: status === 'offline' ? 0 : Math.round(10 + Math.random() * (status === 'high-load' ? 80 : 50)),
      gpuLoad: status === 'offline' ? 0 : Math.round(5 + Math.random() * (status === 'high-load' ? 85 : 45)),
      memUsage: status === 'offline' ? 0 : Math.round(20 + Math.random() * 60),
      temp: status === 'offline' ? 18 : Math.round(22 + Math.random() * (status === 'high-load' ? 18 : 8)),
      status,
      networkIO: {
        ingress: status === 'offline' ? 0 : parseFloat((Math.random() * 5).toFixed(2)),
        egress: status === 'offline' ? 0 : parseFloat((Math.random() * 3).toFixed(2)),
      },
      tempHistory: Array.from({ length: 15 }, (_, j) => ({
        time: `${14-j}s`,
        temp: status === 'offline' ? 18 : Math.round(22 + Math.random() * (status === 'high-load' ? 18 : 8) - (Math.random() * 3)),
      })),
    };
  });
};


interface DataCenterHeatmapProps {
  onRackClick: (rack: Rack) => void;
  isMaximizable?: boolean;
  isMaximized?: boolean;
  onToggleMaximize?: () => void;
}

const HeatmapLegend: React.FC<{ metric: 'temp' | 'cpu' }> = ({ metric }) => {
    const labels = metric === 'temp' 
        ? { low: '< 30°C', mid: '30-40°C', high: '> 40°C' }
        : { low: '< 50%', mid: '50-85%', high: '> 85%' };
    
    return (
        <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
            <span>Baixo</span>
            <div className="flex">
                <div className="w-8 h-4 bg-green-500 rounded-l-sm" title={labels.low}></div>
                <div className="w-8 h-4 bg-yellow-500" title={labels.mid}></div>
                <div className="w-8 h-4 bg-red-500 rounded-r-sm" title={labels.high}></div>
            </div>
            <span>Alto</span>
        </div>
    );
};

const DataCenterHeatmap: React.FC<DataCenterHeatmapProps> = ({ onRackClick, isMaximizable, isMaximized, onToggleMaximize }) => {
    const [racks, setRacks] = useState<Rack[]>([]);
    const [viewMetric, setViewMetric] = useState<'temp' | 'cpu'>('temp');
    const [hoveredRack, setHoveredRack] = useState<Rack | null>(null);

    useEffect(() => {
        setRacks(generateInitialRackData());

        const interval = setInterval(() => {
            setRacks(prevRacks =>
                prevRacks.map(rack => {
                    if (rack.status === 'offline') return rack;
                    
                    const newCpuLoad = Math.max(10, Math.min(99, rack.cpuLoad + (Math.random() - 0.5) * 10));
                    const newGpuLoad = Math.max(5, Math.min(99, rack.gpuLoad + (Math.random() - 0.5) * 15));
                    const newMemUsage = Math.max(20, Math.min(95, rack.memUsage + (Math.random() - 0.5) * 5));
                    const newTemp = Math.max(22, Math.min(45, rack.temp + (Math.random() - 0.45) * 2));
                    
                    let newStatus = rack.status;
                    if (newCpuLoad > 85 || newGpuLoad > 90 || newTemp > 40) {
                        newStatus = 'high-load';
                    } else if (rack.status === 'high-load' && newCpuLoad < 70 && newGpuLoad < 75 && newTemp < 35) {
                        newStatus = 'online';
                    }
        
                    return { 
                        ...rack, 
                        cpuLoad: Math.round(newCpuLoad), 
                        gpuLoad: Math.round(newGpuLoad),
                        memUsage: Math.round(newMemUsage),
                        temp: Math.round(newTemp),
                        status: newStatus,
                    };
                })
            );
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const getColor = (rack: Rack) => {
        if (rack.status === 'offline') return 'bg-gray-600';

        const value = viewMetric === 'temp' ? rack.temp : rack.cpuLoad;
        const thresholds = viewMetric === 'temp' 
            ? { high: 40, mid: 30 } 
            : { high: 85, mid: 50 };
        
        if (value > thresholds.high) return 'bg-red-500';
        if (value > thresholds.mid) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const actionControls = (
         <div className="flex items-center bg-gray-900/50 rounded-lg p-1">
            <button
                onClick={() => setViewMetric('temp')}
                className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 ${viewMetric === 'temp' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
            >
                <FlameIcon className="w-4 h-4"/> Temperatura
            </button>
            <button
                onClick={() => setViewMetric('cpu')}
                className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 ${viewMetric === 'cpu' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
            >
                <BoltIcon className="w-4 h-4"/> Carga da CPU
            </button>
        </div>
    );

    return (
        <DashboardCard 
            title="Heatmap do Data Center" 
            icon={<FlameIcon className="w-6 h-6"/>}
            action={actionControls}
            isMaximizable={isMaximizable}
            isMaximized={isMaximized}
            onToggleMaximize={onToggleMaximize}
        >
            <div className="flex flex-col h-full">
                <div className="grid grid-cols-12 gap-1.5 p-2 bg-gray-900 rounded-md relative">
                    {racks.map(rack => (
                        <button
                            key={rack.id}
                            className={`w-full aspect-square rounded-sm transition-transform hover:scale-125 hover:z-10 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${getColor(rack)}`}
                            onClick={() => onRackClick(rack)}
                            onMouseEnter={() => setHoveredRack(rack)}
                            onMouseLeave={() => setHoveredRack(null)}
                            aria-label={`Rack ${rack.id}`}
                        />
                    ))}
                     {hoveredRack && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-800 border border-gray-600 rounded-lg p-3 text-xs shadow-2xl z-20 pointer-events-none w-48">
                            <h4 className="font-bold text-white mb-1">Rack {hoveredRack.id}</h4>
                            <p>Status: <span className="font-semibold">{hoveredRack.status}</span></p>
                            <p>CPU: <span className="font-semibold">{hoveredRack.cpuLoad}%</span></p>
                            <p>GPU: <span className="font-semibold">{hoveredRack.gpuLoad}%</span></p>
                            <p>Temp: <span className="font-semibold">{hoveredRack.temp}°C</span></p>
                        </div>
                    )}
                </div>
                <div className="mt-4">
                    <HeatmapLegend metric={viewMetric} />
                </div>
            </div>
        </DashboardCard>
    );
};

export default DataCenterHeatmap;