import React, { useState } from 'react';
import { useSuperAdmin } from '../../../context/SuperAdminContext';
import { UserRole } from '../../../types/superAdmin';
import {
  Users,
  Search,
  Filter,
  Shield,
  UserCheck,
  Scissors,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
} from 'lucide-react';

export const SAUsuariosView: React.FC = () => {
  const { usuarios, toggleStatusUsuario } = useSuperAdmin();

  const [busca, setBusca] = useState('');
  const [filtroPapel, setFiltroPapel] = useState<string>('TODOS');
  const [filtroStatus, setFiltroStatus] = useState<string>('TODOS');

  const filteredUsuarios = usuarios.filter((u) => {
    const matchBusca =
      u.nome.toLowerCase().includes(busca.toLowerCase()) ||
      u.email.toLowerCase().includes(busca.toLowerCase()) ||
      (u.barbeariaNome && u.barbeariaNome.toLowerCase().includes(busca.toLowerCase()));

    const matchPapel = filtroPapel === 'TODOS' || u.papel === filtroPapel;
    const matchStatus = filtroStatus === 'TODOS' || u.status === filtroStatus;

    return matchBusca && matchPapel && matchStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Usuários da Plataforma</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-900/40 text-blue-300 font-bold border border-blue-700/50">
              {filteredUsuarios.length} contas
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gestão de acessos, papéis de permissão (RBAC) e status de todos os administradores, proprietários e barbeiros.
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
              placeholder="Buscar por nome, email ou barbearia..."
              className="w-full bg-[#121622] border border-[#222a3d] rounded-xl pl-10 pr-3.5 py-2 text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={filtroPapel}
              onChange={(e) => setFiltroPapel(e.target.value)}
              className="w-full bg-[#121622] border border-[#222a3d] rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-blue-500"
            >
              <option value="TODOS">Todos os Papéis</option>
              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              <option value="PROPRIETARIO">PROPRIETARIO</option>
              <option value="GERENTE">GERENTE</option>
              <option value="BARBEIRO">BARBEIRO</option>
              <option value="CLIENTE">CLIENTE</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="w-full bg-[#121622] border border-[#222a3d] rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-blue-500"
            >
              <option value="TODOS">Todos os Status</option>
              <option value="ATIVO">ATIVO</option>
              <option value="SUSPENSO">SUSPENSO</option>
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
                <th className="p-4">Usuário</th>
                <th className="p-4">Papel / Nível</th>
                <th className="p-4">Barbearia Vinculada</th>
                <th className="p-4">Status</th>
                <th className="p-4">Data Cadastro</th>
                <th className="p-4">Último Acesso</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202738]">
              {filteredUsuarios.map((u) => (
                <tr key={u.id} className="hover:bg-[#1a2030] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-700 to-blue-900 text-white font-bold text-xs flex items-center justify-center border border-blue-500/40">
                        {u.avatar || 'U'}
                      </div>
                      <div>
                        <span className="font-bold text-white text-sm block">
                          {u.nome}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {u.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                        u.papel === 'SUPER_ADMIN'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          : u.papel === 'PROPRIETARIO'
                          ? 'bg-blue-900/40 text-blue-300 border border-blue-700/50'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {u.papel}
                    </span>
                  </td>

                  <td className="p-4 text-slate-200 font-medium">
                    {u.barbeariaNome || (
                      <span className="text-slate-500 italic">Global (Plataforma)</span>
                    )}
                  </td>

                  <td className="p-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        u.status === 'ATIVO'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-rose-500/15 text-rose-400'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>

                  <td className="p-4 font-mono text-[11px] text-slate-400">
                    {u.dataCadastro}
                  </td>

                  <td className="p-4 font-mono text-[11px] text-slate-300">
                    {u.ultimoAcesso}
                  </td>

                  <td className="p-4 text-right">
                    {u.papel !== 'SUPER_ADMIN' && (
                      <button
                        onClick={() => toggleStatusUsuario(u.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          u.status === 'ATIVO'
                            ? 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30'
                            : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40'
                        }`}
                      >
                        {u.status === 'ATIVO' ? 'Suspender' : 'Ativar'}
                      </button>
                    )}
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
