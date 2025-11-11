import React from 'react';
import DashboardCard from '../../DashboardCard';
import { InfoIcon } from './icons';

interface RenewablePlantInfoProps {
  fuelMode: 'SOLAR_BESS' | 'WIND_BESS';
  isMaximizable?: boolean;
  isMaximized?: boolean;
  onToggleMaximize?: () => void;
}

const RenewablePlantInfo: React.FC<RenewablePlantInfoProps> = ({
  fuelMode,
  isMaximizable,
  isMaximized,
  onToggleMaximize,
}) => {
  const titles = {
    SOLAR_BESS: 'Status de Emissões (Solar)',
    WIND_BESS: 'Status de Emissões (Eólica)',
  };
  const descriptions = {
    SOLAR_BESS: 'A geração de energia solar não emite gases de efeito estufa durante a operação.',
    WIND_BESS: 'A geração de energia eólica não emite gases de efeito estufa durante a operação.',
  };

  return (
    <DashboardCard
      title={titles[fuelMode]}
      icon={<InfoIcon className="w-6 h-6 text-green-400" />}
      isMaximizable={isMaximizable}
      isMaximized={isMaximized}
      onToggleMaximize={onToggleMaximize}
      className="h-full"
    >
      <div className="flex flex-col h-full justify-around">
        <div className="p-3 text-center bg-green-900/50 border-l-4 border-green-400 rounded-r-lg">
            <h3 className="text-lg font-bold text-green-400">
                Emissões Zero de GEE
            </h3>
            <p className="mt-1 text-sm text-gray-300">
                {descriptions[fuelMode]}
            </p>
        </div>
        <div className="mt-4 text-center border-t border-gray-700 pt-4">
            <h4 className="font-semibold text-gray-200 mb-2 text-lg">Armazenamento de Energia (BESS)</h4>
            <p className="text-sm text-gray-400 mb-3">
                Integrado com BESS Container para garantir estabilidade da rede, evitar curtailment e otimizar a entrega de energia.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-900/50 p-2 rounded-lg">
                    <p className="text-gray-400">Capacidade</p>
                    <p className="font-bold text-white text-xl">2 MWh</p>
                </div>
                <div className="bg-gray-900/50 p-2 rounded-lg">
                    <p className="text-gray-400">Potência Máx.</p>
                    <p className="font-bold text-white text-xl">500 kW</p>
                </div>
            </div>
        </div>
      </div>
    </DashboardCard>
  );
};

export default RenewablePlantInfo;