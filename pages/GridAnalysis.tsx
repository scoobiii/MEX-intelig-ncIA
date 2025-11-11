import React, { useState, useEffect, useMemo } from 'react';
import DashboardCard from '../DashboardCard';
import { 
    ChartBarIcon, 
    MagnifyingGlassIcon, 
    ShieldCheckIcon, 
    SignalIcon, 
    WarningIcon, 
    InfoIcon, 
    CheckCircleIcon,
    XCircleIcon,
    BoltIcon
} from '../application/components/icons';

// ============================================================================
// PARTE 1: LÓGICA DE ANÁLISE DE PERDAS (Tradução do Python para TS)
// ============================================================================

const sinGraph = {
  nodes: [
    { id: 0, name: 'Belo Monte' }, { id: 1, name: 'Itaipu' },
    { id: 2, name: 'SE-CO Hub' }, { id: 3, name: 'NE Hub' },
    { id: 4, name: 'N Hub' }, { id: 5, name: 'S Hub' },
  ],
  edges: [
    { source: 0, target: 4, tensao_kv: 765, comprimento_km: 2500, capacidade_mva: 4000 },
    { source: 4, target: 2, tensao_kv: 500, comprimento_km: 1500, capacidade_mva: 3000 },
    { source: 3, target: 2, tensao_kv: 500, comprimento_km: 1200, capacidade_mva: 2500 },
    { source: 1, target: 5, tensao_kv: 765, comprimento_km: 900, capacidade_mva: 6000 },
    { source: 5, target: 2, tensao_kv: 500, comprimento_km: 700, capacidade_mva: 4000 },
  ],
};

const TYPICAL_RESISTANCE = {
    '765kV': 0.015, '500kV': 0.020, '345kV': 0.025, '230kV': 0.035,
    '138kV': 0.045, '69kV': 0.060, '13.8kV': 0.350, '0.38kV': 1.200,
};

const analyzeEdgeLosses = (edge: typeof sinGraph.edges[0]) => {
    const { tensao_kv, comprimento_km, capacidade_mva } = edge;
    const current_ampere = (capacidade_mva * 1000) / (Math.sqrt(3) * tensao_kv);
    
    const voltage_key = `${tensao_kv}kV`;
    const resistance_ohm_per_km = TYPICAL_RESISTANCE[voltage_key as keyof typeof TYPICAL_RESISTANCE] || 0.035;

    const temp_factor = 1 + 0.004 * (30.0 - 20); // Temp 30°C
    const adjusted_resistance = resistance_ohm_per_km * comprimento_km * temp_factor;
    
    const losses_watts = 3 * (current_ampere ** 2) * adjusted_resistance;
    const losses_kw = losses_watts / 1000;

    const transmitted_power_kw = capacidade_mva * 1000 * 0.95;
    const loss_percent = (losses_kw / transmitted_power_kw * 100);

    return {
        losses_kw,
        loss_percent,
        voltage_kv: tensao_kv,
        length_km: comprimento_km,
        resistance_ohm: resistance_ohm_per_km * comprimento_km,
    };
};

// ============================================================================
// PARTE 2: LÓGICA DE MONITORAMENTO IoT (Tradução do Python para TS)
// ============================================================================
interface IoTTelemetry {
    timestamp: Date; device_id: string; device_type: string;
    active_power_kw: number; frequency_hz: number; thd_percent: number;
    power_factor: number; temperature_celsius: number; status: string;
}
interface AnomalyAlert { severity: 'CRITICAL' | 'WARNING' | 'INFO'; message: string; action: string; }

const sampleTelemetry: IoTTelemetry[] = [
    { timestamp: new Date(), device_id: 'GEN_SOLAR_001', device_type: 'Gerador', active_power_kw: 3600, frequency_hz: 60.02, thd_percent: 2.1, power_factor: 0.99, temperature_celsius: 42.0, status: 'online' },
    { timestamp: new Date(), device_id: 'LT_500KV_042', device_type: 'Linha', active_power_kw: 2100000, frequency_hz: 59.98, thd_percent: 1.8, power_factor: 0.97, temperature_celsius: 35.0, status: 'online' },
    { timestamp: new Date(), device_id: 'BESS_001', device_type: 'Bateria', active_power_kw: -1500, frequency_hz: 60.01, thd_percent: 1.0, power_factor: 1.0, temperature_celsius: 28.0, status: 'carregando' },
    { timestamp: new Date(), device_id: 'SE_FURNAS_001', device_type: 'Subestação', active_power_kw: 180000, frequency_hz: 60.35, thd_percent: 6.2, power_factor: 0.99, temperature_celsius: 48.0, status: 'online' },
];

