import React, { useState } from 'react';
import { useBarber } from '../../context/BarberContext';
import {
  UserCheck,
  Plus,
  Mail,
  Phone,
  Clock,
  Percent,
  CheckCircle,
  Scissors,
  ShieldCheck,
} from 'lucide-react';

export const FuncionariosView: React.FC = () => {
  const { profissionais, addProfissional } = useBarber();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [comissao, setComissao] = useState('0');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome) return;
    addProfissional({
      nome,
      email,
      telefone,
      comissaoBase: parseFloat(comissao) || 0,
      avatar: nome.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase(),
      ativo: true,
      cor: '#38bdf8',
      cargo: 'Barbeiro Profissional',
      horarioInicio: '09:00',
      horarioFim: '19:00',
    });
    setIsModalOpen(false);
    setNome('');
    setEmail('');
    setTelefone('');
    setComissao('0');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Funcionários
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gerencie os profissionais da sua barbearia, taxas de comissão e jornadas.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-700 hover:bg-blue-600 text-white font-semibold text-xs md:text-sm px-4 py-2.5 rounded-lg transition-all shadow-md shadow-blue-950/40 flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Novo profissional</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profissionais.map((prof) => (
          <div
            key={prof.id}
            className="bg-[#161a25] border border-[#242c3f] rounded-xl p-5 shadow-sm space-y-4 relative"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center font-bold text-sm text-white shadow-sm border border-blue-500/40">
                  {prof.avatar || 'RS'}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    {prof.nome}
                  </h3>
                  <span className="text-[11px] text-blue-400 font-medium">
                    {prof.cargo || 'Barbeiro'}
                  </span>
                </div>
              </div>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Ativo
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-[#202738]">
              {prof.email && (
                <div className="flex items-center gap-2 text-slate-400">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{prof.email}</span>
                </div>
              )}
              {prof.telefone && (
                <div className="flex items-center gap-2 text-slate-400">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{prof.telefone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>Horário: {prof.horarioInicio} às {prof.horarioFim}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Percent className="w-3.5 h-3.5 text-amber-400" />
                <span>Comissão base: <strong className="text-white">{prof.comissaoBase}%</strong></span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#202738] flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">Agenda integrada</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Online</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#161a25] border border-[#26324b] rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <h3 className="font-bold text-white text-base">Novo profissional</h3>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Nome completo *</label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Carlos Eduardo"
                  className="w-full bg-[#121622] border border-[#222a3d] rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-slate-300 font-medium block mb-1">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="carlos@barbearia.com"
                  className="w-full bg-[#121622] border border-[#222a3d] rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-slate-300 font-medium block mb-1">WhatsApp</label>
                <input
                  type="text"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="(11) 98888-7777"
                  className="w-full bg-[#121622] border border-[#222a3d] rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-slate-300 font-medium block mb-1">Comissão base (%)</label>
                <input
                  type="number"
                  value={comissao}
                  onChange={(e) => setComissao(e.target.value)}
                  placeholder="0"
                  className="w-full bg-[#121622] border border-[#222a3d] rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-700 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-lg"
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
