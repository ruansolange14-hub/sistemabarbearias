import React, { useState } from 'react';
import { useBarber } from '../../context/BarberContext';
import { UserPlus, X, ChevronDown, ChevronUp } from 'lucide-react';

export const NovoClienteModal: React.FC = () => {
  const { isNovoClienteOpen, closeNovoCliente, addCliente } = useBarber();

  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [showMaisDados, setShowMaisDados] = useState(false);
  const [email, setEmail] = useState('');
  const [aniversario, setAniversario] = useState('');
  const [endereco, setEndereco] = useState('');
  const [observacoes, setObservacoes] = useState('');

  if (!isNovoClienteOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;

    addCliente({
      nome,
      telefone: whatsapp,
      instagram,
      email,
      aniversario,
      endereco,
      observacoes,
      status: 'ativo',
    });

    closeNovoCliente();
    setNome('');
    setWhatsapp('');
    setInstagram('');
    setEmail('');
    setAniversario('');
    setEndereco('');
    setObservacoes('');
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0e192e] border border-[#1e3b6a] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative my-8">
        <div className="flex items-center justify-between border-b border-[#182c50] pb-3">
          <div>
            <h2 className="text-lg font-bold text-white">Novo cliente</h2>
            <p className="text-xs text-slate-400">Só o nome é obrigatório</p>
          </div>
          <button
            onClick={closeNovoCliente}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Nome completo *
            </label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex.: João Silva"
              className="w-full bg-[#12213d] border border-[#1c3560] rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-400 text-sm"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              WhatsApp
            </label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="(11) 91234-5678"
              className="w-full bg-[#12213d] border border-[#1c3560] rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-400 text-sm"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Usado para lembretes e mensagens automáticas.
            </p>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Instagram
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">
                @
              </span>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value.replace('@', ''))}
                placeholder="usuario"
                className="w-full bg-[#12213d] border border-[#1c3560] rounded-xl pl-8 pr-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-400 text-sm"
              />
            </div>
          </div>

          {/* Toggle Mais Dados */}
          <button
            type="button"
            onClick={() => setShowMaisDados(!showMaisDados)}
            className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1 pt-1"
          >
            <span>Mais dados (e-mail, aniversário, endereço)</span>
            {showMaisDados ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showMaisDados && (
            <div className="space-y-3 pt-2 border-t border-[#182c50] text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="joao@exemplo.com"
                  className="w-full bg-[#12213d] border border-[#1c3560] rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-sky-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Aniversário</label>
                  <input
                    type="date"
                    value={aniversario}
                    onChange={(e) => setAniversario(e.target.value)}
                    className="w-full bg-[#12213d] border border-[#1c3560] rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Endereço</label>
                  <input
                    type="text"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    placeholder="Bairro / Cidade"
                    className="w-full bg-[#12213d] border border-[#1c3560] rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-sky-400"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Observações
            </label>
            <textarea
              rows={2}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Preferências de corte, alergias, detalhes..."
              className="w-full bg-[#12213d] border border-[#1c3560] rounded-xl p-3 text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-400 text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#182c50]">
            <button
              type="button"
              onClick={closeNovoCliente}
              className="px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all text-xs font-semibold"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="bg-sky-500 hover:bg-sky-400 text-[#070e1b] font-bold text-xs md:text-sm px-5 py-2.5 rounded-xl transition-all shadow-md shadow-sky-500/20"
            >
              Cadastrar cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
