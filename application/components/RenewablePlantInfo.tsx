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
      <div className="flex flex-col h-full justify-center items-center text-center">
        <div className="p-4 bg-green-900/50 border-l-4 border-green-400 rounded-r-lg">
            <h3 className="text-xl font-bold text-green-400">
                Emissões Zero de GEE
            </h3>
            <p className="mt-2 text-gray-300">
                {descriptions[fuelMode]}
            </p>
        </div>
        <div className="mt-6 text-sm text-gray-400">
            <h4 className="font-semibold text-gray-200 mb-2">Armazenamento de Energia</h4>
            <p>
                A energia é armazenada em BESS (Battery Energy Storage System) para garantir estabilidade.
            </p>
        </div>
      </div>
    </DashboardCard>
  );
};

export default RenewablePlantInfo;