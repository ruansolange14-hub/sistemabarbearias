import React, { useState } from 'react';
import { useSuperAdmin } from '../../../context/SuperAdminContext';
import { AvisoPlataforma } from '../../../types/superAdmin';
import {
  Megaphone,
  Plus,
  Trash2,
  Calendar,
  AlertTriangle,
  CheckCircle,
  X,
  Bell,
} from 'lucide-react';

export const SAAvisosView: React.FC = () => {
  const { avisos, criarAviso, toggleAvisoAtivo, excluirAviso, barbearias } = useSuperAdmin();

  const [modalAberto, setModalAberto] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [prioridade, setPrioridade] = useState<'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE'>('MEDIA');
  const [periodoInicio, setPeriodoInicio] = useState(() => new Date().toISOString().split('T')[0]);
  const [periodoFim, setPeriodoFim] = useState(() => new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
  const [publico, setPublico] = useState<'TODAS' | 'ESPECIFICAS'>('TODAS');

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return;

    criarAviso({
      titulo,
      descricao,
      prioridade,
      periodoInicio,
      periodoFim,
      ativo: true,
      publico,
    });

    setModalAberto(false);
    setTitulo('');
    setDescricao('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Avisos & Comunicados Globais</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-900/40 text-blue-300 font-bold border border-blue-700/50">
              {avisos.length} comunicados
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Envie alertas de manutenção, novidades de recursos e avisos importantes diretamente nos painéis das barbearias.
          </p>
        </div>

        <button
          onClick={() => setModalAberto(true)}
          className="bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs md:text-sm px-4 py-2.5 rounded-xl transition-all shadow-md shadow-blue-950/40 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Novo Aviso</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {avisos.map((aviso) => (
          <div
            key={aviso.id}
            className={`bg-[#161a25] border rounded-2xl p-5 space-y-3 transition-all ${
              aviso.ativo ? 'border-[#242c3f] hover:border-blue-700/50' : 'border-[#1b2234] opacity-60'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[9px] font-extrabold px-2 py-0.5 rounded uppercase ${
                    aviso.prioridade === 'URGENTE'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : aviso.prioridade === 'ALTA'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-blue-900/40 text-blue-300 border border-blue-700/50'
                  }`}
                >
                  Prioridade {aviso.prioridade}
                </span>

                <span className="text-[10px] text-slate-400">
                  Público: <strong className="text-slate-200">{aviso.publico === 'TODAS' ? 'Todas as barbearias' : 'Específicas'}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleAvisoAtivo(aviso.id)}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors ${
                    aviso.ativo ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-slate-400 hover:bg-slate-700/20'
                  }`}
                >
                  {aviso.ativo ? 'Ativo' : 'Pausado'}
                </button>

                <button
                  onClick={() => excluirAviso(aviso.id)}
                  className="text-slate-500 hover:text-rose-400 p-1 rounded"
                  title="Excluir aviso"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-white text-sm">{aviso.titulo}</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{aviso.descricao}</p>
            </div>

            <div className="pt-2 border-t border-[#202738] flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Período: {aviso.periodoInicio} até {aviso.periodoFim}</span>
              <span>Criado em: {aviso.criadoEm}</span>
            </div>
          </div>
        ))}
      </div>

      {modalAberto && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#161a25] border border-[#26324b] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#242c3f] pb-3">
              <h3 className="font-bold text-white text-base">Criar Novo Comunicado Global</h3>
              <button onClick={() => setModalAberto(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSalvar} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Título do Aviso *</label>
                <input
                  type="text"
                  required
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex: Manutenção programada domingo às 03h"
                  className="w-full bg-[#121622] border border-[#222a3d] rounded-xl px-3.5 py-2.5 text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Descrição detalhada</label>
                <textarea
                  rows={3}
                  required
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Detalhes para os proprietários das barbearias..."
                  className="w-full bg-[#121622] border border-[#222a3d] rounded-xl p-3 text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Prioridade</label>
                  <select
                    value={prioridade}
                    onChange={(e) => setPrioridade(e.target.value as any)}
                    className="w-full bg-[#121622] border border-[#222a3d] rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="BAIXA">BAIXA</option>
                    <option value="MEDIA">MEDIA</option>
                    <option value="ALTA">ALTA</option>
                    <option value="URGENTE">URGENTE</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Público Alvo</label>
                  <select
                    value={publico}
                    onChange={(e) => setPublico(e.target.value as any)}
                    className="w-full bg-[#121622] border border-[#222a3d] rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="TODAS">Todas as Barbearias</option>
                    <option value="ESPECIFICAS">Barbearias Específicas</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Início</label>
                  <input
                    type="date"
                    value={periodoInicio}
                    onChange={(e) => setPeriodoInicio(e.target.value)}
                    className="w-full bg-[#121622] border border-[#222a3d] rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Término</label>
                  <input
                    type="date"
                    value={periodoFim}
                    onChange={(e) => setPeriodoFim(e.target.value)}
                    className="w-full bg-[#121622] border border-[#222a3d] rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>
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
                  Publicar Aviso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
