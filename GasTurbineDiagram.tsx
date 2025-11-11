import React, { useState, useEffect } from 'react';
import { CloseIcon } from './application/components/icons';

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
                <button onClick={() => setActiveHotspotId(null)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-8