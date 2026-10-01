import React, { useState } from 'react';
import { useSuperAdmin } from '../../../context/SuperAdminContext';
import {
  Building2,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
  FileCheck,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Layers,
  ShieldCheck,
  Scissors,
} from 'lucide-react';

export const SADashboardView: React.FC = () => {
  const {
    barbearias,
    assinaturas,
    pagamentos,
    usuarios,
    setCurrentSAView,
    setSelectedBarbeariaId,
  } = useSuperAdmin();

  const [filtroPeriodo, setFiltroPeriodo] = useState<'hoje' | '7dias' | '30dias' | 'mes' | 'mes_anterior' | 'personalizado'>('mes');

  // Metrics Calculations
  const totalBarbearias = barbearias.length;
  const barbeariasAtivas = barbearias.filter((b) => b.status === 'ATIVA').length;
  const barbeariasSuspensas = barbearias.filter((b) => b.status === 'SUSPENSA').length;
  const novasBarbearias = barbearias.filter((b) => b.dataCadastro >= '2026-09-01').length;

  const assinaturasAtivas = assinaturas.filter((a) => a.status === 'ATIVA').length;
  const assinaturasAtrasadas = assinaturas.filter((a) => a.status === 'ATRASADA').length;

  // MRR: Monthly Recurring Revenue of SaaS from active subscriptions
  const mrr = assinaturas
    .filter((a) => a.status === 'ATIVA')
    .reduce((acc, a) => acc + (a.periodicidade === 'ANUAL' ? a.valor / 12 : a.valor), 0);

  // Platform Revenue from approved payments this month
  const receitaPlataformaMes = pagamentos
    .filter((p) => p.status === 'APROVADO')
    .reduce((acc, p) => acc + p.valor, 0);

  // Gross Merchandise Volume (GMV) of all Barbershops combined (SEPARATE FROM PLATFORM REVENUE)
  const gmvTotalBarbearias = barbearias.reduce((acc, b) => acc + b.faturamentoMensalBarbearia, 0);
  const totalAgendamentosGeral = barbearias.reduce((acc, b) => acc + b.totalAgendamentos, 0);
  const totalClientesGeral = barbearias.reduce((acc, b) => acc + b.totalClientes, 0);

  const pagamentosRecebidos = pagamentos.filter((p) => p.status === 'APROVADO').length;
  const pagamentosPendentes = pagamentos.filter((p) => p.status === 'PENDENTE').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header & Period Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <span>Dashboard da Plataforma</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-950/80 text-blue-300 font-mono font-bold border border-blue-800/60">
              SaaS Overview
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Métricas de desempenho comercial, receita recorrente, tenants e saúde operacional.
          </p>
        </div>

        {/* Filters: Hoje, 7 dias, 30 dias, Mês, Mês anterior, Personalizado */}
        <div className="flex items-center gap-1.5 overflow-x-auto bg-[#131722] border border-[#232a3d] p-1.5 rounded-2xl text-xs font-semibold">
          {[
            { id: 'hoje', label: 'Hoje' },
            { id: '7dias', label: '7 dias' },
            { id: '30dias', label: '30 dias' },
            { id: 'mes', label: 'Mês' },
            { id: 'mes_anterior', label: 'Mês anterior' },
            { id: 'personalizado', label: 'Personalizado' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFiltroPeriodo(item.id as any)}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                filtroPeriodo === item.id
                  ? 'bg-blue-700 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top 8 Key SaaS Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* 1. Total Barbearias */}
        <div className="bg-[#161a25] border border-[#242c3f] rounded-2xl p-4 shadow-sm hover:border-blue-700/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Total Barbearias
            </span>
            <Building2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">
            {totalBarbearias}
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3 h-3" /> +{novasBarbearias} este mês
          </span>
        </div>

        {/* 2. Barbearias Ativas */}
        <div className="bg-[#161a25] border border-[#242c3f] rounded-2xl p-4 shadow-sm hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Barbearias Ativas
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-2">
            {barbeariasAtivas}
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            {Math.round((barbeariasAtivas / totalBarbearias) * 100)}% da base
          </span>
        </div>

        {/* 3. Barbearias Suspensas */}
        <div className="bg-[#161a25] border border-[#242c3f] rounded-2xl p-4 shadow-sm hover:border-rose-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Barbearias Suspensas
            </span>
            <AlertOctagon className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-rose-400 mt-2">
            {barbeariasSuspensas}
          </div>
          <span className="text-[10px] text-rose-300 font-medium block mt-1">
            Acesso bloqueado
          </span>
        </div>

        {/* 4. Novas Barbearias */}
        <div className="bg-[#161a25] border border-[#242c3f] rounded-2xl p-4 shadow-sm hover:border-blue-700/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Novas Barbearias
            </span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">
            +{novasBarbearias}
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            Últimos 30 dias
          </span>
        </div>

        {/* 5. Assinaturas Ativas */}
        <div className="bg-[#161a25] border border-[#242c3f] rounded-2xl p-4 shadow-sm hover:border-blue-700/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Assinaturas Ativas
            </span>
            <FileCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">
            {assinaturasAtivas}
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            Planos recorrentes
          </span>
        </div>

        {/* 6. Assinaturas em Atraso */}
        <div className="bg-[#161a25] border border-[#242c3f] rounded-2xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Assinaturas em Atraso
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400 mt-2">
            {assinaturasAtrasadas}
          </div>
          <span className="text-[10px] text-amber-300 font-medium block mt-1">
            Requer cobrança
          </span>
        </div>

        {/* 7. MRR (Receita Recorrente Mensal SaaS) */}
        <div className="bg-gradient-to-br from-[#121929] to-[#18233c] border border-blue-800/60 rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider">
              MRR (SaaS)
            </span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">
            R$ {mrr.toFixed(2).replace('.', ',')}
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold block mt-1">
            Receita mensal previsível
          </span>
        </div>

        {/* 8. Receita da Plataforma */}
        <div className="bg-gradient-to-br from-[#141d30] to-[#1a2948] border border-blue-700/60 rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider">
              Receita Plataforma
            </span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-2">
            R$ {receitaPlataformaMes.toFixed(2).replace('.', ',')}
          </div>
          <span className="text-[10px] text-slate-300 block mt-1">
            Faturamento líquido SaaS
          </span>
        </div>
      </div>

      {/* Critical Comparison Banner: PLATFORM REVENUE vs BARBERSHOP GMV */}
      <div className="bg-[#161a25] border-2 border-[#242c3f] rounded-3xl p-5 md:p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <h3 className="font-extrabold text-white text-sm uppercase tracking-wider">
            Demarcação de Receitas: Plataforma SaaS vs. Barbearias (Tenants)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Box 1: Receita da Plataforma */}
          <div className="bg-[#121622] border border-blue-800/40 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-300">
                1. RECEITA DA PLATAFORMA SAAS
              </span>
              <span className="text-[10px] bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded font-mono font-semibold">
                SEU LUCRO
              </span>
            </div>
            <div className="text-3xl font-black text-white">
              R$ {receitaPlataformaMes.toFixed(2).replace('.', ',')}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Total arrecadado com as mensalidades e assinaturas cobradas das barbearias que utilizam o sistema BarberPilot.
            </p>
          </div>

          {/* Box 2: Faturamento Total das Barbearias */}
          <div className="bg-[#121622] border border-[#232a3d] rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">
                2. FATURAMENTO DAS BARBEARIAS (GMV)
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono font-semibold">
                VOLUME TRANSACIONADO
              </span>
            </div>
            <div className="text-3xl font-black text-slate-200">
              R$ {gmvTotalBarbearias.toFixed(2).replace('.', ',')}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Valor bruto movimentado pelas barbearias atendendo clientes finais com cortes, barbas e serviços próprios.
            </p>
          </div>
        </div>
      </div>

      {/* Operational Indicators & Visual Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Distribuição de Barbearias por Status */}
        <div className="bg-[#161a25] border border-[#242c3f] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">
              Status das Barbearias
            </h3>
            <span className="text-xs text-slate-400">{totalBarbearias} total</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Ativas
                </span>
                <span className="font-bold">{barbeariasAtivas} barbearias</span>
              </div>
              <div className="w-full bg-[#121622] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-400 h-full"
                  style={{ width: `${(barbeariasAtivas / totalBarbearias) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Período de Teste (Trial)
                </span>
                <span className="font-bold">
                  {barbearias.filter((b) => b.status === 'TRIAL').length} barbearias
                </span>
              </div>
              <div className="w-full bg-[#121622] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full"
                  style={{ width: `${(barbearias.filter((b) => b.status === 'TRIAL').length / totalBarbearias) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Inadimplentes
                </span>
                <span className="font-bold">
                  {barbearias.filter((b) => b.status === 'INADIMPLENTE').length} barbearias
                </span>
              </div>
              <div className="w-full bg-[#121622] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full"
                  style={{ width: `${(barbearias.filter((b) => b.status === 'INADIMPLENTE').length / totalBarbearias) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  Suspensas
                </span>
                <span className="font-bold">{barbeariasSuspensas} barbearias</span>
              </div>
              <div className="w-full bg-[#121622] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-rose-400 h-full"
                  style={{ width: `${(barbeariasSuspensas / totalBarbearias) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentSAView('barbearias')}
            className="w-full py-2 bg-[#182032] hover:bg-[#202c45] text-blue-300 rounded-xl text-xs font-semibold transition-colors mt-2 text-center"
          >
            Gerenciar todas as barbearias →
          </button>
        </div>

        {/* Center Column: Indicadores Operacionais Globais */}
        <div className="bg-[#161a25] border border-[#242c3f] rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-white text-sm">
            Métricas Globais de Utilização
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-[#121622] p-3 rounded-xl border border-[#222a3d]">
              <span className="text-[11px] text-slate-400 block">Clientes Finais</span>
              <span className="text-xl font-bold text-white mt-1 block">
                {totalClientesGeral}
              </span>
              <span className="text-[10px] text-slate-500">cadastrados no app</span>
            </div>

            <div className="bg-[#121622] p-3 rounded-xl border border-[#222a3d]">
              <span className="text-[11px] text-slate-400 block">Agendamentos</span>
              <span className="text-xl font-bold text-blue-400 mt-1 block">
                {totalAgendamentosGeral}
              </span>
              <span className="text-[10px] text-slate-500">atendimentos totais</span>
            </div>

            <div className="bg-[#121622] p-3 rounded-xl border border-[#222a3d]">
              <span className="text-[11px] text-slate-400 block">Pagamentos Aprovados</span>
              <span className="text-xl font-bold text-emerald-400 mt-1 block">
                {pagamentosRecebidos}
              </span>
              <span className="text-[10px] text-slate-500">mensalidades pagas</span>
            </div>

            <div className="bg-[#121622] p-3 rounded-xl border border-[#222a3d]">
              <span className="text-[11px] text-slate-400 block">Pagamentos Pendentes</span>
              <span className="text-xl font-bold text-amber-400 mt-1 block">
                {pagamentosPendentes}
              </span>
              <span className="text-[10px] text-slate-500">aguardando baixa</span>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-400 leading-relaxed border-t border-[#232a3d]">
            A taxa de retenção da plataforma está em <strong className="text-emerald-400 font-semibold">92.5%</strong> no trimestre atual.
          </div>
        </div>

        {/* Right Column: Barbearias com Ações Recentes / Alerta */}
        <div className="bg-[#161a25] border border-[#242c3f] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">
              Últimas Atividades
            </h3>
            <span className="text-[10px] text-blue-400 font-semibold">Tempo Real</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {barbearias.slice(0, 4).map((b) => (
              <div
                key={b.id}
                onClick={() => {
                  setSelectedBarbeariaId(b.id);
                  setCurrentSAView('barbearia-detalhes');
                }}
                className="p-2.5 bg-[#121622] hover:bg-[#182032] border border-[#222a3d] rounded-xl flex items-center justify-between cursor-pointer transition-colors"
              >
                <div>
                  <h4 className="font-bold text-white text-xs">{b.nome}</h4>
                  <span className="text-[10px] text-slate-400">
                    Plano {b.planoNome} · {b.proprietarioNome}
                  </span>
                </div>

                <span
                  className={`text-[9px] px-2 py-0.5 rounded font-extrabold uppercase ${
                    b.status === 'ATIVA'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : b.status === 'TRIAL'
                      ? 'bg-blue-900/50 text-blue-300'
                      : b.status === 'INADIMPLENTE'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-rose-500/20 text-rose-300'
                  }`}
                >
                  {b.status}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setCurrentSAView('inadimplencia')}
            className="w-full py-2 bg-[#182032] hover:bg-[#202c45] text-amber-300 rounded-xl text-xs font-semibold transition-colors mt-2 text-center"
          >
            Ver barbearias em atraso →
          </button>
        </div>
      </div>
    </div>
  );
};
