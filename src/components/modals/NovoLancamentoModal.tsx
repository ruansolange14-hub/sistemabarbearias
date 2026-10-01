import React, { useState } from 'react';
import { useBarber } from '../../context/BarberContext';
import { DollarSign, X } from 'lucide-react';

export const NovoLancamentoModal: React.FC = () => {
  const { isNovoLancamentoOpen, closeNovoLancamento, addLancamento } = useBarber();

  const [tipo, setTipo] = useState<'despesa' | 'receita'>('despesa');
  const [categoria, setCategoria] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState(() => new Date().toISOString().split('T')[0]);
  const [descricao, setDescricao] = useState('');

  if (!isNovoLancamentoOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valor || !descricao.trim()) return;

    addLancamento({
      tipo,
      categoria: categoria || (tipo === 'despesa' ? 'Insumos' : 'Serviço'),
      valor: parseFloat(valor) || 0,
      data,
      descricao,
    });

    closeNovoLancamento();
    setValor('');
    setDescricao('');
    setCategoria('');
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0e192e] border border-[#1e3b6a] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative my-8">
        <div className="flex items-center justify-between border-b border-[#182c50] pb-3">
          <h2 className="text-lg font-bold text-white">Novo lançamento</h2>
          <button
            onClick={closeNovoLancamento}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Tipo matching exact prompt */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Tipo
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTipo('despesa')}
                className={`py-2 rounded-xl font-bold transition-all border ${
                  tipo === 'despesa'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                    : 'bg-[#12213d] text-slate-400 border-[#1c3560] hover:text-white'
                }`}
              >
                Despesa
              </button>

              <button
                type="button"
                onClick={() => setTipo('receita')}
                className={`py-2 rounded-xl font-bold transition-all border ${
                  tipo === 'receita'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                    : 'bg-[#12213d] text-slate-400 border-[#1c3560] hover:text-white'
                }`}
              >
                Receita
              </button>
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Categoria
            </label>
            <input
              type="text"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              placeholder="Aluguel, Insumo..."
              className="w-full bg-[#12213d] border border-[#1c3560] rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-400"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Valor (R$)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="0,00"
              className="w-full bg-[#12213d] border border-[#1c3560] rounded-xl px-3.5 py-2.5 text-white font-bold text-sm focus:outline-hidden focus:border-sky-400"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Data
            </label>
            <input
              type="date"
              required
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full bg-[#12213d] border border-[#1c3560] rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-sky-400"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Descrição
            </label>
            <input
              type="text"
              required
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Pagamento fornecedor de lâminas"
              className="w-full bg-[#12213d] border border-[#1c3560] rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-400"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#182c50]">
            <button
              type="button"
              onClick={closeNovoLancamento}
              className="px-4 py-2 rounded-xl text-slate-300 hover:text-white text-xs font-semibold"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="bg-sky-500 hover:bg-sky-400 text-[#070e1b] font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md shadow-sky-500/20"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
