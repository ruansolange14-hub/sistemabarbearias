import React, { useState } from 'react';
import { useSuperAdmin } from '../../../context/SuperAdminContext';
import {
  History,
  Search,
  Filter,
  Shield,
  FileText,
  User,
  Clock,
  Layers,
} from 'lucide-react';

export const SAAuditoriaView: React.FC = () => {
  const { auditLogs } = useSuperAdmin();

  const [busca, setBusca] = useState('');
  const [filtroEntidade, setFiltroEntidade] = useState<string>('TODAS');

  const filteredLogs = auditLogs.filter((log) => {
    const matchBusca =
      log.acao.toLowerCase().includes(busca.toLowerCase()) ||
      log.detalhes.toLowerCase().includes(busca.toLowerCase()) ||
      log.usuarioNome.toLowerCase().includes(busca.toLowerCase());

    const matchEntidade = filtroEntidade === 'TODAS' || log.entidade === filtroEntidade;

    return matchBusca && matchEntidade;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Trilha de Auditoria & Segurança</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-400 font-bold border border-sky-400/30">
              {filteredLogs.length} eventos registrados
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Registro imutável de todas as ações administrativas, suspensões, reativações e alterações de planos.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0b1322] border border-[#162644] rounded-2xl p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por ação, usuário ou detalhes..."
              className="w-full bg-[#101b30] border border-[#182a4d] rounded-xl pl-10 pr-3.5 py-2 text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-400"
            />
          </div>

          <div className="md:col-span-4">
            <select
              value={filtroEntidade}
              onChange={(e) => setFiltroEntidade(e.target.value)}
              className="w-full bg-[#101b30] border border-[#182a4d] rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-sky-400"
            >
              <option value="TODAS">Todas as Entidades</option>
              <option value="BARBEARIA">BARBEARIA</option>
              <option value="PLANO">PLANO</option>
              <option value="ASSINATURA">ASSINATURA</option>
              <option value="USUARIO">USUARIO</option>
              <option value="CONFIGURACAO">CONFIGURACAO</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-[#0b1322] border border-[#162644] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#080e1a] text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-[#162644]">
              <tr>
                <th className="p-4">Data / Hora</th>
                <th className="p-4">Administrador</th>
                <th className="p-4">Ação</th>
                <th className="p-4">Entidade</th>
                <th className="p-4">Detalhes</th>
                <th className="p-4">Motivo / Justificativa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#132038]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#0f1b30] transition-colors">
                  <td className="p-4 font-mono text-[11px] text-slate-300 whitespace-nowrap">
                    {log.dataHora}
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <span className="font-bold text-white block">{log.usuarioNome}</span>
                    <span className="text-[10px] text-slate-400">{log.usuarioEmail}</span>
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <span className="font-mono font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded text-[11px] border border-sky-500/20">
                      {log.acao}
                    </span>
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-[#142340] text-slate-300 border border-[#1c3560]">
                      {log.entidade}
                    </span>
                  </td>

                  <td className="p-4 text-slate-200 min-w-[260px] leading-relaxed">
                    {log.detalhes}
                  </td>

                  <td className="p-4 text-slate-400 text-[11px] italic min-w-[180px]">
                    {log.motivo || '—'}
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
