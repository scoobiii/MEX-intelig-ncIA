
import React, { useState, useEffect } from 'react';
import DashboardCard from '../../DashboardCard';
import { BoltIcon, ActivityIcon, SignalIcon } from './icons';

interface IotData {
    voltage: number;
    current: number;
    frequency: number;
    activePower: number;
    thd: number;
    soc: number;
    powerFactor: number;
}

const IoTPlantMonitor: React.FC = () => {
    const [data, setData] = useState<IotData>({
        voltage: 13.8,
        current: 450,
        frequency: 60.00,
        activePower: 6.2,
        thd: 1.5,
        soc: 85,
        powerFactor: 0.98
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setData(prev => ({
                voltage: 13.8 + (Math.random() - 0.5) * 0.1,
                current: 450 + (Math.random() - 0.5) * 10,
                frequency: 60.00 + (Math.random() - 0.5) * 0.05,
                activePower: 6.2 + (Math.random() - 0.5) * 0.2,
                thd: Math.max(0, 1.5 + (Math.random() - 0.5) * 0.2),
                soc: Math.max(0, Math.min(100, prev.soc - 0.05)), // Discharging slowly
                powerFactor: 0.98 + (Math.random() - 0.5) * 0.01
            }));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const MetricBox: React.FC<{ label: string; value: string; unit: string; color: string; icon?: React.ReactNode }> = ({ label, value, unit, color, icon }) => (
        <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-1">
                <span className="text-gray-400 text-xs">{label}</span>
                {icon}
            </div>
            <div className="flex items-baseline gap-1">
                <span className={`text-xl font-bold font-mono ${color}`}>{value}</span>
                <span className="text-gray-500 text-xs">{unit}</span>
            </div>
        </div>
    );

    return (
        <DashboardCard title="Monitoramento IoT (Tempo Real)" icon={<SignalIcon className="w-6 h-6 text-green-400" />}>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                <MetricBox 
                    label="Tensão (Média)" 
                    value={data.voltage.toFixed(2)} 
                    unit="kV" 
                    color="text-white" 
                    icon={<BoltIcon className="w-4 h-4 text-yellow-400"/>}
                />
                <MetricBox 
                    label="Corrente" 
                    value={data.current.toFixed(0)} 
                    unit="A" 
                    color="text-white" 
                    icon={<ActivityIcon className="w-4 h-4 text-cyan-400"/>}
                />
                <MetricBox 
                    label="Frequência" 
                    value={data.frequency.toFixed(3)} 
                    unit="Hz" 
                    color={Math.abs(data.frequency - 60) > 0.1 ? "text-red-400" : "text-green-400"}
                />
                <MetricBox 
                    label="Potência Ativa" 
                    value={data.activePower.toFixed(2)} 
                    unit="MW" 
                    color="text-cyan-400"
                />
                <MetricBox 
                    label="THD (Qualidade)" 
                    value={data.thd.toFixed(2)} 
                    unit="%" 
                    color={data.thd > 5 ? "text-red-400" : "text-green-400"}
                />
                <MetricBox 
                    label="Fator de Potência" 
                    value={data.powerFactor.toFixed(2)} 
                    unit="" 
                    color="text-purple-400"
                />
                <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                    <span className="text-gray-400 text-xs block mb-1">BESS SoC</span>
                    <div className="flex items-center gap-2">
                        <div className="flex-grow bg-gray-700 h-2 rounded-full overflow-hidden">
                            <div className="bg-green-500 h-full" style={{width: `${data.soc}%`}}></div>
                        </div>
                        <span className="text-sm font-bold text-white">{data.soc.toFixed(0)}%</span>
                    </div>
                </div>
            </div>
        </DashboardCard>
    );
};

export default IoTPlantMonitor;
