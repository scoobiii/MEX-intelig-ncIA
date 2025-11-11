import React from 'react';
import DashboardCard from '../DashboardCard';
import { GlobeAltIcon } from '../application/components/icons';

const SolarPotential: React.FC = () => {
  return (
    <div className="mt-6">
      <DashboardCard title="Potencial Solar (Google)" icon={<GlobeAltIcon className="w-6 h-6" />}>
        <div className="w-full h-[75vh] bg-gray-700 rounded-lg overflow-hidden -m-4">
          <iframe
            src="https://solar-potential-296769475687.us-central1.run.app/"
            title="Potencial Solar - Google"
            className="w-full h-full border-0"
            allowFullScreen
          ></iframe>
        </div>
      </DashboardCard>
    </div>
  );
};

export default SolarPotential;
