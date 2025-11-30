import React, { useState, useEffect } from 'react';
import { CloseIcon, CogIcon } from './application/components/icons';
import DashboardCard from './DashboardCard';

// Define a clear interface for the modal's props
interface HotspotModalProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

interface GasTurbineDiagramProps {
}

const GasTurbineDiagram: React.FC<GasTurbineDiagramProps> = () => {
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveHotspotId(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const HotspotModal: React.FC<HotspotModalProps> = ({ id, title, children }) => {
    if (activeHotspotId !== id) return null;
    return (
        <div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fadeIn"
            onClick={() => setActiveHotspotId(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`hotspot-title-${id}`}
        >
            <div 
                className="bg-white p-6 rounded-lg max-w-3xl w-full text-gray-800 relative transform transition-all animate-slideUp"
                onClick={e => e.stopPropagation()}
            >
                <button 
                    onClick={() => setActiveHotspotId(null)} 
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                    aria-label="Fechar modal"
                >
                    <CloseIcon className="w-6 h-6" />
                </button>
                <h3 id={`hotspot-title-${id}`} className="text-2xl font-bold mb-4 border-b pb-2">{title}</h3>
                <div className="text-gray-600 leading-relaxed">
                    {children}
                </div>
            </div>
        </div>
    );
  };

  return (
    <DashboardCard title="Diagrama da Turbina a Gás" icon={<CogIcon className="w-6 h-6" />}>
        <div className="relative w-full h-[400px] bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
            <p>Diagrama interativo indisponível. Visualize o modelo 3D na seção de detalhes.</p>
            
            {/* Example Hotspot for Demonstration */}
            <button 
                className="absolute top-1/2 left-1/2 w-4 h-4 bg-red-500 rounded-full animate-ping" 
                onClick={() => setActiveHotspotId('compressor')}
                aria-label="Detalhes do Compressor"
            />
            
            <HotspotModal id="compressor" title="Compressor Axial">
                <p>O compressor axial é responsável por pressurizar o ar admitido antes da câmara de combustão. Em turbinas de alta eficiência como a SGT-8000H, taxas de compressão elevadas são cruciais para a eficiência térmica do ciclo Brayton.</p>
            </HotspotModal>
        </div>
        <style>{`
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
            @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            .animate-slideUp { animation: slideUp 0.3s ease-out; }
        `}</style>
    </DashboardCard>
  );
};

export default GasTurbineDiagram;