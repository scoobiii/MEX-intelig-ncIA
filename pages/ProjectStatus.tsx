import React from 'react';
import DashboardCard from '../DashboardCard';
import { ChartBarIcon, TrendingUpIcon } from '../application/components/icons';

const ProgressBar: React.FC<{ value: number; colorClass: string }> = ({ value, colorClass }) => (
    <div className="w-full bg-gray-700 rounded-full h-6">
        <div 
            className={`${colorClass} h-6 rounded-full text-center text-white text-sm font-semibold flex items-center justify-center`}
            style={{ width: `${value}%` }}
        >
            {value.toFixed(1)}%
        </div>
    </div>
);

const ProjectStatus: React.FC = () => {
    const currentSprint = {
        name: 'Sprint 2 - Dashboard Operacional',
        status: 'Em Desenvolvimento Ativo',
        locPlanned: 15000,
        locDelivered: 12500,
    };
    
    const nextSprint = {
        name: 'Sprint 3 - Análise Nuclear e Integração IA',
        status: 'Planejado',
        locPlanned: 8000,
        locDelivered: 0,
    };

    const calculateMetrics = (sprint: { locPlanned: number; locDelivered: number; }) => {
        const remaining = sprint.locPlanned - sprint.locDelivered;
        const progress = sprint.locPlanned > 0 ? (sprint.locDelivered / sprint.locPlanned) * 100 : 0;
        return { remaining, progress };
    };

    const currentMetrics = calculateMetrics(currentSprint);
    const nextMetrics = calculateMetrics(nextSprint);

    return (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <DashboardCard title="Estágio Atual" icon={<ChartBarIcon className="w-6 h-6" />}>
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-cyan-400">{currentSprint.name}</h3>
                    <p><strong>Status:</strong> <span className="text-green-400">{currentSprint.status}</span></p>
                    <div className="space-y-2">
                        <div className="flex justify-between items-baseline">
                            <span>Progresso (LOC):</span>
                            <span className="font-mono text-lg">{currentMetrics.progress.toFixed(1)}%</span>
                        </div>
                        <ProgressBar value={currentMetrics.progress} colorClass="bg-cyan-500" />
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center border-t border-gray-700 pt-4">
                        <div>
                            <p className="text-sm text-gray-400">LOC Planejado</p>
                            <p className="font-mono text-xl font-semibold">{currentSprint.locPlanned.toLocaleString('pt-BR')}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">LOC Entregue</p>
                            <p className="font-mono text-xl font-semibold text-green-400">{currentSprint.locDelivered.toLocaleString('pt-BR')}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">LOC Faltante</p>
                            <p className="font-mono text-xl font-semibold text-yellow-400">{currentMetrics.remaining.toLocaleString('pt-BR')}</p>
                        </div>
                    </div>
                </div>
            </DashboardCard>
            
            <DashboardCard title="Próximo Estágio" icon={<TrendingUpIcon className="w-6 h-6" />}>
                 <div className="space-y-4">
                    <h3 className="text-xl font-bold text-cyan-400">{nextSprint.name}</h3>
                    <p><strong>Status:</strong> <span className="text-yellow-400">{nextSprint.status}</span></p>
                    <div className="space-y-2">
                        <div className="flex justify-between items-baseline">
                            <span>Progresso (LOC):</span>
                            <span className="font-mono text-lg">{nextMetrics.progress.toFixed(1)}%</span>
                        </div>
                        <ProgressBar value={nextMetrics.progress} colorClass="bg-gray-600" />
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center border-t border-gray-700 pt-4">
                        <div>
                            <p className="text-sm text-gray-400">LOC Planejado</p>
                            <p className="font-mono text-xl font-semibold">{nextSprint.locPlanned.toLocaleString('pt-BR')}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">LOC Entregue</p>
                            <p className="font-mono text-xl font-semibold">{nextSprint.locDelivered.toLocaleString('pt-BR')}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">LOC Faltante</p>
                            <p className="font-mono text-xl font-semibold">{nextMetrics.remaining.toLocaleString('pt-BR')}</p>
                        </div>
                    </div>
                </div>
            </DashboardCard>
        </div>
    );
};

export default ProjectStatus;
