import React, { useState } from 'react';
import { useBarber } from '../../context/BarberContext';
import {
  CreditCard,
  Check,
  ShieldCheck,
  Zap,
  Sparkles,
  Bot,
  ArrowRight,
  Star,
} from 'lucide-react';

export const PlanoView: React.FC = () => {
  const { config, updateConfig, setActiveView } = useBarber();

  const [ciclo, setCiclo] = useState<'mensal' | 'anual'>('mensal');
  const [modalAssinatura, setModalAssinatura] = useState<string | null>(null);

  const handleAssinar = (planoNome: 'Starter' | 'Essencial' | 'Pro') => {
    setModalAssinatura(planoNome);
  };

  const confirmarAtivacao = () => {
    if (modalAssinatura) {
      updateConfig({
        plano: modalAssinatura as any,
        statusPlano: 'Assinatura Ativa',
        diasRestantesTeste: 30,
      });
      setModalAssinatura(null);
      alert(`Parabéns! Sua assinatura do plano ${modalAssinatura} foi confirmada com sucesso!`);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Plano
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Escolha o plano ideal para sua barbearia.
        </p>
      </div>

      {/* Active Trial Notice Box matching exact user prompt */}
      <div className="bg-gradient-to-br from-[#121825] to-[#162238] border border-blue-900/40 rounded-2xl p-5 shadow-lg space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Plano ativo no Período de Teste
            </span>
            <span className="px-2 py-0.5 text-xs font-bold bg-blue-950/80 text-blue-300 border border-blue-800/60 rounded-full">
              Essencial
            </span>
          </div>

          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
            Liberado gratuitamente durante o período de teste
          </span>
        </div>

        <p className="text-xs text-slate-300">
          Você tem acesso completo ao Essencial. Escolha um plano para continuar após o teste.
        </p>
      </div>

      {/* Billing Cycle Toggle */}
      <div className="flex justify-center">
        <div className="bg-[#161a25] border border-[#242c3f] p-1 rounded-xl flex items-center gap-1 text-xs">
          <button
            onClick={() => setCiclo('mensal')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              ciclo === 'mensal'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Mensal
          </button>

          <button
            onClick={() => setCiclo('anual')}
            className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              ciclo === 'anual'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Anual</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
              até -15%
            </span>
          </button>
        </div>
      </div>

      {/* 3 Pricing Cards matching exact user names and features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Plan 1: Starter */}
        <div className="bg-[#161a25] border border-[#242c3f] hover:border-blue-700/50 rounded-2xl p-6 flex flex-col justify-between transition-all shadow-sm space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white">Starter</h3>
              <p className="text-xs text-slate-400 mt-1">
                Para começar a organizar a barbearia.
              </p>
            </div>

            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white">
                  R$ {ciclo === 'mensal' ? '27,90' : '23,70'}
                </span>
                <span className="text-xs text-slate-400">/mês</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold block mt-1">
                Preço promocional por tempo limitado
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300 pt-3 border-t border-[#202738]">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>01 Profissional</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Agenda e cadastro de clientes</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Site de agendamento</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleAssinar('Starter')}
            className="w-full bg-[#182032] hover:bg-[#202c45] text-slate-200 border border-[#2c3852] hover:border-blue-700/50 py-2.5 rounded-xl font-bold text-xs transition-all"
          >
            Assinar este plano
          </button>
        </div>

        {/* Plan 2: Essencial (Mais escolhido) */}
        <div className="bg-gradient-to-b from-[#141d30] to-[#161a25] border-2 border-blue-700/70 rounded-2xl p-6 flex flex-col justify-between transition-all shadow-xl shadow-blue-950/20 space-y-6 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-700 text-white px-3 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1 border border-blue-500/30">
            <Star className="w-3 h-3 fill-current" />
            <span>Mais escolhido</span>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white">Essencial</h3>
              <p className="text-xs text-slate-300 mt-1">
                Financeiro, fidelização e IA para vender mais.
              </p>
            </div>

            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white">
                  R$ {ciclo === 'mensal' ? '67,90' : '57,70'}
                </span>
                <span className="text-xs text-slate-300">/mês</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold block mt-1">
                Preço promocional por tempo limitado
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-200 pt-3 border-t border-blue-800/30">
              <div className="flex items-center gap-2 font-semibold text-white">
                <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Até 5 Profissionais</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Tudo do plano Starter</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Financeiro & Comissões</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Extras no atendimento</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Fidelização</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Comercial IA</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-blue-300">
                <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>100 créditos de IA por mês</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleAssinar('Essencial')}
            className="w-full bg-blue-700 hover:bg-blue-600 text-white py-2.5 rounded-xl font-extrabold text-xs transition-all shadow-md shadow-blue-950/50"
          >
            Assinar este plano
          </button>
        </div>

        {/* Plan 3: Pro */}
        <div className="bg-[#161a25] border border-[#242c3f] hover:border-blue-700/50 rounded-2xl p-6 flex flex-col justify-between transition-all shadow-sm space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white">Pro</h3>
              <p className="text-xs text-slate-400 mt-1">
                Marketing IA, automações e domínio próprio.
              </p>
            </div>

            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white">
                  R$ {ciclo === 'mensal' ? '97,90' : '83,20'}
                </span>
                <span className="text-xs text-slate-400">/mês</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold block mt-1">
                Preço promocional por tempo limitado
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300 pt-3 border-t border-[#202738]">
              <div className="flex items-center gap-2 font-semibold text-white">
                <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Profissionais ilimitados</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Tudo do plano Essencial</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Marketing IA e rotinas automáticas</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Domínio Personalizado para Agendamento</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-blue-300">
                <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>300 créditos de IA por mês</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleAssinar('Pro')}
            className="w-full bg-[#182032] hover:bg-[#202c45] text-slate-200 border border-[#2c3852] hover:border-blue-700/50 py-2.5 rounded-xl font-bold text-xs transition-all"
          >
            Assinar este plano
          </button>
        </div>
      </div>

      {/* Stripe secure note matching exact prompt */}
      <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-2 pt-2">
        <ShieldCheck className="w-4 h-4 text-blue-400" />
        <span>Pagamento seguro via Stripe. Cancele quando quiser pelo botão "Gerenciar assinatura".</span>
      </div>

      {/* Bottom Promo Banner */}
      <div className="bg-gradient-to-br from-[#121825] to-[#162238] border border-blue-900/40 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white">Escolha seu plano</h3>
          <p className="text-xs text-slate-300">
            Compare os planos e veja qual combina com o tamanho da sua barbearia.
          </p>
          <p className="text-[11px] text-slate-400">
            Posso ajudar a decidir — é só me chamar.
          </p>
        </div>

        <button
          onClick={() => setActiveView('consultor-ia')}
          className="bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-all shadow-md shadow-blue-950/40 whitespace-nowrap self-start md:self-auto flex items-center gap-1.5"
        >
          <span>Falar com consultor</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Subscription Modal / Stripe Simulator */}
      {modalAssinatura && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#161a25] border border-[#26324b] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#232a3d] pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-400" />
                <span>Assinar BarberPilot {modalAssinatura}</span>
              </h3>
              <button
                onClick={() => setModalAssinatura(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Você está contratando o plano <strong className="text-blue-400">{modalAssinatura}</strong> com cobrança {ciclo}.
            </p>

            <div className="bg-[#121622] p-3 rounded-xl border border-[#222a3d] text-xs space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal:</span>
                <span>
                  {modalAssinatura === 'Starter'
                    ? 'R$ 27,90'
                    : modalAssinatura === 'Essencial'
                    ? 'R$ 67,90'
                    : 'R$ 97,90'}
                </span>
              </div>
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Garantia:</span>
                <span>7 dias incondicionais</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalAssinatura(null)}
                className="px-3.5 py-2 text-slate-400 hover:text-white text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmarAtivacao}
                className="bg-blue-700 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-lg text-xs shadow-md shadow-blue-950/40"
              >
                Confirmar Assinatura
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
