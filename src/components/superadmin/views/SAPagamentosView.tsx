import React, { useState } from 'react';
import { useSuperAdmin } from '../../../context/SuperAdminContext';
import { PagamentoStatus } from '../../../types/superAdmin';
import {
  CreditCard,
  Search,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock,
  ArrowDownLeft,
  DollarSign,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const SAPagamentosView: React.FC = () => {
  const { pagamentos, aprovarPagamento, estornarPagamento, platformConfig } = useSuperAdmin();

  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('TODOS');

  const filteredPagamentos = pagamentos.filter((p) => {
    const matchBusca =
      p.barbeariaNome.toLowerCase().includes(busca.toLowerCase()) ||
      p.identificadorExterno.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus === 'TODOS' || p.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  const totalAprovado = pagamentos
    .filter((p) => p.status === 'APROVADO')
    .reduce((sum, p) => sum + p.valor, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Histórico de Pagamentos SaaS</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-400/30">
              R$ {totalAprovado.toFixed(2).replace('.', ',')} recebidos
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Transações processadas via gateway integrado (camada agnóstica: MercadoPago, Asaas, Stripe).
          </p>
        </div>

        <div className="bg-[#161a25] border border-[#242c3f] px-3.5 py-2 rounded-xl text-xs flex items-center gap-2">
          <Zap className="w-4 h-4 text-blue-400" />
          <span className="text-slate-300">
            Gateway Ativo: <strong className="text-white">{platformConfig.integracoes.gatewayProvedor}</strong> ({platformConfig.integracoes.gatewayAmbiente})
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#161a25] border border-[#242c3f] rounded-2xl p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por barbearia ou ID da transação..."
              className="w-full bg-[#121622] border border-[#222a3d] rounded-xl pl-10 pr-3.5 py-2 text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-4">
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="w-full bg-[#121622] border border-[#222a3d] rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-blue-500"
            >
              <option value="TODOS">Todos os Status</option>
              <option value="APROVADO">APROVADO</option>
              <option value="PENDENTE">PENDENTE</option>
              <option value="RECUSADO">RECUSADO</option>
              <option value="ESTORNADO">ESTORNADO</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#161a25] border border-[#242c3f] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#121622] text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-[#222a3d]">
              <tr>
                <th className="p-4">Barbearia</th>
                <th className="p-4">Valor</th>
                <th className="p-4">Data</th>
                <th className="p-4">Método</th>
                <th className="p-4">ID Transação</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Ações Administrativas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202738]">
              {filteredPagamentos.map((p) => (
                <tr key={p.id} className="hover:bg-[#1a2030] transition-colors">
                  <td className="p-4 font-bold text-white text-sm">
                    {p.barbeariaNome}
                  </td>

                  <td className="p-4 font-extrabold text-white text-sm">
                    R$ {p.valor.toFixed(2).replace('.', ',')}
                  </td>

                  <td className="p-4 font-mono text-[11px] text-slate-300">
                    {p.data}
                  </td>

                  <td className="p-4 font-semibold text-blue-400">
                    {p.metodo}
                  </td>

                  <td className="p-4 font-mono text-[11px] text-slate-400">
                    {p.identificadorExterno}
                  </td>

                  <td className="p-4">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                        p.status === 'APROVADO'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : p.status === 'PENDENTE'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : p.status === 'RECUSADO'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {p.status === 'PENDENTE' && (
                        <button
                          onClick={() => aprovarPagamento(p.id)}
                          className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 rounded-lg text-xs font-semibold transition-colors"
                        >
                          Aprovar Manualmente
                        </button>
                      )}

                      {p.status === 'APROVADO' && (
                        <button
                          onClick={() => estornarPagamento(p.id)}
                          className="px-2.5 py-1 bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-semibold transition-colors"
                        >
                          Estornar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
