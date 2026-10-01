import React, { useState, useEffect } from 'react';
import { useBarber } from '../../context/BarberContext';
import { Scissors, X, Upload, Check } from 'lucide-react';
import { Servico } from '../../types';

export const NovoServicoModal: React.FC = () => {
  const { isNovoServicoOpen, closeNovoServico, editingServico, saveServico, profissionais } = useBarber();

  const [nome, setNome] = useState('');
  const [duracao, setDuracao] = useState(30);
  const [preco, setPreco] = useState('50');
  const [categoria, setCategoria] = useState('Básico');
  const [cor, setCor] = useState('#38bdf8');
  const [ativo, setAtivo] = useState(true);
  const [descricao, setDescricao] = useState('');

  useEffect(() => {
    if (editingServico) {
      setNome(editingServico.nome);
      setDuracao(editingServico.duracao);
      setPreco(editingServico.preco.toString());
      setCategoria(editingServico.categoria);
      setCor(editingServico.cor || '#38bdf8');
      setAtivo(editingServico.ativo);
      setDescricao(editingServico.descricao || '');
    } else {
      setNome('');
      setDuracao(30);
      setPreco('50');
      setCategoria('Básico');
      setCor('#38bdf8');
      setAtivo(true);
      setDescricao('');
    }
  }, [editingServico, isNovoServicoOpen]);

  if (!isNovoServicoOpen) return null;

  const durationPresets = [15, 30, 45, 60, 90];
  const colorPresets = [
    '#38bdf8', // sky
    '#0ea5e9', // ocean
    '#6366f1', // indigo
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#14b8a6', // teal
    '#f59e0b', // amber
    '#10b981', // emerald
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;

    const serv: Servico = {
      id: editingServico ? editingServico.id : `serv-${Date.now()}`,
      nome,
      duracao,
      preco: parseFloat(preco) || 0,
      categoria,
      cor,
      ativo,
      quemAtende: ['todos'],
      descricao,
    };

    saveServico(serv);
    closeNovoServico();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0e192e] border border-[#1e3b6a] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative my-8">
        <div className="flex items-center justify-between border-b border-[#182c50] pb-3">
          <div>
            <h2 className="text-lg font-bold text-white">
              {editingServico ? 'Editar serviço' : 'Novo serviço'}
            </h2>
            <p className="text-xs text-slate-400">
              {nome || 'Nome do serviço'} · {duracao} min · R$ {preco || '0'} · {categoria}
            </p>
          </div>
          <button
            onClick={closeNovoServico}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Enviar imagem button matching exact prompt */}
          <div>
            <button
              type="button"
              onClick={() => alert('Selecione uma imagem de alta qualidade do corte/serviço.')}
              className="w-full py-3 border border-dashed border-[#1c3560] hover:border-sky-500/50 rounded-xl text-slate-400 hover:text-sky-300 flex items-center justify-center gap-2 transition-all bg-[#12213d]/50"
            >
              <Upload className="w-4 h-4" />
              <span>Enviar imagem</span>
            </button>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Nome
            </label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Corte masculino"
              className="w-full bg-[#12213d] border border-[#1c3560] rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-400 text-sm"
            />
          </div>

          {/* Duração with presets matching exact prompt */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Duração ({duracao} min)
            </label>
            <div className="flex items-center gap-2">
              {durationPresets.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setDuracao(m)}
                  className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                    duracao === m
                      ? 'bg-sky-500 text-[#070e1b] shadow-xs'
                      : 'bg-[#12213d] text-slate-300 hover:bg-[#182c50] border border-[#1c3560]'
                  }`}
                >
                  {m} min
                </button>
              ))}
            </div>
          </div>

          {/* Preço */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Preço
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
                R$
              </span>
              <input
                type="number"
                step="0.5"
                required
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                placeholder="50"
                className="w-full bg-[#12213d] border border-[#1c3560] rounded-xl pl-10 pr-3.5 py-2.5 text-white font-bold text-sm focus:outline-hidden focus:border-sky-400"
              />
            </div>
          </div>

          {/* Aparência matching exact prompt */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Aparência
            </label>
            <p className="text-[11px] text-slate-400 mb-2">
              Cor exibida na agenda para este serviço.
            </p>
            <div className="flex items-center gap-2">
              {colorPresets.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCor(c)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    cor === c ? 'ring-2 ring-white scale-110' : 'opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c }}
                >
                  {cor === c && <Check className="w-3.5 h-3.5 text-white drop-shadow-sm" />}
                </button>
              ))}
            </div>
          </div>

          {/* Quem atende matching exact prompt */}
          <div className="bg-[#12213d] p-3 rounded-xl border border-[#1c3560] space-y-2">
            <span className="text-slate-300 font-semibold block">Quem atende</span>
            <p className="text-[11px] text-slate-400">
              Todos os profissionais podem atender este serviço.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <div className="w-6 h-6 rounded-full bg-sky-500 text-[#070e1b] font-bold text-xs flex items-center justify-center">
                RU
              </div>
              <span className="text-xs text-white font-medium">Ruan santos</span>
            </div>
          </div>

          {/* Ativo switch matching exact prompt */}
          <div className="flex items-center justify-between bg-[#12213d] p-3 rounded-xl border border-[#1c3560]">
            <div>
              <span className="text-white font-semibold block">Ativo</span>
              <span className="text-[11px] text-slate-400">
                Visível para agendamento.
              </span>
            </div>

            <button
              type="button"
              onClick={() => setAtivo(!ativo)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                ativo ? 'bg-sky-500 justify-end' : 'bg-slate-700 justify-start'
              }`}
            >
              <div className="bg-white w-4 h-4 rounded-full shadow-md" />
            </button>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#182c50]">
            <button
              type="button"
              onClick={closeNovoServico}
              className="px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all text-xs font-semibold"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="bg-sky-500 hover:bg-sky-400 text-[#070e1b] font-bold text-xs md:text-sm px-5 py-2.5 rounded-xl transition-all shadow-md shadow-sky-500/20"
            >
              Salvar serviço
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
