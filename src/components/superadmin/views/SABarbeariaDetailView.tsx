import React, { useState } from 'react';
import { useSuperAdmin } from '../../../context/SuperAdminContext';
import {
  Building2,
  ArrowLeft,
  Phone,
  Mail,
  Instagram,
  MapPin,
  Calendar,
  CreditCard,
  Users,
  Scissors,
  CheckCircle,
  AlertTriangle,
  Lock,
  Unlock,
  Sliders,
  DollarSign,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react';

export const SABarbeariaDetailView: React.FC = () => {
  const {
    barbearias,
    selectedBarbeariaId,
    setCurrentSAView,
    planos,
    suspenderBarbearia,
    reativarBarbearia,
    alterarPlanoBarbearia,
  } = useSuperAdmin();

  const barbearia = barbearias.find((b) => b.id === selectedBarbeariaId) || barbearias[0];

  const [modalSuspender, setModalSuspender] = useState(false);
  const [motivo, setMotivo] = useState('');
  const [modalAlterarPlano, setModalAlterarPlano] = useState(false);
  const [novoPlano, setNovoPlano] = useState(barbearia?.planoId || '');

  if (!barbearia) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>Barbearia não encontrada.</p>
        <button
          onClick={() => setCurrentSAView('barbearias')}
          className="mt-3 text-sky-400 underline"
        >
          Voltar para a lista
        </button>
      </div>
    );
  }

  const handleSuspender = (e: React.FormEvent) => {
    e.preventDefault();
    suspenderBarbearia(barbearia.id, motivo || 'Suspensão administrativa');
    setModalSuspender(false);
    setMotivo('');
  };

  const handleReativar = () => {
    reativarBarbearia(barbearia.id, 'Reativação manual solicitada no painel');
  };

  const handleSalvarPlano = (e: React.FormEvent) => {
    e.preventDefault();
    alterarPlanoBarbearia(barbearia.id, novoPlano);
    setModalAlterarPlano(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Back button & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentSAView('barbearias')}
            className="p-2 bg-[#0b1322] hover:bg-[#122038] border border-[#162644] text-slate-300 hover:text-white rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                {barbearia.nome}
              </h1>
              <span
                className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                  barbearia.status === 'ATIVA'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : barbearia.status === 'TRIAL'
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                    : barbearia.status === 'INADIMPLENTE'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
              >
                {barbearia.status}
              </span>
            </div>
            <p className="text-xs text-sky-400 font-mono mt-0.5">
              Slug: /{barbearia.slug} · ID: {barbearia.id}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setModalAlterarPlano(true)}
            className="px-3.5 py-2 bg-[#0e192e] hover:bg-[#162644] text-slate-200 border border-[#1a3055] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Sliders className="w-4 h-4 text-sky-400" />
            <span>Alterar Plano</span>
          </button>

          {barbearia.status === 'SUSPENSA' ? (
            <button
              onClick={handleReativar}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-[#070e1b] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
            >
              <Unlock className="w-4 h-4" />
              <span>Reativar Barbearia</span>
            </button>
          ) : (
            <button
              onClick={() => setModalSuspender(true)}
              className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Lock className="w-4 h-4" />
              <span>Suspender Barbearia</span>
            </button>
          )}
        </div>
      </div>

      {/* Suspension Alert if applicable */}
      {barbearia.status === 'SUSPENSA' && (
        <div className="bg-rose-950/30 border border-rose-500/40 rounded-2xl p-4 flex items-start gap-3 text-xs text-rose-200">
          <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block text-sm text-white">Barbearia Temporariamente Suspensa</span>
            <p>Motivo registrado: "{barbearia.motivoSuspensao || 'Suspensão manual pelo Super Admin'}"</p>
            <div className="text-[11px] text-rose-300/80">
              Suspenso por: {barbearia.suspensoPor || 'Super Admin'} em {barbearia.suspensoEm || 'Data recente'}
            </div>
          </div>
        </div>
      )}

      {/* Grid of Sections: IDENTIDADE, CONTATO, ENDEREÇO, ASSINATURA, USUÁRIOS, MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* IDENTIDADE & CONTATO */}
        <div className="bg-[#0b1322] border border-[#162644] rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-sky-400" />
            <span>Identidade & Contato</span>
          </h3>

          <div className="space-y-2.5 text-slate-300">
            <div>
              <span className="text-slate-400 block text-[11px]">Descrição da Barbearia</span>
              <p className="text-white mt-0.5">{barbearia.descricao || 'Sem descrição cadastrada.'}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#132038]">
              <div>
                <span className="text-slate-400 block text-[11px]">Proprietário</span>
                <span className="font-semibold text-white">{barbearia.proprietarioNome}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">E-mail</span>
                <span className="text-slate-200">{barbearia.proprietarioEmail}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#132038]">
              <div>
                <span className="text-slate-400 block text-[11px]">WhatsApp</span>
                <span className="text-emerald-400 font-semibold">{barbearia.whatsapp}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Instagram</span>
                <span className="text-slate-200">{barbearia.instagram || 'Não informado'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ENDEREÇO */}
        <div className="bg-[#0b1322] border border-[#162644] rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sky-400" />
            <span>Localização & Endereço</span>
          </h3>

          <div className="space-y-2.5 text-slate-300">
            <div>
              <span className="text-slate-400 block text-[11px]">Logradouro</span>
              <span className="text-white font-medium">
                {barbearia.endereco.rua}, {barbearia.endereco.numero}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#132038]">
              <div>
                <span className="text-slate-400 block text-[11px]">Bairro</span>
                <span className="text-white">{barbearia.endereco.bairro}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">CEP</span>
                <span className="font-mono text-slate-200">{barbearia.endereco.cep}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#132038]">
              <span className="text-slate-400 block text-[11px]">Cidade e Estado</span>
              <span className="text-white font-semibold">
                {barbearia.endereco.cidade} - {barbearia.endereco.estado}
              </span>
            </div>
          </div>
        </div>

        {/* ASSINATURA SAAS */}
        <div className="bg-[#0b1322] border border-[#162644] rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-sky-400" />
            <span>Dados da Assinatura SaaS</span>
          </h3>

          <div className="space-y-2.5 text-slate-300">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-slate-400 block text-[11px]">Plano Contratado</span>
                <span className="text-base font-bold text-white">{barbearia.planoNome}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[11px]">Mensalidade</span>
                <span className="text-base font-extrabold text-sky-400">
                  R$ {barbearia.receitaSaaSMensal.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#132038]">
              <div>
                <span className="text-slate-400 block text-[11px]">Data de Cadastro</span>
                <span className="font-mono text-slate-200">{barbearia.dataCadastro}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Próximo Vencimento</span>
                <span className="font-mono text-sky-300 font-bold">{barbearia.proximoVencimento}</span>
              </div>
            </div>
          </div>
        </div>

        {/* MÉTRICAS DA BARBEARIA */}
        <div className="bg-[#0b1322] border border-[#162644] rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-sky-400" />
            <span>Métricas Operacionais da Barbearia</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#101b30] p-3 rounded-xl border border-[#182a4d]">
              <span className="text-[10px] text-slate-400 block">Clientes Atendidos</span>
              <span className="text-xl font-bold text-white mt-1 block">
                {barbearia.totalClientes}
              </span>
            </div>

            <div className="bg-[#101b30] p-3 rounded-xl border border-[#182a4d]">
              <span className="text-[10px] text-slate-400 block">Total Agendamentos</span>
              <span className="text-xl font-bold text-sky-400 mt-1 block">
                {barbearia.totalAgendamentos}
              </span>
            </div>

            <div className="bg-[#101b30] p-3 rounded-xl border border-[#182a4d] col-span-2">
              <span className="text-[10px] text-slate-400 block">Faturamento Mensal da Barbearia (GMV)</span>
              <span className="text-2xl font-extrabold text-emerald-400 mt-1 block">
                R$ {barbearia.faturamentoMensalBarbearia.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Suspender */}
      {modalSuspender && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e192e] border-2 border-rose-500/40 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white text-rose-400">Suspender Barbearia</h3>
            <p className="text-xs text-slate-300">
              Tem certeza que deseja suspender a barbearia <strong>{barbearia.nome}</strong>?
            </p>
            <form onSubmit={handleSuspender} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Motivo:</label>
                <input
                  type="text"
                  required
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Ex: Falta de pagamento após notificações"
                  className="w-full bg-[#101a2e] border border-[#1a2d50] rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalSuspender(false)}
                  className="px-4 py-2 text-slate-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 py-2 rounded-xl"
                >
                  Confirmar Suspensão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Alterar Plano */}
      {modalAlterarPlano && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e192e] border border-[#1e3b6a] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Alterar Plano</h3>
            <form onSubmit={handleSalvarPlano} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Novo Plano:</label>
                <select
                  value={novoPlano}
                  onChange={(e) => setNovoPlano(e.target.value)}
                  className="w-full bg-[#101b30] border border-[#182a4d] rounded-xl px-3 py-2 text-white"
                >
                  {planos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome} - R$ {p.precoMensal}/mês
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalAlterarPlano(false)}
                  className="px-4 py-2 text-slate-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-sky-500 hover:bg-sky-400 text-[#070e1b] font-bold px-4 py-2 rounded-xl"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
