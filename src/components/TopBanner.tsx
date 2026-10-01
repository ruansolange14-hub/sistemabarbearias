import React from 'react';
import { useBarber } from '../context/BarberContext';
import { AlertCircle, X, ArrowRight } from 'lucide-react';

export const TopBanner: React.FC = () => {
  const { isBannerVisible, hideBanner, setActiveView, config } = useBarber();

  if (!isBannerVisible) return null;

  return (
    <div className="bg-gradient-to-r from-[#121722] via-[#162033] to-[#121722] border-b border-blue-900/40 px-4 py-2 text-xs md:text-sm text-slate-200 flex items-center justify-between shadow-sm z-30 relative">
      <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
        <span className="flex h-2 w-2 relative flex-shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
        </span>
        <span className="font-normal text-slate-300">
          Período de teste do plano <strong className="text-white font-semibold">Starter</strong>. Restam{' '}
          <span className="text-blue-400 font-semibold">{config.diasRestantesTeste} dias</span> — Escolha um plano para não perder o acesso.
        </span>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
        <button
          onClick={() => setActiveView('plano')}
          className="bg-blue-700 hover:bg-blue-600 text-white font-semibold px-3 py-1 rounded-md text-xs transition-all flex items-center gap-1 shadow-sm hover:shadow-blue-900/40"
        >
          <span>Escolher plano</span>
          <ArrowRight className="w-3 h-3" />
        </button>

        <button
          onClick={hideBanner}
          className="text-slate-400 hover:text-slate-200 text-xs px-2 py-1 rounded transition-colors flex items-center gap-1 hover:bg-white/5"
          title="Ocultar aviso"
        >
          <span>Ocultar</span>
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
