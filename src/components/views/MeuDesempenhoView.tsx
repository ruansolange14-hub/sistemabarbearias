import React, { useState } from 'react';
import { useBarber } from '../../context/BarberContext';
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Wallet,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const MeuDesempenhoView: React.FC = () => {
  const { agendamentos, lancamentos, profissionais } = useBarber();

  const [periodoFiltro, setPeriodoFiltro] = useState<'hoje' | '7dias' | 'mes' | '30dias' | '90dias'>('mes');
  const [visaoGrafico, setVisaoGrafico] = useState<'dia' | 'semana'>('dia');

  const atendimentosConcluidos = agendamentos.filter((a) => a.status === 'atendido');
  const valorVendido = atendimentosConcluidos.reduce((acc, a) => acc + a.valor, 0);
  const comissaoBruta = valorVendido * 0; // 0% base
  const valesPendentes = 0;
  const saldoLiquido = comissaoBruta - valesPendentes;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Meu desempenho
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Toda a barbearia • comissão base 0%
        </p>
      </div>

      {/* Filter Buttons & Period Label */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#161a25] border border-[#242c3f] p-3 rounded-xl">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'hoje', label: 'Hoje' },
            { id: '7dias', label: '7 dias' },
            { id: 'mes', label: 'Mês' },
            { id: '30dias', label: '30 dias' },
            { id: '90dias', label: '90 dias' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setPeriodoFiltro(item.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                periodoFiltro === item.id
                  ? 'bg-blue-700 text-white font-bold shadow-xs'
                  : 'bg-[#121622] text-slate-300 hover:bg-[#1a2235] border border-[#222a3d]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-blue-400 font-medium">
          Este mês: <span className="text-slate-200">01 set – 30 set 2026</span>
        </div>
      </div>

      {/* 4 Main Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-4 shadow-sm">
          <span className="text-xs text-slate-400 block">Atendimentos</span>
          <div className="text-2xl font-bold text-white mt-1">
            {atendimentosConcluidos.length}
          </div>
        </div>

        <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-4 shadow-sm">
          <span className="text-xs text-slate-400 block">Valor vendido</span>
          <div className="text-2xl font-bold text-white mt-1">
            R$ {valorVendido.toFixed(2).replace('.', ',')}
          </div>
        </div>

        <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-4 shadow-sm">
          <span className="text-xs text-slate-400 block">Comissão bruta</span>
          <div className="text-2xl font-bold text-white mt-1">
            R$ {comissaoBruta.toFixed(2).replace('.', ',')}
          </div>
          <span className="text-[10px] text-slate-500">0% base</span>
        </div>

        <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-4 shadow-sm">
          <span className="text-xs text-slate-400 block">Vales pendentes</span>
          <div className="text-2xl font-bold text-white mt-1">
            R$ {valesPendentes.toFixed(2).replace('.', ',')}
          </div>
        </div>
      </div>

      {/* Resumo a receber Card */}
      <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Resumo a receber
        </h3>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-1.5 border-b border-[#202738]">
            <span className="text-slate-400">Comissão do período</span>
            <span className="font-semibold text-slate-200">
              R$ {comissaoBruta.toFixed(2).replace('.', ',')}
            </span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-[#202738]">
            <span className="text-slate-400">( - ) Vales pendentes</span>
            <span className="font-semibold text-slate-200">
              R$ {valesPendentes.toFixed(2).replace('.', ',')}
            </span>
          </div>

          <div className="flex justify-between py-2 text-sm font-bold">
            <span className="text-white">Saldo líquido estimado</span>
            <span className="text-blue-400">
              R$ {saldoLiquido.toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>
      </div>

      {/* Receita e comissão Card */}
      <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">
            Receita e comissão
          </h3>

          <div className="flex items-center gap-1 bg-[#121622] p-1 rounded-lg border border-[#222a3d] text-xs">
            <button
              onClick={() => setVisaoGrafico('dia')}
              className={`px-2.5 py-1 rounded font-medium ${
                visaoGrafico === 'dia' ? 'bg-blue-700 text-white' : 'text-slate-400'
              }`}
            >
              Por dia
            </button>
            <button
              onClick={() => setVisaoGrafico('semana')}
              className={`px-2.5 py-1 rounded font-medium ${
                visaoGrafico === 'semana' ? 'bg-blue-700 text-white' : 'text-slate-400'
              }`}
            >
              Por semana
            </button>
          </div>
        </div>

        {atendimentosConcluidos.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            Sem atendimentos concluídos neste período.
          </div>
        ) : (
          <div className="space-y-2">
            {atendimentosConcluidos.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between p-2.5 bg-[#121622] rounded-lg border border-[#222a3d] text-xs"
              >
                <div>
                  <span className="font-semibold text-white">{a.clienteNome}</span>
                  <span className="text-slate-400 text-[11px] block">{a.servicoNome}</span>
                </div>
                <div className="text-right font-bold text-blue-400">
                  R$ {a.valor.toFixed(2).replace('.', ',')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Evolução detalhada Card */}
      <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-5 space-y-2">
        <h3 className="text-sm font-bold text-white">
          Evolução detalhada
        </h3>
        <div className="py-6 text-center text-xs text-slate-400">
          Sem atendimentos concluídos neste período.
        </div>
      </div>

      {/* Vales em aberto & quitados Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-5 space-y-2">
          <h3 className="text-sm font-bold text-white">
            Vales em aberto
          </h3>
          <div className="py-6 text-center text-xs text-slate-400">
            Nenhum vale em aberto.
          </div>
        </div>

        <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-5 space-y-2">
          <h3 className="text-sm font-bold text-white">
            Vales quitados no período
          </h3>
          <div className="py-6 text-center text-xs text-slate-400">
            Nenhum vale quitado neste período.
          </div>
        </div>
      </div>

      {/* Footer warning */}
      <p className="text-[11px] text-slate-500 italic text-center">
        Os valores refletem os lançamentos feitos pelo dono da barbearia. Em caso de divergência, converse com a gestão.
      </p>
    </div>
  );
};
