import React from 'react';
import DashboardCard from '../DashboardCard';
import { GlobeAltIcon } from '../application/components/icons';

const SINMap: React.FC = () => {
  return (
    <div className="mt-6">
      <DashboardCard title="Sistema Interligado Nacional (ONS)" icon={<GlobeAltIcon className="w-6 h-6" />}>
        <div className="w-full h-[75vh] bg-gray-700 rounded-lg overflow-hidden -m-4">
          <iframe
            src="https://sig.ons.org.br/app/sinmaps/"
            title="SIN Maps - ONS"
            className="w-full h-full border-0"
            allowFullScreen
          ></iframe>
        </div>
      </DashboardCard>
    </div>
  );
};

export default SINMap;
