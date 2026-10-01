import React, { useState } from 'react';
import { useBarber } from '../../context/BarberContext';
import {
  Calendar as CalendarIcon,
  Plus,
  Lock,
  ChevronLeft,
  ChevronRight,
  Clock,
  Phone,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MessageCircle,
  Sparkles,
  Unlock,
} from 'lucide-react';
import { Agendamento } from '../../types';

export const AgendaView: React.FC = () => {
  const {
    agendamentos,
    profissionais,
    openNovoAgendamento,
    updateAgendamentoStatus,
    addAgendamento,
  } = useBarber();

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [blockTime, setBlockTime] = useState('12:00');
  const [blockReason, setBlockReason] = useState('Almoço / Intervalo');

  // Days list around the reference week (dom 27 - sab 3)
  const daysList = [
    { label: 'dom', dayNum: 27, dateStr: '2026-09-27' },
    { label: 'seg', dayNum: 28, dateStr: '2026-09-28' },
    { label: 'ter', dayNum: 29, dateStr: '2026-09-29' },
    { label: 'qua', dayNum: 30, dateStr: '2026-09-30' },
    { label: 'qui', dayNum: 1, dateStr: '2026-10-01' },
    { label: 'sex', dayNum: 2, dateStr: '2026-10-02' },
    { label: 'sáb', dayNum: 3, dateStr: '2026-10-03' },
  ];

  const timeSlots = [
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

  const currentProf = profissionais[0] || {
    id: 'prof-1',
    nome: 'Ruan santos',
    avatar: 'RS',
  };

  // Filter appointments for selected day
  const agendamentosDoDia = agendamentos.filter((a) => a.data === selectedDate);

  const handleBlockSlot = (e: React.FormEvent) => {
    e.preventDefault();
    addAgendamento({
      clienteNome: `[BLOQUEADO] ${blockReason}`,
      clienteTelefone: '',
      profissionalId: currentProf.id,
      profissionalNome: currentProf.nome,
      servicoId: 'bloqueio',
      servicoNome: 'Horário Bloqueado',
      data: selectedDate,
      horario: blockTime,
      duracao: 60,
      valor: 0,
      status: 'bloqueado',
      observacoes: blockReason,
    });
    setIsBlockModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Solicitações de encaixe box */}
      <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400 flex-shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs md:text-sm font-semibold text-slate-200">
              Solicitações de encaixe
            </h3>
            <p className="text-xs text-slate-400">
              Nenhuma solicitação pendente no momento.
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Quando um cliente pedir encaixe, a solicitação aparece aqui em tempo real.
            </p>
          </div>
        </div>
      </div>

      {/* Main Agenda Header & Day Strip */}
      <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-blue-400" />
              <span>Agenda</span>
            </h2>
            <p className="text-xs text-slate-400 capitalize">
              {new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}{' '}
              ·{' '}
              <span className="text-blue-400 font-semibold">
                {agendamentosDoDia.filter((a) => a.status !== 'bloqueado').length} agendamentos
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBlockModalOpen(true)}
              className="bg-[#182032] hover:bg-[#202c45] text-slate-200 border border-[#2c3852] hover:border-blue-700/60 text-xs px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 font-medium"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Bloquear</span>
            </button>

            <button
              onClick={() => openNovoAgendamento()}
              className="bg-blue-700 hover:bg-blue-600 text-white font-semibold text-xs px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-blue-950/40"
            >
              <Plus className="w-4 h-4" />
              <span>Novo agendamento</span>
            </button>
          </div>
        </div>

        {/* Days selector strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          {daysList.map((item) => {
            const isSelected = selectedDate === item.dateStr;
            const hasBooking = agendamentos.some((a) => a.data === item.dateStr);

            return (
              <button
                key={item.dateStr}
                onClick={() => setSelectedDate(item.dateStr)}
                className={`flex-1 min-w-[70px] py-2.5 px-2 rounded-xl flex flex-col items-center justify-center transition-all border ${
                  isSelected
                    ? 'bg-blue-700 text-white border-blue-600 font-bold shadow-md shadow-blue-950/40'
                    : 'bg-[#121622] hover:bg-[#182032] text-slate-300 border-[#222a3d]'
                }`}
              >
                <span
                  className={`text-[10px] uppercase tracking-wider font-semibold ${
                    isSelected ? 'text-white' : 'text-slate-400'
                  }`}
                >
                  {item.label}
                </span>
                <span className="text-base font-bold">{item.dayNum}</span>
                {hasBooking && (
                  <span
                    className={`h-1.5 w-1.5 rounded-full mt-0.5 ${
                      isSelected ? 'bg-white' : 'bg-blue-400'
                    }`}
                  />
                )}
              </button>
            );
          })}

          <button
            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            className="px-4 py-2.5 bg-[#182032] hover:bg-[#202c45] text-blue-400 border border-blue-700/40 rounded-xl text-xs font-semibold whitespace-nowrap"
          >
            Hoje
          </button>
        </div>
      </div>

      {/* Grid of Slots & Professional Table */}
      <div className="bg-[#161a25] border border-[#242c3f] rounded-xl overflow-hidden shadow-sm">
        {/* Table Header */}
        <div className="grid grid-cols-12 bg-[#121622] border-b border-[#242c3f] text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <div className="col-span-3 md:col-span-2 p-3.5 border-r border-[#242c3f] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Hora</span>
          </div>
          <div className="col-span-9 md:col-span-10 p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-950/80 text-blue-300 text-xs font-bold flex items-center justify-center border border-blue-800/60">
                {currentProf.avatar || 'RS'}
              </span>
              <span className="text-slate-200 text-sm font-semibold">
                {currentProf.nome}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-normal lowercase">
              09:00 às 19:00
            </span>
          </div>
        </div>

        {/* Time slots rows */}
        <div className="divide-y divide-[#202738]">
          {timeSlots.map((hour) => {
            const slotBooking = agendamentosDoDia.find((a) => a.horario === hour);

            return (
              <div
                key={hour}
                className="grid grid-cols-12 min-h-[64px] transition-colors hover:bg-[#182032]/40"
              >
                {/* Hour label */}
                <div className="col-span-3 md:col-span-2 p-3 border-r border-[#242c3f] text-slate-400 font-mono text-xs font-semibold flex items-center justify-between">
                  <span>{hour}</span>
                </div>

                {/* Slot content */}
                <div className="col-span-9 md:col-span-10 p-2 flex items-center">
                  {slotBooking ? (
                    slotBooking.status === 'bloqueado' ? (
                      <div className="w-full bg-amber-500/10 border border-amber-500/30 rounded-lg p-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-amber-300 font-medium">
                          <Lock className="w-4 h-4" />
                          <span>{slotBooking.clienteNome}</span>
                        </div>
                        <button
                          onClick={() => updateAgendamentoStatus(slotBooking.id, 'cancelado')}
                          className="text-slate-400 hover:text-white p-1 hover:bg-white/5 rounded"
                          title="Desbloquear horário"
                        >
                          <Unlock className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div
                        className={`w-full rounded-lg p-3 border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs transition-all ${
                          slotBooking.status === 'atendido'
                            ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                            : slotBooking.status === 'cancelado'
                            ? 'bg-rose-950/20 border-rose-500/30 text-rose-300 opacity-60'
                            : 'bg-[#182133] border-blue-800/40 text-slate-100'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">
                              {slotBooking.clienteNome}
                            </span>
                            {slotBooking.isTest && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-900/50 text-blue-300 font-medium border border-blue-700/50">
                                Teste
                              </span>
                            )}
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                slotBooking.status === 'atendido'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : slotBooking.status === 'cancelado'
                                  ? 'bg-rose-500/20 text-rose-400'
                                  : 'bg-blue-900/50 text-blue-300'
                              }`}
                            >
                              {slotBooking.status}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-slate-300">
                            <span className="font-medium text-blue-300">
                              {slotBooking.servicoNome}
                            </span>
                            <span>•</span>
                            <span>{slotBooking.duracao} min</span>
                            <span>•</span>
                            <span className="font-semibold text-white">
                              R$ {slotBooking.valor.toFixed(2).replace('.', ',')}
                            </span>
                          </div>

                          {slotBooking.clienteTelefone && (
                            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                              <Phone className="w-3 h-3" />
                              <span>{slotBooking.clienteTelefone}</span>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 self-end sm:self-center">
                          {slotBooking.clienteTelefone && (
                            <a
                              href={`https://wa.me/55${slotBooking.clienteTelefone.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 bg-[#1a2336] hover:bg-emerald-600/30 text-emerald-400 rounded-md transition-colors"
                              title="Abrir WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          )}

                          {slotBooking.status !== 'atendido' && slotBooking.status !== 'cancelado' && (
                            <>
                              <button
                                onClick={() => updateAgendamentoStatus(slotBooking.id, 'atendido')}
                                className="px-2.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 rounded-md font-medium transition-colors flex items-center gap-1"
                                title="Concluir atendimento"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Concluir</span>
                              </button>

                              <button
                                onClick={() => updateAgendamentoStatus(slotBooking.id, 'cancelado')}
                                className="px-2 py-1.5 bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 rounded-md font-medium transition-colors flex items-center gap-1"
                                title="Cancelar agendamento"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Cancelar</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )
                  ) : (
                    <button
                      onClick={() => openNovoAgendamento(hour)}
                      className="w-full h-11 border border-dashed border-[#232a3d] hover:border-blue-600/50 hover:bg-blue-900/10 rounded-lg flex items-center justify-center gap-2 text-slate-500 hover:text-blue-400 text-xs transition-all group"
                    >
                      <Plus className="w-3.5 h-3.5 transition-transform group-hover:scale-125" />
                      <span>Disponível · Agendar às {hour}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Block Slot Modal */}
      {isBlockModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#161a25] border border-[#26324b] rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#232a3d] pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Bloquear horário na agenda</span>
              </h3>
              <button
                onClick={() => setIsBlockModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBlockSlot} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">
                  Profissional
                </label>
                <input
                  type="text"
                  disabled
                  value={currentProf.nome}
                  className="w-full bg-[#121622] border border-[#242c3f] rounded-lg px-3 py-2 text-slate-300 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">
                  Horário
                </label>
                <select
                  value={blockTime}
                  onChange={(e) => setBlockTime(e.target.value)}
                  className="w-full bg-[#121622] border border-[#242c3f] rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-blue-500"
                >
                  {timeSlots.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">
                  Motivo do bloqueio
                </label>
                <input
                  type="text"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="Ex: Almoço, Manutenção, Treinamento..."
                  className="w-full bg-[#121622] border border-[#242c3f] rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#232a3d]">
                <button
                  type="button"
                  onClick={() => setIsBlockModalOpen(false)}
                  className="px-3 py-2 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-[#070e1b] font-bold px-4 py-2 rounded-lg"
                >
                  Bloquear horário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