const processTelemetry = (telemetry: IoTTelemetry): AnomalyAlert[] => {
    const alerts: AnomalyAlert[] = [];
    if (telemetry.frequency_hz > 60.2 || telemetry.frequency_hz < 59.8) {
        alerts.push({ severity: 'WARNING', message: `Frequência fora do aceitável: ${telemetry.frequency_hz.toFixed(2)} Hz`, action: 'Monitorar e preparar controle' });
    }
    if (telemetry.thd_percent > 5) {
        alerts.push({ severity: 'WARNING', message: `Distorção Harmônica (THD) alta: ${telemetry.thd_percent.toFixed(1)}%`, action: 'Considerar filtros harmônicos' });
    }
    if (telemetry.temperature_celsius > 45) {
        alerts.push({ severity: 'CRITICAL', message: `Temperatura elevada: ${telemetry.temperature_celsius.toFixed(1)}°C`, action: 'Investigar sistema de refrigeração' });
    }
    return alerts;
};

// ============================================================================
// COMPONENTE REACT
// ============================================================================

const GridAnalysis: React.FC = () => {
    const [criticalLines, setCriticalLines] = useState<any[]>([]);
    const [telemetryIndex, setTelemetryIndex] = useState(0);
    const [alerts, setAlerts] = useState<AnomalyAlert[]>([]);

    useEffect(() => {
        // Calcular perdas
        const lossData = sinGraph.edges.map(edge => {
            const losses = analyzeEdgeLosses(edge);
            const sourceNode = sinGraph.nodes.find(n => n.id === edge.source);
            const targetNode = sinGraph.nodes.find(n => n.id === edge.target);
            return {
                origem: sourceNode?.name || `Nó_${edge.source}`,
                destino: targetNode?.name || `Nó_${edge.target}`,
                ...losses
            };
        });
        const rankedLosses = lossData.sort((a, b) => b.losses_kw - a.losses_kw).slice(0, 5);
        setCriticalLines(rankedLosses);

        // Simular fluxo de telemetria
        const interval = setInterval(() => {
            setTelemetryIndex(prevIndex => {
                const newIndex = (prevIndex + 1) % sampleTelemetry.length;
                const newAlerts = processTelemetry(sampleTelemetry[newIndex]);
                setAlerts(newAlerts);
                return newIndex;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, []);
    
    const currentTelemetry = sampleTelemetry[telemetryIndex];

    const alertConfig = {
        CRITICAL: { icon: <WarningIcon className="w-5 h-5 text-red-400" />, color: 'border-red-400 bg-red-900/20' },
        WARNING: { icon: <WarningIcon className="w-5 h-5 text-yellow-400" />, color: 'border-yellow-400 bg-yellow-900/20' },
        INFO: { icon: <InfoIcon className="w-5 h-5 text-blue-400" />, color: 'border-blue-400 bg-blue-900/20' }
    };

    return (
        <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DashboardCard title="Análise Comparativa: Brasil vs. China" icon={<ChartBarIcon className="w-6 h-6" />}>
                    <div className="space-y-4">
                        <div className="bg-gray-800 p-4 rounded-lg">
                            <h4 className="font-semibold text-white">Brasil (ANEEL 2023)</h4>
                            <p className="text-sm text-gray-400 flex items-center gap-2"><XCircleIcon className="w-5 h-5 text-red-400"/>Perdas Totais: <strong className="text-red-400">14.1%</strong> (80.2 TWh)</p>
                            <ul className="list-disc list-inside text-sm pl-4 text-gray-300">
                                <li>Técnicas: 7.4% (42.0 TWh)</li>
                                <li>Não-Técnicas: 6.7% (38.2 TWh)</li>
                            </ul>
                        </div>
                         <div className="bg-gray-800 p-4 rounded-lg">
                            <h4 className="font-semibold text-white">China (Padrão Internacional)</h4>
                            <p className="text-sm text-gray-400 flex items-center gap-2"><CheckCircleIcon className="w-5 h-5 text-green-400"/>Perdas Totais: <strong className="text-green-400">~6%</strong></p>
                             <ul className="list-disc list-inside text-sm pl-4 text-gray-300">
                                <li>Técnicas: ~4%</li>
                                <li>Não-Técnicas: ~2%</li>
                            </ul>
                        </div>
                    </div>
                </DashboardCard>
                <DashboardCard title="Causas das Perdas Técnicas no Brasil" icon={<MagnifyingGlassIcon className="w-6 h-6" />}>
                     <ul className="space-y-2 text-gray-300">
                        <li className="flex items-start gap-2"><BoltIcon className="w-4 h-4 mt-1 text-cyan-400 flex-shrink-0" /> <span><strong>Longas Distâncias:</strong> Geração (hidrelétricas) longe dos centros de consumo.</span></li>
                        <li className="flex items-start gap-2"><BoltIcon className="w-4 h-4 mt-1 text-cyan-400 flex-shrink-0" /> <span><strong>Equipamentos Antigos:</strong> Transformadores e condutores com eficiência reduzida.</span></li>
                        <li className="flex items-start gap-2"><BoltIcon className="w-4 h-4 mt-1 text-cyan-400 flex-shrink-0" /> <span><strong>Clima Tropical:</strong> Altas temperaturas aumentam a resistência dos condutores (Perdas Joule).</span></li>
                        <li className="flex items-start gap-2"><BoltIcon className="w-4 h-4 mt-1 text-cyan-400 flex-shrink-0" /> <span><strong>Redes de Distribuição:</strong> 50-70% das perdas ocorrem nas redes de baixa/média tensão.</span></li>
                    </ul>
                </DashboardCard>
            </div>

            <DashboardCard title="Análise de Perdas Técnicas (Simulação)" icon={<ChartBarIcon className="w-6 h-6" />}>
                <p className="text-sm text-gray-400 mb-4">Ranking de linhas críticas com maiores perdas estimadas com base em um modelo simplificado do SIN.</p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                            <tr>
                                <th className="px-4 py-2">Origem ➔ Destino</th>
                                <th className="px-4 py-2 text-center">Tensão (kV)</th>
                                <th className="px-4 py-2 text-center">Compr. (km)</th>
                                <th className="px-4 py-2 text-right">Perdas (kW)</th>
                                <th className="px-4 py-2 text-right">Perdas (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {criticalLines.map((line, index) => (
                                <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/30">
                                    <td className="px-4 py-2 font-medium">{line.origem} ➔ {line.destino}</td>
                                    <td className="px-4 py-2 text-center">{line.voltage_kv}</td>
                                    <td className="px-4 py-2 text-center">{line.length_km.toLocaleString('pt-BR')}</td>
                                    <td className="px-4 py-2 text-right font-mono text-red-400">{line.losses_kw.toFixed(1)}</td>
                                    <td className="px-4 py-2 text-right font-mono text-yellow-400">{line.loss_percent.toFixed(2)}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </DashboardCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <DashboardCard title="Soluções para Mitigação de Perdas" icon={<ShieldCheckIcon className="w-6 h-6" />}>
                     <ul className="space-y-2 text-gray-300">
                        <li className="flex items-start gap-2"><CheckCircleIcon className="w-4 h-4 mt-1 text-green-400 flex-shrink-0" /> <span><strong>Medidores Inteligentes:</strong> Detecção de fraudes e monitoramento de qualidade com Machine Learning.</span></li>
                        <li className="flex items-start gap-2"><CheckCircleIcon className="w-4 h-4 mt-1 text-green-400 flex-shrink-0" /> <span><strong>Recabeamento:</strong> Uso de condutores modernos com menor resistência (redução de até 32%).</span></li>
                        <li className="flex items-start gap-2"><CheckCircleIcon className="w-4 h-4 mt-1 text-green-400 flex-shrink-0" /> <span><strong>Geração Distribuída:</strong> Aproximar a geração do consumo para reduzir perdas na transmissão.</span></li>
                        <li className="flex items-start gap-2"><CheckCircleIcon className="w-4 h-4 mt-1 text-green-400 flex-shrink-0" /> <span><strong>Aumento de Tensão:</strong> Operar em níveis de tensão mais altos para reduzir a corrente (e perdas I²R).</span></li>
                    </ul>
                </DashboardCard>
                <DashboardCard title="Monitoramento IoT em Tempo Real" icon={<SignalIcon className="w-6 h-6" />}>
                    <div className="space-y-4">
                        <div key={currentTelemetry.device_id} className="bg-gray-800 p-4 rounded-lg animate-pulse">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-white">{currentTelemetry.device_id}</h4>
                                    <p className="text-sm text-cyan-400">{currentTelemetry.device_type}</p>
                                </div>
                                <span className="text-xs font-mono text-gray-500">{currentTelemetry.timestamp.toLocaleTimeString()}</span>
                            </div>
                             <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
                                <p><strong>Freq:</strong> {currentTelemetry.frequency_hz.toFixed(2)} Hz</p>
                                <p><strong>Temp:</strong> {currentTelemetry.temperature_celsius.toFixed(1)}°C</p>
                                <p><strong>THD:</strong> {currentTelemetry.thd_percent.toFixed(1)}%</p>
                                <p><strong>FP:</strong> {currentTelemetry.power_factor.toFixed(2)}</p>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-2">Alertas Gerados</h4>
                            <div className="space-y-2 min-h-[100px]">
                                {alerts.length > 0 ? alerts.map((alert, index) => (
                                    <div key={index} className={`p-2 rounded-lg border-l-4 text-xs ${alertConfig[alert.severity].color}`}>
                                        <div className="flex items-start gap-2">
                                            {alertConfig[alert.severity].icon}
                                            <div>
                                                <p className="font-semibold text-gray-200">{alert.message}</p>
                                                <p className="text-gray-400">Ação: {alert.action}</p>
                                            </div>
                                        </div>
                                    </div>
                                )) : <p className="text-center text-gray-500 pt-8">Nenhum alerta no momento.</p>}
                            </div>
                        </div>
                    </div>
                </DashboardCard>
            </div>
        </div>
    );
};

export default GridAnalysis;