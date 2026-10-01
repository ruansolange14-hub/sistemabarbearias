import React from 'react';
import { useBarber } from '../../context/BarberContext';
import { Headphones, X, MessageCircle, Mail, Phone, ExternalLink } from 'lucide-react';

export const SupportModal: React.FC = () => {
  const { isSupportOpen, closeSupport } = useBarber();

  if (!isSupportOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-[#0e192e] border border-sky-500/40 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-[#182c50] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Suporte BarberPilot</h2>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Atendimento Rápido
              </span>
            </div>
          </div>

          <button onClick={closeSupport} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Precisa de ajuda com configurações de horários, regras de comissão ou migração da sua barbearia? Nossa equipe de suporte está pronta para te atender.
        </p>

        <div className="space-y-2.5 text-xs">
          <a
            href="https://wa.me/554499962395?text=Ol%C3%A1%2C%20preciso%20de%20ajuda%20no%20BarberPilot"
            target="_blank"
            rel="noreferrer"
            className="w-full bg-[#12213d] hover:bg-emerald-950/40 border border-[#1c3560] hover:border-emerald-500/50 p-3.5 rounded-2xl flex items-center justify-between text-slate-200 hover:text-white transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold block text-white">WhatsApp de Suporte</span>
                <span className="text-[11px] text-slate-400">(44) 9996-2395</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
          </a>

          <div className="bg-[#12213d] border border-[#1c3560] p-3.5 rounded-2xl flex items-center gap-3 text-slate-300">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold block text-white">E-mail Especializado</span>
              <span className="text-[11px] text-slate-400">suporte@barberpilot.app</span>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={closeSupport}
            className="w-full bg-[#162746] hover:bg-[#1f3764] text-slate-200 py-2.5 rounded-xl font-bold text-xs transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
