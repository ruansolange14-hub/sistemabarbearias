import React, { useState } from 'react';
import { useBarber } from '../../context/BarberContext';
import { Calendar, Clock, User, Scissors, Phone, X, Check } from 'lucide-react';

export const NovoAgendamentoModal: React.FC = () => {
  const {
    isNovoAgendamentoOpen,
    closeNovoAgendamento,
    presetHorario,
    profissionais,
    servicos,
    clientes,
    addAgendamento,
    addCliente,
  } = useBarber();

  const [clienteNome, setClienteNome] = useState('');
  const [clienteTelefone, setClienteTelefone] = useState('');
  const [profissionalId, setProfissionalId] = useState(profissionais[0]?.id || 'prof-1');
  const [servicoId, setServicoId] = useState(servicos.find((s) => s.ativo)?.id || 'serv-6');
  const [data, setData] = useState(() => new Date().toISOString().split('T')[0]);
  const [horario, setHorario] = useState(presetHorario || '10:00');
  const [observacoes, setObservacoes] = useState('');

  if (!isNovoAgendamentoOpen) return null;

  const selectedServico = servicos.find((s) => s.id === servicoId);
  const selectedProf = profissionais.find((p) => p.id === profissionalId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteNome.trim() || !selectedServico || !selectedProf) return;

    // Check if client already exists or create new
    let existingCli = clientes.find(
      (c) => c.nome.toLowerCase() === clienteNome.toLowerCase()
    );

    let cliId = existingCli?.id;
    if (!existingCli) {
      const created = addCliente({
        nome: clienteNome,
        telefone: clienteTelefone,
        status: 'ativo',
      });
      cliId = created.id;
    }

    addAgendamento({
      clienteId: cliId,
      clienteNome,
      clienteTelefone,
      profissionalId: selectedProf.id,
      profissionalNome: selectedProf.nome,
      servicoId: selectedServico.id,
      servicoNome: selectedServico.nome,
      data,
      horario,
      duracao: selectedServico.duracao,
      valor: selectedServico.preco,
      status: 'agendado',
      observacoes,
    });

    closeNovoAgendamento();
  };

  const timeOptions = [
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
  ];

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0e192e] border border-[#1e3b6a] rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative my-8">
        <div className="flex items-center justify-between border-b border-[#182c50] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-white">Novo agendamento</h2>
          </div>
          <button
            onClick={closeNovoAgendamento}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Cliente & Telefone */}
          <div className="space-y-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Cliente
              </label>
              <input
                type="text"
                required
                value={clienteNome}
                onChange={(e) => setClienteNome(e.target.value)}
                placeholder="Digite o nome..."
                list="clientes-list"
                className="w-full bg-[#12213d] border border-[#1c3560] rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-400 text-sm"
              />
              <datalist id="clientes-list">
                {clientes.map((c) => (
                  <option key={c.id} value={c.nome} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Telefone
              </label>
              <input
                type="text"
                value={clienteTelefone}
                onChange={(e) => setClienteTelefone(e.target.value)}
                placeholder="(11) 91234-5678"
                className="w-full bg-[#12213d] border border-[#1c3560] rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-400 text-sm"
              />
            </div>
          </div>

          {/* Profissional */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Profissional
            </label>
            <select
              value={profissionalId}
              onChange={(e) => setProfissionalId(e.target.value)}
              className="w-full bg-[#12213d] border border-[#1c3560] rounded-xl px-3.5 py-2.5 text-white focus:outline-hidden focus:border-sky-400 text-sm"
            >
              {profissionais.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Serviço */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Serviço
            </label>
            <select
              value={servicoId}
              onChange={(e) => setServicoId(e.target.value)}
              className="w-full bg-[#12213d] border border-[#1c3560] rounded-xl px-3.5 py-2.5 text-white focus:outline-hidden focus:border-sky-400 text-sm"
            >
              {servicos.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nome} · R$ {s.preco.toFixed(2).replace('.', ',')} ({s.duracao} min)
                </option>
              ))}
            </select>
          </div>

          {/* Data & Horário */}
          <div className="grid grid-cols-2 gap-3">
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
                Horário
              </label>
              <select
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
                className="w-full bg-[#12213d] border border-[#1c3560] rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-sky-400"
              >
                {timeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Observações (opcional)
            </label>
            <input
              type="text"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex: Cliente prefere degradê alto na navalha"
              className="w-full bg-[#12213d] border border-[#1c3560] rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-400"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#182c50]">
            <button
              type="button"
              onClick={closeNovoAgendamento}
              className="px-4 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all text-xs font-semibold"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="bg-sky-500 hover:bg-sky-400 text-[#070e1b] font-bold text-xs md:text-sm px-6 py-2.5 rounded-xl transition-all shadow-md shadow-sky-500/20"
            >
              Agendar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
