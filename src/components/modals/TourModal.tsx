import React, { useState } from 'react';
import { useBarber } from '../../context/BarberContext';
import { RotateCcw, X, ArrowRight, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';

export const TourModal: React.FC = () => {
  const { isTourOpen, closeTour, setActiveView } = useBarber();
  const [currentStep, setCurrentStep] = useState(0);

  if (!isTourOpen) return null;

  const tourSteps = [
    {
      title: 'Bem-vindo ao BarberPilot 💈',
      desc: 'O sistema operacional definitivo para modernizar sua barbearia, aumentar faturamento e nunca mais perder clientes.',
      highlight: 'Gestão Inteligente',
    },
    {
      title: 'Agenda & Encaixes em Tempo Real 📅',
      desc: 'Visualize horários vagos, bloqueie intervalos e receba agendamentos automáticos diretamente pelo link público do seu site.',
      highlight: 'Agenda',
      target: 'agenda',
    },
    {
      title: 'Marketing IA & Retenção no WhatsApp 🚀',
      desc: 'Lembretes 24 horas antes para reduzir faltas a zero e avisos inteligentes para resgatar clientes sumidos há mais de 60 dias.',
      highlight: 'Marketing IA',
      target: 'marketing-ia',
    },
    {
      title: 'Consultor IA & Métricas Financeiras 💡',
      desc: 'Um consultor de negócios dedicado que analisa seus números diários, identifica horários ociosos e recomenda estratégias lucrativas.',
      highlight: 'Consultor IA',
      target: 'consultor-ia',
    },
  ];

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      const target = tourSteps[currentStep + 1]?.target;
      if (target) setActiveView(target as any);
    } else {
      closeTour();
      setCurrentStep(0);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-[#0e192e] border border-sky-500/40 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-[#182c50] pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-400" />
            <span className="font-bold text-white text-sm">Tour do BarberPilot</span>
          </div>
          <button onClick={closeTour} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider">
            Passo {currentStep + 1} de {tourSteps.length}
          </span>
          <h3 className="text-xl font-extrabold text-white">
            {tourSteps[currentStep].title}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {tourSteps[currentStep].desc}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#182c50]">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30"
          >
            Anterior
          </button>

          <button
            onClick={handleNext}
            className="bg-sky-500 hover:bg-sky-400 text-[#070e1b] font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md shadow-sky-500/20 flex items-center gap-1.5"
          >
            <span>{currentStep === tourSteps.length - 1 ? 'Concluir Tour' : 'Próximo'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
