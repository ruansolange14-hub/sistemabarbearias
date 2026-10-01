import React, { useState } from 'react';
import { useBarber } from '../../context/BarberContext';
import {
  Users,
  UserPlus,
  Search,
  Phone,
  Instagram,
  Calendar,
  MessageCircle,
  Award,
  DollarSign,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { Cliente } from '../../types';

export const ClientesView: React.FC = () => {
  const { clientes, openNovoCliente, openNovoAgendamento } = useBarber();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'ativos' | 'em_risco' | 'inativos' | 'aniversariantes'>('ativos');

  const filteredClientes = clientes.filter((c) => {
    const matchesSearch =
      c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.telefone.includes(searchTerm);

    if (!matchesSearch) return false;

    if (activeTab === 'ativos') return c.status === 'ativo';
    if (activeTab === 'em_risco') return c.status === 'em_risco';
    if (activeTab === 'inativos') return c.status === 'inativo';
    if (activeTab === 'aniversariantes') return c.status === 'aniversariante' || !!c.aniversario;

    return true;
  });

  const ativosCount = clientes.filter((c) => c.status === 'ativo').length;
  const emRiscoCount = clientes.filter((c) => c.status === 'em_risco').length;
  const inativosCount = clientes.filter((c) => c.status === 'inativo').length;
  const aniversariantesCount = clientes.filter((c) => !!c.aniversario).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Clientes
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-800/60 font-semibold">
              {ativosCount} ativos
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Base de contatos, histórico de visitas e fidelidade da barbearia.
          </p>
        </div>

        <button
          onClick={openNovoCliente}
          className="bg-blue-700 hover:bg-blue-600 text-white font-semibold text-xs md:text-sm px-4 py-2.5 rounded-lg transition-all shadow-md shadow-blue-950/40 flex items-center justify-center gap-2 self-start md:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Novo cliente</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-3.5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome ou WhatsApp..."
              className="w-full bg-[#121622] border border-[#242c3f] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          {/* Filter Tabs matching exact user names */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-medium">
            <button
              onClick={() => setActiveTab('ativos')}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'ativos'
                  ? 'bg-blue-700 text-white font-bold shadow-xs'
                  : 'bg-[#121622] text-slate-300 hover:bg-[#182032] border border-[#222a3d]'
              }`}
            >
              ativos ({ativosCount})
            </button>

            <button
              onClick={() => setActiveTab('em_risco')}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'em_risco'
                  ? 'bg-amber-500 text-[#070e1b] font-bold shadow-xs'
                  : 'bg-[#121622] text-slate-300 hover:bg-[#182032] border border-[#222a3d]'
              }`}
            >
              Em risco ({emRiscoCount})
            </button>

            <button
              onClick={() => setActiveTab('inativos')}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'inativos'
                  ? 'bg-rose-500 text-white font-bold shadow-xs'
                  : 'bg-[#121622] text-slate-300 hover:bg-[#182032] border border-[#222a3d]'
              }`}
            >
              inativos ({inativosCount})
            </button>

            <button
              onClick={() => setActiveTab('aniversariantes')}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'aniversariantes'
                  ? 'bg-purple-500 text-white font-bold shadow-xs'
                  : 'bg-[#121622] text-slate-300 hover:bg-[#182032] border border-[#222a3d]'
              }`}
            >
              Aniversariantes ({aniversariantesCount})
            </button>
          </div>
        </div>
      </div>

      {/* Clientes Content */}
      {filteredClientes.length === 0 ? (
        <div className="bg-[#161a25] border border-[#242c3f] rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400 mx-auto">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Nenhum cliente ainda. Cadastre o primeiro!
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              Cadastre seus clientes manualmente ou compartilhe o link do seu site para que eles mesmos agendem.
            </p>
          </div>
          <button
            onClick={openNovoCliente}
            className="bg-blue-700 hover:bg-blue-600 text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition-all shadow-md shadow-blue-950/40 inline-flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Cadastrar primeiro cliente</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClientes.map((cliente) => (
            <div
              key={cliente.id}
              className="bg-[#161a25] border border-[#242c3f] hover:border-blue-700/50 rounded-xl p-4 transition-all shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-700 to-blue-950 border border-blue-600/40 text-white font-bold flex items-center justify-center text-sm">
                    {cliente.nome
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">
                      {cliente.nome}
                    </h4>
                    <span
                      className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                        cliente.status === 'ativo'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : cliente.status === 'em_risco'
                          ? 'bg-amber-500/15 text-amber-400'
                          : 'bg-rose-500/15 text-rose-400'
                      }`}
                    >
                      {cliente.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => openNovoAgendamento()}
                  className="text-xs text-blue-300 hover:text-white bg-blue-900/50 hover:bg-blue-800/60 border border-blue-700/50 px-2.5 py-1 rounded-md transition-colors"
                >
                  Agendar
                </button>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300 pt-1 border-t border-[#202738]">
                {cliente.telefone && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{cliente.telefone}</span>
                    </span>
                    <a
                      href={`https://wa.me/55${cliente.telefone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                )}

                {cliente.instagram && (
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Instagram className="w-3.5 h-3.5" />
                    <span>@{cliente.instagram.replace('@', '')}</span>
                  </div>
                )}

                {cliente.observacoes && (
                  <p className="text-[11px] text-slate-400 italic pt-1 bg-[#121622] p-2 rounded border border-[#222a3d]">
                    "{cliente.observacoes}"
                  </p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#202738] text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Total Gasto</span>
                  <span className="font-bold text-white">
                    R$ {cliente.totalGasto.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Visitas</span>
                  <span className="font-bold text-blue-400">
                    {cliente.totalAtendimentos}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Fidelidade</span>
                  <span className="font-bold text-amber-400">
                    {cliente.pontosFidelidade} pts
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
