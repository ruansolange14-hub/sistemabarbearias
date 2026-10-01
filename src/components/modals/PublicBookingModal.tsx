import React, { useState } from 'react';
import { useBarber } from '../../context/BarberContext';
import {
  Scissors,
  Calendar,
  Clock,
  User,
  Phone,
  CheckCircle,
  X,
  Star,
  MapPin,
  Sparkles,
  ExternalLink,
  ChevronRight,
  MessageCircle,
} from 'lucide-react';
import { Servico } from '../../types';

export const PublicBookingModal: React.FC = () => {
  const {
    isPublicBookingOpen,
    closePublicBooking,
    config,
    servicos,
    profissionais,
    addAgendamento,
    addCliente,
    clientes,
  } = useBarber();

  const [step, setStep] = useState<'servico' | 'barbeiro' | 'horario' | 'dados' | 'sucesso'>('servico');
  const [selectedServico, setSelectedServico] = useState<Servico | null>(null);
  const [selectedBarbeiro, setSelectedBarbeiro] = useState(profissionais[0]);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedHour, setSelectedHour] = useState('11:00');
  const [clienteNome, setClienteNome] = useState('');
  const [clienteTelefone, setClienteTelefone] = useState('');

  if (!isPublicBookingOpen) return null;

  const ativosServicos = servicos.filter((s) => s.ativo);

  const timeSlots = [
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
  ];

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteNome || !selectedServico) return;

    // Check/create client
    let existing = clientes.find((c) => c.nome.toLowerCase() === clienteNome.toLowerCase());
    let cliId = existing?.id;
    if (!existing) {
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
      profissionalId: selectedBarbeiro.id,
      profissionalNome: selectedBarbeiro.nome,
      servicoId: selectedServico.id,
      servicoNome: selectedServico.nome,
      data: selectedDate,
      horario: selectedHour,
      duracao: selectedServico.duracao,
      valor: selectedServico.preco,
      status: 'agendado',
      observacoes: 'Agendado pelo site online',
    });

    setStep('sucesso');
  };

  const handleReset = () => {
    setStep('servico');
    setSelectedServico(null);
    setClienteNome('');
    setClienteTelefone('');
    closePublicBooking();
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-[#0b1322] border border-sky-500/30 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl relative my-6">
        {/* Header Preview Banner */}
        <div className="bg-gradient-to-r from-[#0d1e3d] via-[#142850] to-[#0d1e3d] p-4 border-b border-[#1b325c] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-sky-300">
              Página Pública de Agendamento Online
            </span>
          </div>

          <button
            onClick={closePublicBooking}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barbershop Brand Header */}
        <div className="p-6 border-b border-[#182c50] bg-[#0c162a] text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-600 mx-auto flex items-center justify-center text-[#070e1b] shadow-lg shadow-sky-500/30 font-extrabold text-xl">
            BM
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            {config.nome}
          </h1>
          <div className="flex items-center justify-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              <strong>4.9</strong> (42 avaliações)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span>Atendimento com hora marcada</span>
            </span>
          </div>
        </div>

        {/* Stepper Content */}
        <div className="p-6">
          {step === 'servico' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm">
                  1. Escolha o serviço
                </h3>
                <span className="text-xs text-sky-400">
                  {ativosServicos.length} opções disponíveis
                </span>
              </div>

              <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                {ativosServicos.map((serv) => (
                  <button
                    key={serv.id}
                    onClick={() => {
                      setSelectedServico(serv);
                      setStep('barbeiro');
                    }}
                    className="w-full text-left bg-[#12213d] hover:bg-[#182c50] border border-[#1c3560] hover:border-sky-500/50 p-3.5 rounded-2xl transition-all flex items-center justify-between group shadow-2xs"
                  >
                    <div>
                      <h4 className="font-bold text-white text-sm group-hover:text-sky-300 transition-colors">
                        {serv.nome}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{serv.duracao} min</span>
                        </span>
                        {serv.descricao && (
                          <>
                            <span>•</span>
                            <span className="line-clamp-1">{serv.descricao}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-right flex items-center gap-3">
                      <span className="text-sm font-extrabold text-sky-400">
                        R$ {serv.preco.toFixed(2).replace('.', ',')}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'barbeiro' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm">
                  2. Escolha o profissional
                </h3>
                <button
                  onClick={() => setStep('servico')}
                  className="text-xs text-sky-400 hover:underline"
                >
                  Voltar
                </button>
              </div>

              <div className="space-y-2">
                {profissionais.map((prof) => (
                  <button
                    key={prof.id}
                    onClick={() => {
                      setSelectedBarbeiro(prof);
                      setStep('horario');
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                      selectedBarbeiro.id === prof.id
                        ? 'bg-[#182e54] border-sky-400 text-white'
                        : 'bg-[#12213d] border-[#1c3560] text-slate-300 hover:border-sky-500/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center font-bold text-xs text-[#070e1b]">
                        {prof.avatar}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">{prof.nome}</h4>
                        <span className="text-xs text-slate-400">
                          {prof.cargo || 'Especialista'}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'horario' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm">
                  3. Escolha data e horário
                </h3>
                <button
                  onClick={() => setStep('barbeiro')}
                  className="text-xs text-sky-400 hover:underline"
                >
                  Voltar
                </button>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">
                  Data desejada
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-[#12213d] border border-[#1c3560] rounded-xl px-3.5 py-2 text-white text-sm focus:outline-hidden focus:border-sky-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-2">
                  Horários livres
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedHour(time)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        selectedHour === time
                          ? 'bg-sky-500 text-[#070e1b] border-sky-400 shadow-md shadow-sky-500/20'
                          : 'bg-[#12213d] text-slate-300 border-[#1c3560] hover:border-sky-400/40'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep('dados')}
                className="w-full bg-sky-500 hover:bg-sky-400 text-[#070e1b] font-bold py-2.5 rounded-xl text-sm transition-all mt-3"
              >
                Avançar para confirmação
              </button>
            </div>
          )}

          {step === 'dados' && (
            <form onSubmit={handleConfirmBooking} className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm">
                  4. Seus dados de contato
                </h3>
                <button
                  type="button"
                  onClick={() => setStep('horario')}
                  className="text-xs text-sky-400 hover:underline"
                >
                  Voltar
                </button>
              </div>

              {/* Order preview */}
              <div className="bg-[#12213d] p-3.5 rounded-2xl border border-[#1c3560] space-y-1">
                <div className="flex justify-between font-bold text-white text-xs">
                  <span>{selectedServico?.nome}</span>
                  <span className="text-sky-400">
                    R$ {selectedServico?.preco.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Com {selectedBarbeiro.nome} · {selectedDate} às {selectedHour}
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Seu nome completo *
                </label>
                <input
                  type="text"
                  required
                  value={clienteNome}
                  onChange={(e) => setClienteNome(e.target.value)}
                  placeholder="Ex: Gabriel Moreira"
                  className="w-full bg-[#12213d] border border-[#1c3560] rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:border-sky-400"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Seu WhatsApp (com DDD) *
                </label>
                <input
                  type="text"
                  required
                  value={clienteTelefone}
                  onChange={(e) => setClienteTelefone(e.target.value)}
                  placeholder="(11) 98765-4321"
                  className="w-full bg-[#12213d] border border-[#1c3560] rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:border-sky-400"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Você receberá a confirmação e lembrete do corte pelo WhatsApp.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-[#070e1b] font-extrabold py-3 rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20"
              >
                Confirmar Agendamento Agora
              </button>
            </form>
          )}

          {step === 'sucesso' && (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">
                  Agendamento Confirmado!
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Seu horário foi reservado com sucesso na {config.nome}.
                </p>
              </div>

              <div className="bg-[#12213d] p-4 rounded-2xl border border-[#1c3560] text-xs text-slate-300 space-y-2 max-w-sm mx-auto text-left">
                <div className="flex justify-between">
                  <span className="text-slate-400">Cliente:</span>
                  <span className="font-bold text-white">{clienteNome}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Serviço:</span>
                  <span className="font-semibold text-white">{selectedServico?.nome}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Profissional:</span>
                  <span className="text-white">{selectedBarbeiro.nome}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Data e Hora:</span>
                  <span className="font-bold text-sky-400">
                    {selectedDate} às {selectedHour}
                  </span>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="bg-sky-500 hover:bg-sky-400 text-[#070e1b] font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-md shadow-sky-500/20"
              >
                Voltar ao Painel da Barbearia
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
