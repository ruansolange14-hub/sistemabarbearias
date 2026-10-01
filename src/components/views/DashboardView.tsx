import React, { useState, useEffect } from 'react';
import { useBarber } from '../../context/BarberContext';
import {
  Calendar,
  UserPlus,
  Clock,
  ExternalLink,
  Copy,
  Check,
  TrendingUp,
  AlertTriangle,
  Eye,
  Target,
  Users,
  Award,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    config,
    setActiveView,
    profissionais,
    servicos,
    clientes,
    agendamentos,
    lancamentos,
    openNovoAgendamento,
    openNovoCliente,
    openPublicBooking,
    fazerAgendamentoTeste,
    copiarLinkAgenda,
    linkCopiadoToast,
  } = useBarber();

  const [currentDateTime, setCurrentDateTime] = useState<string>('');
  const [greeting, setGreeting] = useState<string>('Boa noite');
  const [diaSemana, setDiaSemana] = useState<string>('terça-feira');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format: "29 de set. de 2026 | 23:59:19"
      const datePart = now.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      const timePart = now.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setCurrentDateTime(`${datePart} | ${timePart}`);

      const hour = now.getHours();
      if (hour >= 5 && hour < 12) setGreeting('Bom dia');
      else if (hour >= 12 && hour < 18) setGreeting('Boa tarde');
      else setGreeting('Boa noite');

      const weekday = now.toLocaleDateString('pt-BR', { weekday: 'long' });
      setDiaSemana(weekday);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate stats from actual state
  const hojeStr = new Date().toISOString().split('T')[0];
  const agendamentosHoje = agendamentos.filter((a) => a.data === hojeStr);
  const atendidosHoje = agendamentosHoje.filter((a) => a.status === 'atendido');
  const receitaHoje = atendidosHoje.reduce((sum, a) => sum + a.valor, 0);
  const canceladosFaltasHoje = agendamentosHoje.filter(
    (a) => a.status === 'cancelado' || a.status === 'falta'
  ).length;

  const totalAtendidosMes = agendamentos.filter((a) => a.status === 'atendido').length;
  const faturamentoMes = lancamentos
    .filter((l) => l.tipo === 'receita')
    .reduce((sum, l) => sum + l.valor, 0);

  const ticketMedio =
    totalAtendidosMes > 0 ? faturamentoMes / totalAtendidosMes : 0;

  const metaMensal = config.metaMensal || 0;
  const metaPct =
    metaMensal > 0 ? Math.min(100, Math.round((faturamentoMes / metaMensal) * 100)) : 0;
  const faltamParaMeta = Math.max(0, metaMensal - faturamentoMes);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Bar with Time & Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-blue-400/90 mb-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{currentDateTime || '29 de set. de 2026 | 23:59:19'}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            {greeting}, <span className="text-blue-400">Barbearia</span>
          </h1>
        </div>

        {/* Quick action buttons matching exact user prompt */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => openNovoAgendamento()}
            className="bg-blue-700 hover:bg-blue-600 text-white font-semibold text-xs md:text-sm px-3.5 py-2 rounded-lg transition-all shadow-md shadow-blue-950/40 hover:shadow-blue-900/50 flex items-center gap-1.5"
          >
            <Calendar className="w-4 h-4" />
            <span>Novo agendamento</span>
          </button>

          <button
            onClick={openNovoCliente}
            className="bg-[#161a25] hover:bg-[#1b2232] text-slate-200 border border-[#262f44] hover:border-blue-700/60 text-xs md:text-sm px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4 text-blue-400" />
            <span>Novo cliente</span>
          </button>

          <button
            onClick={() => setActiveView('agenda')}
            className="bg-[#161a25] hover:bg-[#1b2232] text-slate-200 border border-[#262f44] hover:border-blue-700/60 text-xs md:text-sm px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5"
          >
            <Clock className="w-4 h-4 text-blue-400" />
            <span>Ver agenda</span>
          </button>

          <button
            onClick={openPublicBooking}
            className="bg-[#161a25] hover:bg-[#1b2232] text-slate-200 border border-[#262f44] hover:border-blue-700/60 text-xs md:text-sm px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5"
          >
            <ExternalLink className="w-4 h-4 text-blue-400" />
            <span>Abrir minha página</span>
          </button>
        </div>
      </div>

      {/* Card "Sua agenda está no ar" */}
      <div className="bg-gradient-to-br from-[#131722] to-[#181f2f] border border-blue-900/40 rounded-xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                <span>Sua agenda está no ar</span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                  3 de 3
                </span>
              </h2>
            </div>

            <div className="flex items-center flex-wrap gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Check className="w-4 h-4" />
                <span className="text-slate-200">1 barbeiro</span>
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Check className="w-4 h-4" />
                <span className="text-slate-200">
                  {servicos.filter((s) => s.ativo).length} serviços com preço e duração
                </span>
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Check className="w-4 h-4" />
                <span className="text-slate-200">Horários de atendimento</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 pt-1">
              Envie o link para seus clientes. O primeiro agendamento real aparece aqui.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2 flex-shrink-0">
            <button
              onClick={copiarLinkAgenda}
              className="bg-blue-700 hover:bg-blue-600 text-white font-semibold text-xs px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 shadow-sm shadow-blue-950/40"
            >
              {linkCopiadoToast ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Link copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar link da agenda</span>
                </>
              )}
            </button>

            <button
              onClick={fazerAgendamentoTeste}
              className="bg-[#182030] hover:bg-[#202b40] text-slate-200 border border-[#2c3852] text-xs px-3 py-2 rounded-lg transition-all flex items-center gap-1.5"
            >
              <span>Fazer um agendamento de teste</span>
            </button>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-[#232c3f] text-[11px] text-slate-400 leading-relaxed">
          O agendamento de teste feito com a sua própria conta aparece na agenda, mas não conta como agendamento real. Cancele depois para liberar o horário.
        </div>
      </div>

      {/* Alert "Teste grátis: restam 2 dias e 23 horas" */}
      <div className="bg-[#161a25] border border-amber-500/30 rounded-xl p-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs md:text-sm font-semibold text-slate-200">
              Teste grátis: restam {config.diasRestantesTeste - 1} dias e 23 horas
            </div>
            <div className="text-[11px] text-slate-400">
              Aproveite todos os recursos liberados no plano Essencial.
            </div>
          </div>
        </div>

        <button
          onClick={() => setActiveView('plano')}
          className="bg-amber-500 hover:bg-amber-400 text-[#070e1b] font-semibold text-xs px-3 py-1.5 rounded-lg transition-all whitespace-nowrap flex items-center gap-1 shadow-sm"
        >
          <span>Ver planos</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Main Metric Cards Grid (Matching exact user structure) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Hoje */}
        <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
              Hoje
            </span>
            <span className="text-xs text-blue-400 capitalize">{diaSemana}</span>
          </div>

          <div>
            <div className="text-xs text-slate-400">Receita do dia</div>
            <div className="text-2xl font-bold text-white tracking-tight">
              R$ {receitaHoje.toFixed(2).replace('.', ',')}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#202738] text-xs">
            <div>
              <span className="text-lg font-bold text-slate-200">{atendidosHoje.length}</span>
              <span className="text-[11px] text-slate-400 block">atendidos</span>
            </div>
            <div>
              <span className="text-lg font-bold text-slate-200">{agendamentosHoje.length}</span>
              <span className="text-[11px] text-slate-400 block">agendados</span>
            </div>
          </div>
        </div>

        {/* Card 2: Ranking do mês */}
        <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
              Ranking do mês
            </span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs bg-[#121622] p-2.5 rounded-lg border border-[#222a3d]">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[11px] flex items-center justify-center border border-amber-500/30">
                  1
                </span>
                <span className="font-semibold text-slate-200">
                  {profissionais[0]?.nome || 'Ruan santos'}
                </span>
              </div>
              <div className="text-right">
                <div className="font-bold text-blue-400">
                  R$ {faturamentoMes.toFixed(2).replace('.', ',')}
                </div>
                <div className="text-[10px] text-slate-400">
                  {totalAtendidosMes} atendimentos
                </div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 italic">
            Atualizado a cada fechamento de comanda.
          </div>
        </div>

        {/* Card 3: Indicadores de hoje */}
        <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-4 shadow-sm space-y-2">
          <div className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
            Indicadores de hoje
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
            <div className="bg-[#121622] p-2 rounded-lg border border-[#222a3d]">
              <span className="text-[11px] text-slate-400 block">Agendados hoje</span>
              <span className="text-lg font-bold text-white">{agendamentosHoje.length}</span>
            </div>
            <div className="bg-[#121622] p-2 rounded-lg border border-[#222a3d]">
              <span className="text-[11px] text-slate-400 block">Atendidos hoje</span>
              <span className="text-lg font-bold text-emerald-400">
                {atendidosHoje.length}
              </span>
            </div>
            <div className="bg-[#121622] p-2 rounded-lg border border-[#222a3d]">
              <span className="text-[11px] text-slate-400 block">Receita hoje</span>
              <span className="text-sm font-bold text-white">
                R$ {receitaHoje.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <div className="bg-[#121622] p-2 rounded-lg border border-[#222a3d]">
              <span className="text-[11px] text-slate-400 block">Cancel. / Faltas</span>
              <span className="text-sm font-bold text-rose-400">
                {canceladosFaltasHoje} / 0
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Suas metas */}
        <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-4 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
              Suas metas
            </span>
            <Target className="w-4 h-4 text-blue-400" />
          </div>

          <div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Meta de hoje</span>
              <span className="font-bold text-white">
                R$ {config.metaHoje.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <p className="text-[10px] text-slate-500">
              Defina sua meta mensal nas configurações
            </p>
          </div>

          <div className="pt-1 border-t border-[#202738]">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Meta da semana</span>
              <span className="font-bold text-white">
                R$ {config.metaSemana.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <button
              onClick={() => setActiveView('configuracoes')}
              className="text-[10px] text-blue-400 hover:underline block pt-0.5"
            >
              Defina sua meta mensal nas configurações
            </button>
          </div>
        </div>
      </div>

      {/* Second Row of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 5: Ritmo da semana */}
        <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-4 shadow-sm space-y-2">
          <div className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
            Ritmo da semana
          </div>
          <div>
            <div className="text-xl font-bold text-white">
              {clientes.length} clientes
            </div>
            <div className="text-xs text-emerald-400 font-medium">
              +0 vs semana anterior (0)
            </div>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-[#202738]">
            {clientes.length} clientes diferentes · R$ {faturamentoMes.toFixed(2).replace('.', ',')} faturados
          </div>
        </div>

        {/* Card 6: Alertas inteligentes */}
        <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
              Alertas inteligentes
            </span>
            <Sparkles className="w-4 h-4 text-blue-400" />
          </div>

          <div>
            <p className="text-xs font-medium text-slate-200">
              Você tem 21 horários vagos amanhã
            </p>
            <p className="text-[11px] text-slate-400">
              Dispare uma campanha rápida para preencher o dia.
            </p>
          </div>

          <button
            onClick={() => setActiveView('consultor-ia')}
            className="w-full bg-[#182032] hover:bg-[#202c45] text-blue-300 border border-blue-700/40 text-xs py-1.5 px-3 rounded-lg transition-all font-semibold flex items-center justify-center gap-1"
          >
            <span>Resolver</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Card 7: Acessos ao seu site */}
        <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
              Acessos ao seu site
            </span>
            <Eye className="w-4 h-4 text-slate-400" />
          </div>

          <div>
            <div className="text-2xl font-bold text-white">
              {config.totalAcessos30Dias}
            </div>
            <div className="text-xs text-slate-400">nos últimos 30 dias</div>
          </div>

          <div className="text-xs text-slate-300 flex items-center justify-between pt-1 border-t border-[#202738]">
            <span>Hoje: {config.acessosHoje}</span>
            <span>Ontem: {config.acessosOntem}</span>
          </div>

          <div className="text-[10px] text-slate-500">
            {config.totalAcessos30Dias} acessos totais desde o início.
          </div>
        </div>

        {/* Card 8: Mês atual */}
        <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
              Mês atual
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block">Faturamento</span>
            <div className="text-xl font-bold text-white">
              R$ {faturamentoMes.toFixed(2).replace('.', ',')}
            </div>
            <span className="text-[10px] text-slate-400">0.0% vs mês anterior</span>
          </div>

          <div className="pt-1 border-t border-[#202738]">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Meta mensal</span>
              <span className="font-semibold text-blue-400">{metaPct}%</span>
            </div>
            <div className="w-full bg-[#121622] h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className="bg-blue-600 h-full transition-all duration-500"
                style={{ width: `${metaPct}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 block pt-0.5">
              R$ {faltamParaMeta.toFixed(2)} para bater R$ {metaMensal.toFixed(2)}
            </span>
          </div>

          <div className="pt-1 text-xs">
            <span className="text-slate-400 text-[11px] block">Ticket médio</span>
            <span className="font-bold text-white">
              R$ {ticketMedio.toFixed(2).replace('.', ',')}
            </span>
            <span className="text-[10px] text-slate-500 block">
              {totalAtendidosMes} atendimentos no mês
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
