/**
 * @file DataCenter.tsx
 * @description Main page component for the Data Center monitoring dashboard, managing tab navigation between Overview and Treemap views, and handling widget maximization state.
 * @version 1.2.0
 * @date 2024-08-05
 * @author Senior DevOps Team
 * @productowner Edivaldo Beringela (Prefeitura de Mauá)
 * 
 * @responsibility
 * Orchestrates the top-level layout and state of the data center monitoring interface.
 * Manages tab switching (Overview ↔ Treemap) and full-screen maximization of the Treemap widget.
 * Ensures seamless integration between child components and consistent user experience.
 * 
 * @changelog
 * v1.2.0 - 2024-08-05
 *   - Updated to integrate with DashboardCard v1.1.0 and DataCenterTreeMap v1.7.1.
 *   - Verified that maximization of the Treemap widget no longer hides action controls (e.g., Energy/Cooling switcher).
 *   - Minor styling adjustments for maximized view container (h-[80vh] for better viewport usage).
 * 
 * v1.1.0 - 2024-07-28
 *   - Implemented tab-based navigation between 'Overview' and 'Treemap de Consumo'.
 *   - Added widget maximization logic for the Treemap, including state management and conditional rendering.
 *   - Introduced fade-in animation for smoother tab transitions.
 * 
 * v1.0.0 - 2024-07-25
 *   - Initial implementation of the Data Center dashboard page with Overview tab only.
 * 
 * @signature
 * GOS7 (Gang of Seven Senior Full Stack DevOps Agile Scrum Team)
 * - Claude, Grok, Gemini, Qwen, DeepSeek, GPT, Manus
 */
import React, { useState, useEffect } from 'react';
import ServerRackStatus from '../application/components/ServerRackStatus';
import PowerConsumption from '../application/components/PowerConsumption';
import CoolingLoad from '../CoolingLoad';
import DataCenterTreeMap from '../application/DataCenterTreeMap';
import EnergyFlowSankey from '../application/components/EnergyFlowSankey';
import DashboardCard from '../DashboardCard';
import { BoltIcon } from '../application/components/icons';


type DataCenterTab = 'overview' | 'treemap' | 'energyflow';
type MaximizedWidget = 'treemap' | null;

interface DataCenterProps {
  onActiveRackUpdate: (count: number) => void;
}

const BESSStatusCard: React.FC = () => {
    const [bess, setBess] = useState({
        status: 'Ocioso - Carga Completa',
        charge: 100,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setBess(prev => {
                let newCharge = prev.charge;
                let newStatus = prev.status;
                if (prev.status.includes('Carregando')) {
                    newCharge = Math.min(100, prev.charge + 5);
                    if (newCharge === 100) newStatus = 'Ocioso - Carga Completa';
                } else if (prev.status.includes('Descarregando')) {
                    newCharge = Math.max(0, prev.charge - 8);
                    if (newCharge === 0) newStatus = 'Ocioso - Descarregado';
                } else {
                    if (Math.random() > 0.9) newStatus = 'Descarregando (Pico)';
                    else if (Math.random() < 0.1 && prev.charge < 90) newStatus = 'Carregando (Rede)';
                }
                return { status: newStatus, charge: newCharge };
            });
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <DashboardCard title="Estabilidade de Energia (BESS)" icon={<BoltIcon className="w-6 h-6 text-green-400" />}>
            <div className="flex flex-col justify-around h-full text-center">
                <div>
                    <p className="text-gray-400 text-sm">Status</p>
                    <p className="text-2xl font-bold text-green-400">{bess.status}</p>
                </div>
                <div className="space-y-2">
                    <p className="text-gray-400 text-sm">Nível de Carga</p>
                    <div className="w-full bg-gray-700 rounded-full h-6">
                        <div className="bg-green-500 h-6 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ width: `${bess.charge}%` }}>
                            {bess.charge.toFixed(0)}%
                        </div>
                    </div>
                </div>
                <div>
                    <p className="text-gray-400 text-sm">Capacidade</p>
                    <p className="text-xl font-semibold text-white">2 MWh / 500 kW</p>
                </div>
            </div>
        </DashboardCard>
    );
};

const DataCenter: React.FC<DataCenterProps> = ({ onActiveRackUpdate }) => {
  const [activeTab, setActiveTab] = useState<DataCenterTab>('overview');
  const [maximizedWidget, setMaximizedWidget] = useState<MaximizedWidget>(null);

  const tabButtonClasses = (tabName: DataCenterTab) =>
    `px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 ${
      activeTab === tabName
        ? 'bg-gray-800 text-cyan-400 border-b-2 border-cyan-400'
        : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
    }`;
  
  const toggleMaximize = (widget: MaximizedWidget) => {
    setMaximizedWidget(current => current === widget ? null : widget);
  };

  // Render maximized widget in full context
  if (maximizedWidget === 'treemap') {
    return (
      <div className="mt-6 h-[80vh]">
        <DataCenterTreeMap 
          isMaximizable 
          isMaximized={true}
          onToggleMaximize={() => toggleMaximize('treemap')}
        />
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="border-b border-gray-700">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('overview')}
            className={tabButtonClasses('overview')}
            aria-current={activeTab === 'overview' ? 'page' : undefined}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('treemap')}
            className={tabButtonClasses('treemap')}
            aria-current={activeTab === 'treemap' ? 'page' : undefined}
          >
            Treemap de Consumo
          </button>
          <button
            onClick={() => setActiveTab('energyflow')}
            className={tabButtonClasses('energyflow')}
            aria-current={activeTab === 'energyflow' ? 'page' : undefined}
          >
            Fluxo de Energia
          </button>
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            <div className="lg:col-span-1">
              <PowerConsumption />
            </div>
            <div className="lg:col-span-1">
              <CoolingLoad />
            </div>
             <div className="lg:col-span-1">
              <BESSStatusCard />
            </div>
            <div className="lg:col-span-3">
              <ServerRackStatus onRackDataUpdate={onActiveRackUpdate} />
            </div>
          </div>
        )}
        {activeTab === 'treemap' && (
          <div className="animate-fadeIn">
            <DataCenterTreeMap 
              isMaximizable
              isMaximized={false}
              onToggleMaximize={() => toggleMaximize('treemap')}
            />
          </div>
        )}
        {activeTab === 'energyflow' && (
            <div className="animate-fadeIn">
                <EnergyFlowSankey />
            </div>
        )}
      </div>

      {/* Inline animation definition for encapsulation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { 
          animation: fadeIn 0.3s ease-in-out; 
        }
      `}</style>
    </div>
  );
};

export default DataCenter;