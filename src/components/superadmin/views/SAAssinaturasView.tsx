import React, { useState } from 'react';
import { useSuperAdmin } from '../../../context/SuperAdminContext';
import { AssinaturaStatus } from '../../../types/superAdmin';
import {
  FileCheck,
  Search,
  Filter,
  CreditCard,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpDown,
  History,
  X,
} from 'lucide-react';

export const SAAssinaturasView: React.FC = () => {
  const { assinaturas, planos, atualizarStatusAssinatura } = useSuperAdmin();

  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('TODOS');
  const [filtroPlano, setFiltroPlano] = useState<string>('TODOS');

  // Filter
  const filteredAssinaturas = assinaturas.filter((a) => {
    const matchBusca =
      a.barbeariaNome.toLowerCase().includes(busca.toLowerCase()) ||
      a.planoNome.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus === 'TODOS' || a.status === filtroStatus;
    const matchPlano = filtroPlano === 'TODOS' || a.planoId === filtroPlano;
    return matchBusca && matchStatus && matchPlano;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Assinaturas SaaS</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-900/40 text-blue-300 font-bold border border-blue-700/50">
              {filteredAssinaturas.length} contratos
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Contratos de recorrência, status de pagamento e próximas cobranças dos clientes da plataforma.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#161a25] border border-[#242c3f] rounded-2xl p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por barbearia ou plano..."
              className="w-full bg-[#121622] border border-[#222a3d] rounded-xl pl-10 pr-3.5 py-2 text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="w-full bg-[#121622] border border-[#222a3d] rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-blue-500"
            >
              <option value="TODOS">Todos os Status</option>
              <option value="ATIVA">ATIVA</option>
              <option value="TRIAL">TRIAL</option>
              <option value="PENDENTE">PENDENTE</option>
              <option value="ATRASADA">ATRASADA</option>
              <option value="SUSPENSA">SUSPENSA</option>
              <option value="CANCELADA">CANCELADA</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={filtroPlano}
              onChange={(e) => setFiltroPlano(e.target.value)}
              className="w-full bg-[#121622] border border-[#222a3d] rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-blue-500"
            >
              <option value="TODOS">Todos os Planos</option>
              {planos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
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
                <th className="p-4">Plano</th>
                <th className="p-4">Valor</th>
                <th className="p-4">Status</th>
                <th className="p-4">Início</th>
                <th className="p-4">Vencimento</th>
                <th className="p-4">Próxima Cobrança</th>
                <th className="p-4">Forma Pagto</th>
                <th className="p-4 text-right">Alterar Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202738]">
              {filteredAssinaturas.map((a) => (
                <tr key={a.id} className="hover:bg-[#1a2030] transition-colors">
                  <td className="p-4 font-bold text-white text-sm">
                    {a.barbeariaNome}
                  </td>

                  <td className="p-4 font-semibold text-slate-200">
                    {a.planoNome}
                  </td>

                  <td className="p-4 font-extrabold text-white">
                    R$ {a.valor.toFixed(2).replace('.', ',')}
                    <span className="text-[10px] text-slate-400 font-normal ml-1">
                      /{a.periodicidade.toLowerCase()}
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                        a.status === 'ATIVA'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : a.status === 'TRIAL'
                          ? 'bg-blue-900/40 text-blue-300 border border-blue-700/50'
                          : a.status === 'ATRASADA'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : a.status === 'SUSPENSA'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>

                  <td className="p-4 font-mono text-[11px] text-slate-300">
                    {a.dataInicio}
                  </td>

                  <td className="p-4 font-mono text-[11px] text-slate-300">
                    {a.dataVencimento}
                  </td>

                  <td className="p-4 font-mono text-[11px] text-blue-300 font-bold">
                    {a.proximaCobranca}
                  </td>

                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-[#121622] text-slate-300 border border-[#222a3d] font-mono text-[11px] font-semibold">
                      {a.formaPagamento}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <select
                      value={a.status}
                      onChange={(e) => atualizarStatusAssinatura(a.id, e.target.value as AssinaturaStatus)}
                      className="bg-[#121622] border border-[#222a3d] rounded-lg px-2 py-1 text-slate-200 text-xs focus:outline-hidden focus:border-blue-500"
                    >
                      <option value="ATIVA">ATIVA</option>
                      <option value="TRIAL">TRIAL</option>
                      <option value="PENDENTE">PENDENTE</option>
                      <option value="ATRASADA">ATRASADA</option>
                      <option value="SUSPENSA">SUSPENSA</option>
                      <option value="CANCELADA">CANCELADA</option>
                    </select>
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
