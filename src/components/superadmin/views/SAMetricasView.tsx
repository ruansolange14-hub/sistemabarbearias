import React, { useState } from 'react';
import { useSuperAdmin } from '../../../context/SuperAdminContext';
import {
  LineChart,
  TrendingUp,
  DollarSign,
  Users,
  Building2,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  Shield,
  Activity,
} from 'lucide-react';

export const SAMetricasView: React.FC = () => {
  const { barbearias, assinaturas, pagamentos } = useSuperAdmin();

  const [filtro, setFiltro] = useState<'dia' | 'semana' | 'mes' | 'personalizado'>('mes');

  const mrr = assinaturas
    .filter((a) => a.status === 'ATIVA')
    .reduce((acc, a) => acc + (a.periodicidade === 'ANUAL' ? a.valor / 12 : a.valor), 0);

  const arr = mrr * 12; // Annual Recurring Revenue

  const totalClientes = barbearias.reduce((acc, b) => acc + b.totalClientes, 0);
  const totalAgendamentos = barbearias.reduce((acc, b) => acc + b.totalAgendamentos, 0);

  // Growth simulation bars for 6 months (May, Jun, Jul, Aug, Sep, Oct)
  const growthMonths = [
    { mes: 'Mai/26', barbearias: 2, mrr: 179.8, gmv: 8900 },
    { mes: 'Jun/26', barbearias: 3, mrr: 329.7, gmv: 27350 },
    { mes: 'Jul/26', barbearias: 4, mrr: 329.7, gmv: 29500 },
    { mes: 'Ago/26', barbearias: 5, mrr: 419.6, gmv: 31200 },
    { mes: 'Set/26', barbearias: 6, mrr: 479.5, gmv: 32580 },
    { mes: 'Out/26 (proj.)', barbearias: 8, mrr: 649.0, gmv: 41000 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Métricas & Crescimento da Plataforma</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-400/30">
              +38% crescimento
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Análise aprofundada de MRR, ARR, volume transacionado e métricas de expansão da rede.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#161a25] border border-[#242c3f] p-1.5 rounded-2xl text-xs font-semibold">
          {(['dia', 'semana', 'mes', 'personalizado'] as const).map((item) => (
            <button
              key={item}
              onClick={() => setFiltro(item)}
              className={`px-3 py-1.5 rounded-xl capitalize transition-all ${
                filtro === item
                  ? 'bg-blue-700 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Top 4 SaaS Financial Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#161a25] border border-[#242c3f] rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>MRR (Receita Mensal Recorrente)</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            R$ {mrr.toFixed(2).replace('.', ',')}
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold block mt-1">
            +18.4% vs mês anterior
          </span>
        </div>

        <div className="bg-[#161a25] border border-[#242c3f] rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>ARR (Receita Anual Projetada)</span>
            <DollarSign className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            R$ {arr.toFixed(2).replace('.', ',')}
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            Base anualizada
          </span>
        </div>

        <div className="bg-[#161a25] border border-[#242c3f] rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Churn Rate (Cancelamento)</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 mt-2">
            2.8%
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold block mt-1">
            Abaixo do benchmark de 5%
          </span>
        </div>

        <div className="bg-[#161a25] border border-[#242c3f] rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>LTV Médio por Barbearia</span>
            <Shield className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            R$ 1.840,00
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            Ciclo médio de 20 meses
          </span>
        </div>
      </div>

      {/* Visual Evolution Chart */}
      <div className="bg-[#161a25] border border-[#242c3f] rounded-3xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-white text-base">
              Evolução Histórica de MRR e Barbearias (Tenants)
            </h3>
            <p className="text-xs text-slate-400">
              Crescimento constante de receita mensal desde o lançamento da plataforma.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-blue-400">
              <span className="w-3 h-3 rounded-sm bg-blue-600" />
              MRR (R$)
            </span>
            <span className="flex items-center gap-1.5 text-indigo-400">
              <span className="w-3 h-3 rounded-sm bg-indigo-500" />
              Barbearias Ativas
            </span>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="grid grid-cols-6 gap-3 items-end h-64 pt-6 pb-2 border-b border-[#242c3f]">
          {growthMonths.map((item, i) => {
            const heightPct = Math.round((item.mrr / 700) * 100);
            return (
              <div key={i} className="flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-bold text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  R$ {item.mrr.toFixed(0)}
                </span>
                <div
                  className="w-full max-w-[48px] bg-gradient-to-t from-blue-700 to-blue-500 rounded-t-xl group-hover:brightness-110 transition-all shadow-md shadow-blue-950/40"
                  style={{ height: `${heightPct}%` }}
                />
                <span className="text-[11px] text-slate-400 font-semibold mt-1">
                  {item.mes}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
