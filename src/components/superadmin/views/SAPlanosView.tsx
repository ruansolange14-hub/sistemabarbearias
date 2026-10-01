import React, { useState } from 'react';
import { useSuperAdmin } from '../../../context/SuperAdminContext';
import { SaaSPlan } from '../../../types/superAdmin';
import {
  Package,
  Plus,
  Edit2,
  Check,
  Star,
  Users,
  HardDrive,
  Shield,
  X,
  Layers,
  Sparkles,
} from 'lucide-react';

export const SAPlanosView: React.FC = () => {
  const { planos, criarPlano, editarPlano, toggleStatusPlano, assinaturas } = useSuperAdmin();

  const [modalAberto, setModalAberto] = useState(false);
  const [planoEmEdicao, setPlanoEmEdicao] = useState<SaaSPlan | null>(null);

  // Form states
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [precoMensal, setPrecoMensal] = useState('89.90');
  const [precoAnual, setPrecoAnual] = useState('899.00');
  const [limiteBarbeiros, setLimiteBarbeiros] = useState('5');
  const [limiteFuncionarios, setLimiteFuncionarios] = useState('8');
  const [limiteClientes, setLimiteClientes] = useState('1500');
  const [destaque, setDestaque] = useState(false);
  const [funcionalidades, setFuncionalidades] = useState('');

  const abrirNovoPlano = () => {
    setPlanoEmEdicao(null);
    setNome('');
    setDescricao('');
    setPrecoMensal('89.90');
    setPrecoAnual('899.00');
    setLimiteBarbeiros('5');
    setLimiteFuncionarios('8');
    setLimiteClientes('1500');
    setDestaque(false);
    setFuncionalidades('Dashboard Operacional\nAgenda Online\nCadastro de Clientes\nFinanceiro & DRE');
    setModalAberto(true);
  };

  const abrirEdicaoPlano = (p: SaaSPlan) => {
    setPlanoEmEdicao(p);
    setNome(p.nome);
    setDescricao(p.descricao);
    setPrecoMensal(p.precoMensal.toString());
    setPrecoAnual(p.precoAnual.toString());
    setLimiteBarbeiros(p.limiteBarbeiros.toString());
    setLimiteFuncionarios(p.limiteFuncionarios.toString());
    setLimiteClientes(p.limiteClientes.toString());
    setDestaque(p.destaque);
    setFuncionalidades(p.funcionalidadesHabilitadas.join('\n'));
    setModalAberto(true);
  };

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;

    const funcsArray = funcionalidades
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    if (planoEmEdicao) {
      editarPlano({
        ...planoEmEdicao,
        nome,
        descricao,
        precoMensal: parseFloat(precoMensal) || 0,
        precoAnual: parseFloat(precoAnual) || 0,
        limiteBarbeiros: parseInt(limiteBarbeiros) || 1,
        limiteFuncionarios: parseInt(limiteFuncionarios) || 1,
        limiteClientes: parseInt(limiteClientes) || 300,
        destaque,
        funcionalidadesHabilitadas: funcsArray,
      });
    } else {
      criarPlano({
        nome,
        descricao,
        precoMensal: parseFloat(precoMensal) || 0,
        precoAnual: parseFloat(precoAnual) || 0,
        limiteBarbeiros: parseInt(limiteBarbeiros) || 1,
        limiteFuncionarios: parseInt(limiteFuncionarios) || 1,
        limiteClientes: parseInt(limiteClientes) || 300,
        limiteArmazenamentoMb: 2000,
        funcionalidadesHabilitadas: funcsArray,
        status: 'ATIVO',
        destaque,
        ordem: planos.length + 1,
      });
    }

    setModalAberto(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Planos Comerciais SaaS</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-900/40 text-blue-300 font-bold border border-blue-700/50">
              {planos.length} planos
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Defina preços, limites de profissionais, recursos e periodicidades sem fixar valores em código.
          </p>
        </div>

        <button
          onClick={abrirNovoPlano}
          className="bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs md:text-sm px-4 py-2.5 rounded-xl transition-all shadow-md shadow-blue-950/40 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Novo Plano</span>
        </button>
      </div>

      {/* Plans Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {planos.map((p) => {
          const assinaturasNestePlano = assinaturas.filter((a) => a.planoId === p.id).length;

          return (
            <div
              key={p.id}
              className={`bg-[#161a25] border rounded-3xl p-6 flex flex-col justify-between transition-all relative ${
                p.destaque
                  ? 'border-blue-600/70 shadow-xl shadow-blue-950/30'
                  : 'border-[#242c3f] hover:border-blue-700/50'
              } ${p.status === 'INATIVO' ? 'opacity-60' : ''}`}
            >
              {p.destaque && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-700 text-white px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-sm border border-blue-500/30">
                  <Star className="w-3 h-3 fill-current" />
                  <span>Destaque Comercial</span>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">{p.nome}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{p.descricao}</p>
                  </div>

                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase ${
                      p.status === 'ATIVO'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>

                {/* Preços */}
                <div className="pt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white">
                      R$ {p.precoMensal.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-xs text-slate-400">/mês</span>
                  </div>
                  <div className="text-[11px] text-blue-400 font-semibold mt-0.5">
                    Anual: R$ {p.precoAnual.toFixed(2).replace('.', ',')}/ano
                  </div>
                </div>

                {/* Limites */}
                <div className="bg-[#121622] p-3 rounded-2xl border border-[#222a3d] space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Limite de Barbeiros:</span>
                    <span className="font-bold text-white">
                      {p.limiteBarbeiros === -1 ? 'Ilimitado' : p.limiteBarbeiros}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Limite de Funcionários:</span>
                    <span className="font-bold text-white">
                      {p.limiteFuncionarios === -1 ? 'Ilimitado' : p.limiteFuncionarios}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Limite de Clientes:</span>
                    <span className="font-bold text-white">
                      {p.limiteClientes === -1 ? 'Ilimitado' : p.limiteClientes}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-[#202738]">
                    <span className="text-slate-400">Barbearias Assinantes:</span>
                    <span className="font-bold text-blue-400">{assinaturasNestePlano}</span>
                  </div>
                </div>

                {/* Features list */}
                <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-[#202738]">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Recursos Inclusos:
                  </span>
                  {p.funcionalidadesHabilitadas.map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-6 mt-6 border-t border-[#202738]">
                <button
                  onClick={() => abrirEdicaoPlano(p)}
                  className="w-full bg-[#121622] hover:bg-[#1a2235] text-slate-200 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#222a3d]"
                >
                  <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Editar</span>
                </button>

                <button
                  onClick={() => toggleStatusPlano(p.id)}
                  className={`w-full py-2 rounded-xl text-xs font-semibold transition-colors ${
                    p.status === 'ATIVO'
                      ? 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30'
                      : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40'
                  }`}
                >
                  {p.status === 'ATIVO' ? 'Desativar' : 'Ativar'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Criar / Editar Plano */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#161a25] border border-[#26324b] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative my-8">
            <div className="flex items-center justify-between border-b border-[#242c3f] pb-3">
              <h3 className="font-bold text-white text-base">
                {planoEmEdicao ? 'Editar Plano Comercial' : 'Criar Novo Plano Comercial'}
              </h3>
              <button onClick={() => setModalAberto(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSalvar} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Nome do Plano *</label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Profissional VIP"
                  className="w-full bg-[#121622] border border-[#222a3d] rounded-xl px-3.5 py-2.5 text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Descrição</label>
                <input
                  type="text"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Ex: Para barbearias com até 5 barbeiros e rotinas automáticas"
                  className="w-full bg-[#121622] border border-[#222a3d] rounded-xl px-3.5 py-2.5 text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Preço Mensal (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={precoMensal}
                    onChange={(e) => setPrecoMensal(e.target.value)}
                    className="w-full bg-[#121622] border border-[#222a3d] rounded-xl px-3 py-2 text-white font-bold text-sm focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Preço Anual (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={precoAnual}
                    onChange={(e) => setPrecoAnual(e.target.value)}
                    className="w-full bg-[#121622] border border-[#222a3d] rounded-xl px-3 py-2 text-white font-bold text-sm focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Limite Barbeiros (-1 = ilimitado)</label>
                  <input
                    type="number"
                    value={limiteBarbeiros}
                    onChange={(e) => setLimiteBarbeiros(e.target.value)}
                    className="w-full bg-[#121622] border border-[#222a3d] rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Funcionários</label>
                  <input
                    type="number"
                    value={limiteFuncionarios}
                    onChange={(e) => setLimiteFuncionarios(e.target.value)}
                    className="w-full bg-[#121622] border border-[#222a3d] rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Clientes Max</label>
                  <input
                    type="number"
                    value={limiteClientes}
                    onChange={(e) => setLimiteClientes(e.target.value)}
                    className="w-full bg-[#121622] border border-[#222a3d] rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Funcionalidades Habilitadas (uma por linha):
                </label>
                <textarea
                  rows={4}
                  value={funcionalidades}
                  onChange={(e) => setFuncionalidades(e.target.value)}
                  className="w-full bg-[#121622] border border-[#222a3d] rounded-xl p-3 text-white font-mono text-xs focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="destaqueCheck"
                  checked={destaque}
                  onChange={(e) => setDestaque(e.target.checked)}
                  className="accent-blue-600 w-4 h-4 rounded"
                />
                <label htmlFor="destaqueCheck" className="text-slate-200 cursor-pointer">
                  Marcar este plano como "Mais Escolhido / Destaque"
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#242c3f]">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="px-4 py-2 text-slate-300 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-700 hover:bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl shadow-md shadow-blue-950/40"
                >
                  Salvar Plano
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
