import React, { useState } from 'react';
import { useSuperAdmin } from '../../../context/SuperAdminContext';
import { BarbeariaTenant } from '../../../types/superAdmin';
import {
  AlertTriangle,
  Send,
  Lock,
  Unlock,
  Eye,
  CheckCircle,
  Clock,
  DollarSign,
  Phone,
  MessageCircle,
} from 'lucide-react';

export const SAInadimplenciaView: React.FC = () => {
  const {
    barbearias,
    suspenderBarbearia,
    reativarBarbearia,
    setCurrentSAView,
    setSelectedBarbeariaId,
  } = useSuperAdmin();

  const [avisoEnviadoId, setAvisoEnviadoId] = useState<string | null>(null);

  // Barbearias inadimplentes ou com status INADIMPLENTE / SUSPENSA
  const inadimplentes = barbearias.filter(
    (b) => b.status === 'INADIMPLENTE' || b.status === 'SUSPENSA'
  );

  const valorTotalPendente = inadimplentes.reduce((sum, b) => sum + b.receitaSaaSMensal, 0);

  const handleEnviarAviso = (b: BarbeariaTenant) => {
    setAvisoEnviadoId(b.id);
    setTimeout(() => {
      setAvisoEnviadoId(null);
      alert(`Aviso de cobrança enviado com sucesso para ${b.proprietarioNome} (${b.whatsapp})!`);
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Controle de Inadimplência</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold border border-amber-400/30">
              {inadimplentes.length} em atraso
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gestão de mensalidades vencidas, avisos de cobrança e suspensão preventiva de acesso.
          </p>
        </div>

        <div className="bg-[#161a25] border border-[#242c3f] px-4 py-2 rounded-xl text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span className="text-slate-300">
            Total em Atraso:{' '}
            <strong className="text-amber-400 font-extrabold">
              R$ {valorTotalPendente.toFixed(2).replace('.', ',')}
            </strong>
          </span>
        </div>
      </div>

      {/* Cards Table */}
      {inadimplentes.length === 0 ? (
        <div className="bg-[#161a25] border border-[#242c3f] rounded-2xl p-12 text-center text-xs text-slate-400 space-y-2">
          <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
          <p className="text-base font-bold text-white">Parabéns! Nenhuma barbearia em atraso.</p>
          <p>Todas as assinaturas da plataforma estão em dia ou em período de testes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inadimplentes.map((b) => {
            // Calculate mock days overdue based on nextBilling date
            const hoje = new Date();
            const venc = new Date(b.proximoVencimento);
            const diffTime = Math.max(1, Math.ceil((hoje.getTime() - venc.getTime()) / (1000 * 60 * 60 * 24)));

            return (
              <div
                key={b.id}
                className="bg-[#161a25] border border-[#242c3f] hover:border-amber-500/40 rounded-2xl p-5 space-y-4 shadow-sm transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">{b.nome}</h3>
                    <span className="text-xs text-slate-400">
                      Proprietário: <strong className="text-slate-200">{b.proprietarioNome}</strong>
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                      b.status === 'SUSPENSA'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {b.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-[#121622] p-3 rounded-xl border border-[#222a3d] text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Dias em Atraso</span>
                    <span className="text-base font-black text-amber-400">
                      {diffTime} dias
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block">Valor Pendente</span>
                    <span className="text-base font-black text-white">
                      R$ {b.receitaSaaSMensal.toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block">Plano</span>
                    <span className="font-semibold text-blue-400 block mt-0.5 truncate">
                      {b.planoNome}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-300">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp: {b.whatsapp}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Vencimento original: {b.proximoVencimento}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-[#202738] text-xs">
                  <button
                    onClick={() => {
                      setSelectedBarbeariaId(b.id);
                      setCurrentSAView('barbearia-detalhes');
                    }}
                    className="text-blue-400 hover:underline font-semibold flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Visualizar</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEnviarAviso(b)}
                      disabled={avisoEnviadoId === b.id}
                      className="px-3 py-1.5 bg-[#121622] hover:bg-[#1a2235] text-blue-300 border border-[#222a3d] rounded-xl font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{avisoEnviadoId === b.id ? 'Enviando...' : 'Enviar Aviso'}</span>
                    </button>

                    {b.status === 'SUSPENSA' ? (
                      <button
                        onClick={() => reativarBarbearia(b.id, 'Regularização efetuada')}
                        className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 rounded-xl font-bold flex items-center gap-1 transition-colors"
                      >
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Reativar</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => suspenderBarbearia(b.id, 'Inadimplência de mensalidade')}
                        className="px-3 py-1.5 bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 rounded-xl font-bold flex items-center gap-1 transition-colors"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Suspender</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
