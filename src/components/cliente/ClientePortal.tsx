import React, { useState, useMemo } from 'react';
import { useBarber } from '../../context/BarberContext';
import { useSuperAdmin } from '../../context/SuperAdminContext';
import { Cliente, Agendamento, Servico, Profissional } from '../../types';
import {
  Scissors,
  Calendar,
  Clock,
  User,
  Phone,
  CheckCircle2,
  XCircle,
  Award,
  Gift,
  MapPin,
  Star,
  ExternalLink,
  ChevronRight,
  MessageCircle,
  Plus,
  RefreshCw,
  LogOut,
  CalendarDays,
  Shield,
  Smartphone,
  ArrowRight,
  Copy,
  Check,
  Sparkles,
  Ticket,
  ChevronLeft,
} from 'lucide-react';

interface ClientePortalProps {
  onBackToBarbearia: () => void;
  onOpenSuperAdmin: () => void;
}

export const ClientePortal: React.FC<ClientePortalProps> = ({
  onBackToBarbearia,
  onOpenSuperAdmin,
}) => {
  const {
    config,
    clientes,
    agendamentos,
    servicos,
    profissionais,
    cupons,
    addAgendamento,
    updateAgendamentoStatus,
    addCliente,
  } = useBarber();

  // Selected or identified client
  const [currentClientePhone, setCurrentClientePhone] = useState<string>(() => {
    return localStorage.getItem('barberpilot_active_client_phone') || (clientes[0]?.telefone || '');
  });

  const [activeTab, setActiveTab] = useState<'agendamentos' | 'novo' | 'fidelidade' | 'perfil'>('agendamentos');

  // Login/Identification Form State
  const [loginPhoneInput, setLoginPhoneInput] = useState('');
  const [loginNameInput, setLoginNameInput] = useState('');
  const [isIdentifying, setIsIdentifying] = useState(false);

  // New Booking Flow in Client Area
  const [novoStep, setNovoStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedServico, setSelectedServico] = useState<Servico | null>(null);
  const [selectedProfissional, setSelectedProfissional] = useState<Profissional | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [selectedHorario, setSelectedHorario] = useState<string>('15:00');
  const [bookingSuccess, setBookingSuccess] = useState<Agendamento | null>(null);

  // Cancellation Modal
  const [agendamentoParaCancelar, setAgendamentoParaCancelar] = useState<Agendamento | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [cupomResgatado, setCupomResgatado] = useState<string | null>(null);

  // Find active client object
  const currentCliente = useMemo(() => {
    if (!currentClientePhone) return clientes[0] || null;
    const cleanCurrent = currentClientePhone.replace(/\D/g, '');
    return (
      clientes.find((c) => c.telefone.replace(/\D/g, '') === cleanCurrent) ||
      clientes.find((c) => c.telefone === currentClientePhone) ||
      clientes[0] ||
      null
    );
  }, [clientes, currentClientePhone]);

  // Client's appointments
  const clientAppointments = useMemo(() => {
    if (!currentCliente) return [];
    return agendamentos
      .filter(
        (a) =>
          a.clienteId === currentCliente.id ||
          a.clienteNome.toLowerCase() === currentCliente.nome.toLowerCase() ||
          a.clienteTelefone.replace(/\D/g, '') === currentCliente.telefone.replace(/\D/g, '')
      )
      .sort((a, b) => b.data.localeCompare(a.data) || b.horario.localeCompare(a.horario));
  }, [agendamentos, currentCliente]);

  const upcomingAppointments = useMemo(() => {
    return clientAppointments.filter((a) => a.status === 'agendado');
  }, [clientAppointments]);

  const pastAppointments = useMemo(() => {
    return clientAppointments.filter((a) => a.status === 'atendido' || a.status === 'cancelado');
  }, [clientAppointments]);

  const handleSelectClient = (cli: Cliente) => {
    setCurrentClientePhone(cli.telefone);
    localStorage.setItem('barberpilot_active_client_phone', cli.telefone);
    setIsIdentifying(false);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPhoneInput.trim()) return;

    let found = clientes.find(
      (c) => c.telefone.replace(/\D/g, '') === loginPhoneInput.replace(/\D/g, '')
    );

    if (!found) {
      // Auto-register new client
      found = addCliente({
        nome: loginNameInput.trim() || 'Cliente Visitante',
        telefone: loginPhoneInput.trim(),
        status: 'ativo',
      });
    }

    handleSelectClient(found);
    setLoginPhoneInput('');
    setLoginNameInput('');
  };

  const handleConfirmNewBooking = () => {
    if (!currentCliente || !selectedServico || !selectedProfissional) return;

    const newAg: Omit<Agendamento, 'id'> = {
      clienteId: currentCliente.id,
      clienteNome: currentCliente.nome,
      clienteTelefone: currentCliente.telefone,
      profissionalId: selectedProfissional.id,
      profissionalNome: selectedProfissional.nome,
      servicoId: selectedServico.id,
      servicoNome: selectedServico.nome,
      data: selectedDate,
      horario: selectedHorario,
      duracao: selectedServico.duracao,
      valor: selectedServico.preco,
      status: 'agendado',
      observacoes: 'Agendado pelo Portal do Cliente',
    };

    addAgendamento(newAg);

    // Mock representation of the newly created appointment
    const createdAg: Agendamento = {
      ...newAg,
      id: `ag-${Date.now()}`,
    };

    setBookingSuccess(createdAg);
    setNovoStep(4);
    setFeedbackMsg('Agendamento realizado com sucesso!');
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const handleConfirmarCancelamento = () => {
    if (agendamentoParaCancelar) {
      updateAgendamentoStatus(agendamentoParaCancelar.id, 'cancelado');
      setAgendamentoParaCancelar(null);
      setFeedbackMsg('Agendamento cancelado com sucesso.');
      setTimeout(() => setFeedbackMsg(null), 3000);
    }
  };

  const handleRebook = (servicoNome: string, profissionalNome: string) => {
    const serv = servicos.find((s) => s.nome === servicoNome) || servicos[0];
    const prof = profissionais.find((p) => p.nome === profissionalNome) || profissionais[0];
    setSelectedServico(serv);
    setSelectedProfissional(prof);
    setNovoStep(3);
    setActiveTab('novo');
  };

  const handleResgatarPremio = (pontosNecessarios: number, tituloPremio: string) => {
    if (!currentCliente) return;
    if (currentCliente.pontosFidelidade < pontosNecessarios) {
      alert(`Você precisa de ${pontosNecessarios} pontos. Atualmente você tem ${currentCliente.pontosFidelidade} pontos.`);
      return;
    }

    const codigoGerado = `PREMIO-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    currentCliente.pontosFidelidade -= pontosNecessarios;
    setCupomResgatado(codigoGerado);
    setFeedbackMsg(`Parabéns! Você resgatou "${tituloPremio}". Use o cupom ${codigoGerado} no seu próximo corte.`);
  };

  // Google Calendar helper link generator
  const getGoogleCalendarUrl = (ag: Agendamento) => {
    const startTime = `${ag.data.replace(/-/g, '')}T${ag.horario.replace(':', '')}00`;
    const endTimeHour = parseInt(ag.horario.split(':')[0]) + 1;
    const endTime = `${ag.data.replace(/-/g, '')}T${String(endTimeHour).padStart(2, '0')}${ag.horario.split(':')[1]}00`;
    const title = encodeURIComponent(`${ag.servicoNome} na ${config.nome}`);
    const details = encodeURIComponent(`Atendimento com o profissional ${ag.profissionalNome}. Valor: R$ ${ag.valor.toFixed(2)}.`);
    const location = encodeURIComponent(`${config.nome}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${details}&location=${location}`;
  };

  const timeSlots = [
    '09:00', '09:45', '10:30', '11:15', '12:00',
    '13:30', '14:15', '15:00', '15:45', '16:30',
    '17:15', '18:00', '18:45',
  ];

  return (
    <div className="min-h-screen bg-[#0f1218] text-slate-100 flex flex-col font-sans">
      {/* Top Ambient Bar */}
      <div className="bg-gradient-to-r from-[#121825] via-[#162238] to-[#121825] border-b border-blue-900/40 px-4 py-2 text-xs text-slate-200 flex items-center justify-between z-30">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="font-medium text-slate-300">
            Portal Oficial do Cliente • <strong className="text-white">{config.nome}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackToBarbearia}
            className="text-xs bg-[#121622] hover:bg-[#1a2235] text-slate-300 hover:text-white px-3 py-1 rounded-lg border border-[#222a3d] transition-colors flex items-center gap-1.5"
          >
            <Scissors className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Painel da Barbearia</span>
          </button>

          <button
            onClick={onOpenSuperAdmin}
            className="text-xs bg-blue-950/80 hover:bg-blue-900 text-blue-300 px-2.5 py-1 rounded-lg border border-blue-800/60 transition-colors flex items-center gap-1"
            title="Acesso Super Admin"
          >
            <Shield className="w-3 h-3 text-blue-400" />
            <span className="hidden sm:inline">Super Admin</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* Feedback Alert Toast */}
        {feedbackMsg && (
          <div className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-2xl text-xs flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="font-semibold">{feedbackMsg}</span>
            </div>
            <button onClick={() => setFeedbackMsg(null)} className="text-emerald-400 hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* Barbershop Brand Header Card */}
        <section className="bg-[#161a25] border border-[#242c3f] rounded-3xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-blue-700 to-blue-950 flex items-center justify-center text-white font-extrabold text-xl shadow-md border border-blue-600/40 flex-shrink-0">
                BP
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    {config.nome}
                  </h1>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Aberto hoje
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-amber-400 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    4.9 (128 avaliações)
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    <span>São Paulo, SP</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>09:00 às 19:00</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp link to Barbershop */}
            <a
              href={`https://wa.me/55${config.telefoneAdmin.replace(/\D/g, '') || '11999999999'}?text=Olá!%20Sou%20cliente%20da%20barbearia%20e%20gostaria%20de%20uma%20informação.`}
              target="_blank"
              rel="noreferrer"
              className="bg-[#121622] hover:bg-[#1a2235] text-emerald-400 hover:text-emerald-300 border border-[#222a3d] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 self-start sm:self-auto"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp da Barbearia</span>
            </a>
          </div>

          {/* Active Client Bar / Identification Box */}
          <div className="mt-5 pt-4 border-t border-[#202738] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center font-bold text-white text-xs border border-blue-400/40">
                {currentCliente?.nome.substring(0, 2).toUpperCase() || 'CL'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">
                    Olá, {currentCliente?.nome || 'Visitante'}
                  </span>
                  <span className="text-[10px] text-blue-400 font-mono">
                    {currentCliente?.telefone}
                  </span>
                </div>
                <div className="text-slate-400 text-[11px] flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-blue-400" />
                  <span>
                    Saldo Fidelidade:{' '}
                    <strong className="text-white font-bold">
                      {currentCliente?.pontosFidelidade || 0} pontos
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsIdentifying(!isIdentifying)}
                className="bg-[#121622] hover:bg-[#1a2235] text-slate-300 hover:text-white px-3 py-1.5 rounded-xl border border-[#222a3d] text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
                <span>Trocar Cliente / Login</span>
              </button>
            </div>
          </div>

          {/* Identification Dropdown / Switcher */}
          {isIdentifying && (
            <div className="mt-4 p-4 bg-[#121622] border border-[#222a3d] rounded-2xl space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-xs">
                  Identificação do Cliente
                </h4>
                <button
                  onClick={() => setIsIdentifying(false)}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  Fechar ✕
                </button>
              </div>

              {/* Quick 1-click Demo Selection */}
              <div>
                <label className="text-[11px] text-slate-400 block mb-1.5 font-medium">
                  Selecione um cliente cadastrado para testar:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {clientes.slice(0, 6).map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleSelectClient(c)}
                      className={`text-left p-2.5 rounded-xl border transition-all text-xs ${
                        currentCliente?.id === c.id
                          ? 'bg-blue-900/40 border-blue-600 text-white font-bold'
                          : 'bg-[#161a25] border-[#222a3d] text-slate-300 hover:border-blue-700/50'
                      }`}
                    >
                      <div className="font-semibold truncate">{c.nome}</div>
                      <div className="text-[10px] text-blue-400 font-mono">
                        {c.pontosFidelidade} pontos • {c.telefone}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Or enter phone */}
              <form onSubmit={handleLoginSubmit} className="pt-2 border-t border-[#202738] flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Nome do cliente"
                  value={loginNameInput}
                  onChange={(e) => setLoginNameInput(e.target.value)}
                  className="bg-[#161a25] border border-[#242c3f] rounded-xl px-3 py-2 text-white text-xs focus:outline-hidden focus:border-blue-500 flex-1"
                />
                <input
                  type="text"
                  required
                  placeholder="WhatsApp: (11) 98888-7777"
                  value={loginPhoneInput}
                  onChange={(e) => setLoginPhoneInput(e.target.value)}
                  className="bg-[#161a25] border border-[#242c3f] rounded-xl px-3 py-2 text-white text-xs focus:outline-hidden focus:border-blue-500 flex-1"
                />
                <button
                  type="submit"
                  className="bg-blue-700 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow-md shadow-blue-950/40"
                >
                  Entrar
                </button>
              </form>
            </div>
          )}
        </section>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 bg-[#161a25] border border-[#242c3f] p-1.5 rounded-2xl overflow-x-auto text-xs font-semibold">
          {[
            { id: 'agendamentos', label: 'Meus Agendamentos', count: upcomingAppointments.length, icon: CalendarDays },
            { id: 'novo', label: 'Novo Agendamento', icon: Plus },
            { id: 'fidelidade', label: 'Clube Fidelidade', icon: Award },
            { id: 'perfil', label: 'Meu Perfil', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (tab.id === 'novo' && novoStep === 4) setNovoStep(1);
                }}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-700 text-white shadow-xs font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-[#1a2235]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-blue-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] flex items-center justify-center font-bold">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* TAB 1: MEUS AGENDAMENTOS */}
        {activeTab === 'agendamentos' && (
          <div className="space-y-6">
            {/* Próximos Agendamentos */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span>Próximos Agendamentos</span>
                </h2>

                <button
                  onClick={() => {
                    setActiveTab('novo');
                    setNovoStep(1);
                  }}
                  className="bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Novo Agendamento</span>
                </button>
              </div>

              {upcomingAppointments.length === 0 ? (
                <div className="bg-[#161a25] border border-[#242c3f] rounded-3xl p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#121622] border border-[#222a3d] text-slate-500 mx-auto flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Nenhum horário marcado no momento</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Garanta seu horário com seu barbeiro favorito em poucos segundos.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('novo');
                      setNovoStep(1);
                    }}
                    className="bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md shadow-blue-950/40 inline-flex items-center gap-2"
                  >
                    <span>Agendar Meu Corte Agora</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingAppointments.map((ag) => (
                    <div
                      key={ag.id}
                      className="bg-gradient-to-br from-[#161a25] to-[#121622] border border-blue-600/40 rounded-3xl p-5 sm:p-6 shadow-md shadow-blue-950/20 space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-900/50 text-blue-300 border border-blue-700/60">
                              Agendamento Confirmado
                            </span>
                            <span className="text-xs text-slate-400">
                              Duração: {ag.duracao} min
                            </span>
                          </div>

                          <h3 className="text-lg font-extrabold text-white">
                            {ag.servicoNome}
                          </h3>

                          <div className="text-xs text-slate-300 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-blue-400" />
                            <span>Profissional: <strong className="text-white">{ag.profissionalNome}</strong></span>
                          </div>
                        </div>

                        {/* Date and Time Box */}
                        <div className="bg-[#121622] border border-[#222a3d] p-3 rounded-2xl text-center min-w-[140px]">
                          <span className="text-[11px] text-blue-400 font-bold block uppercase tracking-wider">
                            Horário Marcado
                          </span>
                          <span className="text-2xl font-black text-white block mt-0.5">
                            {ag.horario}
                          </span>
                          <span className="text-[11px] text-slate-300 font-mono block">
                            {ag.data}
                          </span>
                        </div>
                      </div>

                      {/* Action buttons on active appointment */}
                      <div className="pt-3 border-t border-[#202738] flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-white text-sm">
                            R$ {ag.valor.toFixed(2).replace('.', ',')}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            • Pagamento na barbearia
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {/* Google Calendar Link */}
                          <a
                            href={getGoogleCalendarUrl(ag)}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-[#182032] hover:bg-[#202c45] text-slate-200 border border-[#2c3852] px-3 py-1.5 rounded-xl font-semibold transition-colors flex items-center gap-1.5"
                          >
                            <Calendar className="w-3.5 h-3.5 text-blue-400" />
                            <span>Google Agenda</span>
                          </a>

                          {/* Como Chegar */}
                          <a
                            href="https://maps.google.com"
                            target="_blank"
                            rel="noreferrer"
                            className="bg-[#182032] hover:bg-[#202c45] text-slate-200 border border-[#2c3852] px-3 py-1.5 rounded-xl font-semibold transition-colors flex items-center gap-1.5"
                          >
                            <MapPin className="w-3.5 h-3.5 text-blue-400" />
                            <span>Como Chegar</span>
                          </a>

                          {/* Cancelar */}
                          <button
                            onClick={() => setAgendamentoParaCancelar(ag)}
                            className="bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 px-3 py-1.5 rounded-xl font-semibold transition-colors flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5 text-rose-400" />
                            <span>Cancelar</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Histórico Anterior */}
            <div className="space-y-3 pt-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Histórico de Atendimentos Anteriores</span>
              </h2>

              {pastAppointments.length === 0 ? (
                <div className="bg-[#161a25] border border-[#242c3f] rounded-2xl p-6 text-center text-xs text-slate-400">
                  Nenhum atendimento anterior registrado ainda.
                </div>
              ) : (
                <div className="bg-[#161a25] border border-[#242c3f] rounded-2xl divide-y divide-[#202738] overflow-hidden">
                  {pastAppointments.map((ag) => (
                    <div
                      key={ag.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-[#1a2030] transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">
                            {ag.servicoNome}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              ag.status === 'atendido'
                                ? 'bg-emerald-500/15 text-emerald-400'
                                : 'bg-slate-700 text-slate-400'
                            }`}
                          >
                            {ag.status === 'atendido' ? 'Concluído' : 'Cancelado'}
                          </span>
                        </div>
                        <div className="text-slate-400 text-[11px]">
                          Profissional: {ag.profissionalNome} • R$ {ag.valor.toFixed(2).replace('.', ',')}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono text-slate-300 text-[11px]">
                          {ag.data} às {ag.horario}
                        </span>

                        <button
                          onClick={() => handleRebook(ag.servicoNome, ag.profissionalNome)}
                          className="bg-[#121622] hover:bg-[#182030] text-blue-300 border border-[#222a3d] px-3 py-1.5 rounded-xl font-semibold transition-colors flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3 text-blue-400" />
                          <span>Repetir</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: NOVO AGENDAMENTO RÁPIDO */}
        {activeTab === 'novo' && (
          <div className="bg-[#161a25] border border-[#242c3f] rounded-3xl p-5 sm:p-6 shadow-sm space-y-6">
            {/* Stepper Header */}
            <div className="border-b border-[#202738] pb-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-blue-400" />
                  <span>Novo Agendamento</span>
                </h2>
                <span className="text-xs text-blue-400 font-mono">
                  Etapa {novoStep} de 4
                </span>
              </div>

              {/* Progress bars */}
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((s) => (
                  <div
                    key={s}
                    className={`h-1.5 rounded-full transition-all ${
                      novoStep >= s ? 'bg-blue-600' : 'bg-[#222a3d]'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* STEP 1: ESCOLHER SERVIÇO */}
            {novoStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">Escolha o serviço desejado</h3>
                  <p className="text-xs text-slate-400">
                    Selecione um corte, barba ou combo especial da barbearia.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {servicos.filter((s) => s.ativo).map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSelectedServico(s);
                        setNovoStep(2);
                      }}
                      className={`text-left p-4 rounded-2xl border transition-all space-y-2 group ${
                        selectedServico?.id === s.id
                          ? 'bg-blue-900/30 border-blue-600 ring-1 ring-blue-500'
                          : 'bg-[#121622] border-[#222a3d] hover:border-blue-700/60'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-bold text-white text-sm group-hover:text-blue-300 transition-colors">
                          {s.nome}
                        </span>
                        <span className="font-extrabold text-white text-sm">
                          R$ {s.preco.toFixed(2).replace('.', ',')}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {s.duracao} min
                        </span>
                        <span className="text-[10px] text-blue-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          Escolher <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: ESCOLHER PROFISSIONAL */}
            {novoStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold text-white">Escolha o Barbeiro</h3>
                    <p className="text-xs text-slate-400">
                      Serviço: <strong className="text-white">{selectedServico?.nome}</strong> (R$ {selectedServico?.preco.toFixed(2).replace('.', ',')})
                    </p>
                  </div>
                  <button
                    onClick={() => setNovoStep(1)}
                    className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Voltar
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {profissionais.filter((p) => p.ativo).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedProfissional(p);
                        setNovoStep(3);
                      }}
                      className={`text-left p-4 rounded-2xl border transition-all flex items-center gap-3.5 group ${
                        selectedProfissional?.id === p.id
                          ? 'bg-blue-900/30 border-blue-600 ring-1 ring-blue-500'
                          : 'bg-[#121622] border-[#222a3d] hover:border-blue-700/60'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-700 to-blue-950 flex items-center justify-center font-bold text-white text-sm border border-blue-500/40 flex-shrink-0">
                        {p.avatar || 'BR'}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <span className="font-bold text-white text-sm block group-hover:text-blue-300 transition-colors">
                          {p.nome}
                        </span>
                        <span className="text-[11px] text-slate-400 block truncate">
                          {p.cargo || 'Especialista em Corte & Barba'}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">
                          ✓ Disponível hoje
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: ESCOLHER DATA E HORÁRIO */}
            {novoStep === 3 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold text-white">Escolha Data e Horário</h3>
                    <p className="text-xs text-slate-400">
                      Barbeiro: <strong className="text-white">{selectedProfissional?.nome}</strong> • {selectedServico?.nome}
                    </p>
                  </div>
                  <button
                    onClick={() => setNovoStep(2)}
                    className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Voltar
                  </button>
                </div>

                {/* Date Picker */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Data do Agendamento:
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-[#121622] border border-[#222a3d] rounded-xl px-4 py-2.5 text-white text-xs focus:outline-hidden focus:border-blue-500 w-full sm:w-auto"
                  />
                </div>

                {/* Time Slots */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-2">
                    Horários Disponíveis:
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2">
                    {timeSlots.map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setSelectedHorario(h)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                          selectedHorario === h
                            ? 'bg-blue-700 text-white shadow-md shadow-blue-950/40 ring-1 ring-blue-400'
                            : 'bg-[#121622] text-slate-300 hover:text-white border border-[#222a3d] hover:border-blue-700/50'
                        }`}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary before confirm */}
                <div className="bg-[#121622] p-4 rounded-2xl border border-[#222a3d] space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Cliente:</span>
                    <strong className="text-white">{currentCliente?.nome}</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Serviço:</span>
                    <strong className="text-white">{selectedServico?.nome} ({selectedServico?.duracao} min)</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Barbeiro:</span>
                    <strong className="text-white">{selectedProfissional?.nome}</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Data e Horário:</span>
                    <strong className="text-blue-400">{selectedDate} às {selectedHorario}</strong>
                  </div>
                  <div className="flex justify-between text-slate-200 pt-2 border-t border-[#202738] font-bold">
                    <span>Total a pagar na barbearia:</span>
                    <span className="text-base text-white">R$ {selectedServico?.preco.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setNovoStep(2)}
                    className="px-4 py-2 text-slate-400 hover:text-white text-xs"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={handleConfirmNewBooking}
                    className="bg-blue-700 hover:bg-blue-600 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-md shadow-blue-950/40 transition-all flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Confirmar Agendamento</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: SUCESSO */}
            {novoStep === 4 && bookingSuccess && (
              <div className="text-center py-6 space-y-5 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold text-white">
                    Agendamento Confirmado!
                  </h3>
                  <p className="text-xs text-slate-400">
                    Seu horário foi reservado com sucesso no sistema da barbearia.
                  </p>
                </div>

                <div className="bg-[#121622] p-4 rounded-2xl border border-[#222a3d] text-xs text-left space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Barbearia:</span>
                    <strong className="text-white">{config.nome}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Serviço:</span>
                    <strong className="text-white">{bookingSuccess.servicoNome}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Barbeiro:</span>
                    <strong className="text-white">{bookingSuccess.profissionalNome}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Data & Hora:</span>
                    <strong className="text-blue-400">{bookingSuccess.data} às {bookingSuccess.horario}</strong>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t border-[#202738]">
                    <span className="text-slate-200">Valor:</span>
                    <span className="text-emerald-400">R$ {bookingSuccess.valor.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                  <a
                    href={getGoogleCalendarUrl(bookingSuccess)}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#182032] hover:bg-[#202c45] text-slate-200 border border-[#2c3852] px-4 py-2.5 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span>Salvar na Google Agenda</span>
                  </a>

                  <button
                    onClick={() => {
                      setActiveTab('agendamentos');
                      setNovoStep(1);
                    }}
                    className="bg-blue-700 hover:bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md shadow-blue-950/40 transition-all"
                  >
                    Ver Meus Agendamentos
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CLUBE FIDELIDADE */}
        {activeTab === 'fidelidade' && (
          <div className="space-y-6">
            {/* Loyalty Card Visual */}
            <div className="bg-gradient-to-br from-[#121825] via-[#17223b] to-[#121825] border border-blue-600/50 rounded-3xl p-6 shadow-xl shadow-blue-950/20 space-y-6 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400 block">
                    CARTÃO VIP DE FIDELIDADE
                  </span>
                  <h3 className="text-2xl font-black text-white">
                    {currentCliente?.nome}
                  </h3>
                  <p className="text-xs text-slate-300">
                    A cada R$ 5,00 em serviços concluídos, você acumula 1 ponto no clube.
                  </p>
                </div>

                <div className="bg-[#121622] border border-[#242c3f] px-5 py-3 rounded-2xl text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    SEU SALDO ATUAL
                  </span>
                  <span className="text-3xl font-black text-white block mt-0.5">
                    {currentCliente?.pontosFidelidade || 0}
                  </span>
                  <span className="text-[10px] text-blue-400 font-semibold block">
                    pontos acumulados
                  </span>
                </div>
              </div>

              {/* Stamp Grid Simulation (10 stamps) */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs text-slate-300 font-semibold">
                  <span>Cartela de Selos Digital</span>
                  <span>{Math.min(10, Math.floor((currentCliente?.pontosFidelidade || 0) / 10))}/10 selos</span>
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                    const isStamped = (currentCliente?.pontosFidelidade || 0) >= num * 10;
                    return (
                      <div
                        key={num}
                        className={`h-12 rounded-xl border flex flex-col items-center justify-center transition-all ${
                          isStamped
                            ? 'bg-blue-700/40 border-blue-500 text-blue-300 shadow-sm'
                            : 'bg-[#121622] border-[#222a3d] text-slate-600'
                        }`}
                      >
                        <Scissors className={`w-4 h-4 ${isStamped ? 'text-blue-400' : 'text-slate-600'}`} />
                        <span className="text-[9px] font-bold mt-0.5">{num}º</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Cupom resgatado banner */}
            {cupomResgatado && (
              <div className="bg-emerald-500/15 border border-emerald-500/40 p-4 rounded-2xl text-xs text-emerald-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-emerald-400" />
                  <div>
                    <span className="font-bold block">Seu código de desconto resgatado:</span>
                    <span className="font-mono text-base font-extrabold text-white">{cupomResgatado}</span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-300">Apresente na hora de pagar!</span>
              </div>
            )}

            {/* Prêmios para Resgate */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Gift className="w-4 h-4 text-blue-400" />
                <span>Prêmios & Vantagens Disponíveis</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  {
                    titulo: 'R$ 15,00 de Desconto',
                    pontos: 50,
                    desc: 'Desconto imediato em qualquer serviço de corte ou barba.',
                  },
                  {
                    titulo: 'Corte Masculino Cortesia',
                    pontos: 100,
                    desc: 'Seu corte de cabelo totalmente gratuito por nossa conta.',
                  },
                  {
                    titulo: 'Barba Terapia Completa',
                    pontos: 120,
                    desc: 'Toalha quente, alinhamento navalhado e óleo essencial.',
                  },
                  {
                    titulo: 'Combo VIP Completo',
                    pontos: 180,
                    desc: 'Cabelo + Barba + Sobrancelha + Bebida cortesia.',
                  },
                ].map((premio, idx) => {
                  const podeResgatar = (currentCliente?.pontosFidelidade || 0) >= premio.pontos;
                  return (
                    <div
                      key={idx}
                      className="bg-[#161a25] border border-[#242c3f] rounded-2xl p-4 flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-start justify-between">
                          <h4 className="font-bold text-white text-sm">{premio.titulo}</h4>
                          <span className="text-[10px] font-extrabold text-blue-400 bg-blue-950/70 border border-blue-800/60 px-2 py-0.5 rounded-full">
                            {premio.pontos} pts
                          </span>
                        </div>
                        <p className="text-slate-400 text-[11px] leading-relaxed">
                          {premio.desc}
                        </p>
                      </div>

                      <button
                        onClick={() => handleResgatarPremio(premio.pontos, premio.titulo)}
                        disabled={!podeResgatar}
                        className={`w-full py-2 rounded-xl font-bold text-xs transition-all ${
                          podeResgatar
                            ? 'bg-blue-700 hover:bg-blue-600 text-white shadow-md shadow-blue-950/30'
                            : 'bg-[#121622] text-slate-500 border border-[#222a3d] cursor-not-allowed'
                        }`}
                      >
                        {podeResgatar ? 'Resgatar Recompensa' : `Faltam ${premio.pontos - (currentCliente?.pontosFidelidade || 0)} pts`}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: MEU PERFIL */}
        {activeTab === 'perfil' && (
          <div className="bg-[#161a25] border border-[#242c3f] rounded-3xl p-5 sm:p-6 shadow-sm space-y-5 text-xs">
            <div className="border-b border-[#202738] pb-3">
              <h3 className="font-bold text-white text-base">Meus Dados Cadastrais</h3>
              <p className="text-slate-400 text-xs mt-0.5">
                Mantenha suas informações atualizadas para receber lembretes de horário e promoções de aniversário.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={currentCliente?.nome || ''}
                  readOnly
                  className="w-full bg-[#121622] border border-[#222a3d] rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">WhatsApp</label>
                <input
                  type="text"
                  value={currentCliente?.telefone || ''}
                  readOnly
                  className="w-full bg-[#121622] border border-[#222a3d] rounded-xl px-3.5 py-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">E-mail</label>
                <input
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  defaultValue={currentCliente?.email || ''}
                  className="w-full bg-[#121622] border border-[#222a3d] rounded-xl px-3.5 py-2.5 text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Data de Aniversário</label>
                <input
                  type="date"
                  defaultValue={currentCliente?.aniversario || '1998-05-20'}
                  className="w-full bg-[#121622] border border-[#222a3d] rounded-xl px-3.5 py-2.5 text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            <div className="bg-[#121622] p-4 rounded-2xl border border-[#222a3d] space-y-1">
              <span className="font-bold text-white block">Benefício de Aniversário 🎂</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Clientes cadastrados recebem automaticamente uma mensagem especial no WhatsApp durante a semana do aniversário com corte ou barba com 50% de desconto!
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  setFeedbackMsg('Perfil atualizado com sucesso!');
                  setTimeout(() => setFeedbackMsg(null), 2500);
                }}
                className="bg-blue-700 hover:bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md shadow-blue-950/40 transition-all"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Confirmation Modal: Cancelar Agendamento */}
      {agendamentoParaCancelar && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#161a25] border border-rose-500/40 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400 border-b border-[#242c3f] pb-3">
              <XCircle className="w-6 h-6" />
              <h3 className="font-extrabold text-white text-base">Cancelar Agendamento</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Deseja realmente cancelar seu agendamento de <strong className="text-white">{agendamentoParaCancelar.servicoNome}</strong> marcado para <strong className="text-white">{agendamentoParaCancelar.data} às {agendamentoParaCancelar.horario}</strong> com o profissional {agendamentoParaCancelar.profissionalNome}?
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#242c3f]">
              <button
                onClick={() => setAgendamentoParaCancelar(null)}
                className="px-4 py-2 text-slate-400 hover:text-white text-xs"
              >
                Não cancelar
              </button>
              <button
                onClick={handleConfirmarCancelamento}
                className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow-md shadow-rose-950/40"
              >
                Sim, cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Portal Footer with links */}
      <footer className="border-t border-[#232a3d] bg-[#121622] py-4 px-6 text-center text-xs text-slate-500 space-y-1">
        <p>
          {config.nome} • Desenvolvido com tecnologia BarberPilot SaaS
        </p>
        <div className="flex items-center justify-center gap-4 text-[11px] pt-1">
          <button onClick={onBackToBarbearia} className="text-blue-400 hover:underline">
            Painel da Barbearia
          </button>
          <span>•</span>
          <button onClick={onOpenSuperAdmin} className="text-blue-400 hover:underline">
            Painel Super Admin
          </button>
        </div>
      </footer>
    </div>
  );
};
