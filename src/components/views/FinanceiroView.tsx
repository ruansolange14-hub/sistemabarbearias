import React, { useState } from 'react';
import { useBarber } from '../../context/BarberContext';
import {
  DollarSign,
  Plus,
  TrendingUp,
  TrendingDown,
  Calendar,
  Wallet,
  PieChart,
  ArrowRight,
  Trash2,
  Tag,
} from 'lucide-react';
import { LancamentoFinanceiro } from '../../types';

export const FinanceiroView: React.FC = () => {
  const { lancamentos, openNovoLancamento, deleteLancamento, setActiveView } = useBarber();

  const [activeSubTab, setActiveSubTab] = useState<'lancamentos' | 'dre' | 'comissoes' | 'vales' | 'historico'>('lancamentos');

  const receitas = lancamentos
    .filter((l) => l.tipo === 'receita')
    .reduce((sum, l) => sum + l.valor, 0);

  const despesas = lancamentos
    .filter((l) => l.tipo === 'despesa')
    .reduce((sum, l) => sum + l.valor, 0);

  const saldoLucro = receitas - despesas;
  const margem = receitas > 0 ? ((saldoLucro / receitas) * 100).toFixed(1) : '0.0';
  const receitasCount = lancamentos.filter((l) => l.tipo === 'receita').length;
  const ticketMedio = receitasCount > 0 ? (receitas / receitasCount).toFixed(2) : '0,00';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Financeiro
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-800/60 font-medium">
              setembro de 2026
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Controle de fluxo de caixa, despesas fixas, receitas e comissões.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => {}}
            className="px-3 py-2 bg-[#161a25] hover:bg-[#1f2638] text-slate-200 border border-[#242c3f] rounded-lg text-xs font-medium"
          >
            Hoje
          </button>
          <button
            onClick={openNovoLancamento}
            className="bg-blue-700 hover:bg-blue-600 text-white font-semibold text-xs md:text-sm px-4 py-2 rounded-lg transition-all shadow-md shadow-blue-950/40 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Novo lançamento</span>
          </button>
        </div>
      </div>

      {/* 6 Key Metric Cards matching exact user names */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-3.5 shadow-sm">
          <span className="text-[11px] text-slate-400 block font-medium">Receitas</span>
          <div className="text-lg md:text-xl font-bold text-emerald-400 mt-0.5">
            R$ {receitas.toFixed(2).replace('.', ',')}
          </div>
        </div>

        <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-3.5 shadow-sm">
          <span className="text-[11px] text-slate-400 block font-medium">Despesas</span>
          <div className="text-lg md:text-xl font-bold text-rose-400 mt-0.5">
            R$ {despesas.toFixed(2).replace('.', ',')}
          </div>
        </div>

        <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-3.5 shadow-sm">
          <span className="text-[11px] text-slate-400 block font-medium">Saldo/Lucro</span>
          <div className={`text-lg md:text-xl font-bold mt-0.5 ${saldoLucro >= 0 ? 'text-white' : 'text-rose-400'}`}>
            R$ {saldoLucro.toFixed(2).replace('.', ',')}
          </div>
        </div>

        <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-3.5 shadow-sm">
          <span className="text-[11px] text-slate-400 block font-medium">Margem</span>
          <div className="text-lg md:text-xl font-bold text-blue-400 mt-0.5">
            {margem}%
          </div>
        </div>

        <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-3.5 shadow-sm">
          <span className="text-[11px] text-slate-400 block font-medium">Ticket médio</span>
          <div className="text-lg md:text-xl font-bold text-white mt-0.5">
            R$ {ticketMedio.replace('.', ',')}
          </div>
        </div>

        <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-3.5 shadow-sm">
          <span className="text-[11px] text-slate-400 block font-medium">Lançamentos</span>
          <div className="text-lg md:text-xl font-bold text-slate-200 mt-0.5">
            {lancamentos.length}
          </div>
        </div>
      </div>

      {/* Subtabs matching exact user prompt */}
      <div className="flex items-center gap-1.5 overflow-x-auto bg-[#161a25] border border-[#242c3f] p-2 rounded-xl text-xs font-semibold">
        {[
          { id: 'lancamentos', label: 'Lançamentos' },
          { id: 'dre', label: 'DRE' },
          { id: 'comissoes', label: 'Comissões' },
          { id: 'vales', label: 'Vales & Pagamentos' },
          { id: 'historico', label: 'Histórico' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeSubTab === tab.id
                ? 'bg-blue-700 text-white font-bold shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content: Lançamentos */}
      <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Lançamentos
        </h3>

        {lancamentos.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-400 space-y-3">
            <p>Nenhum lançamento neste mês.</p>
            <button
              onClick={openNovoLancamento}
              className="px-3.5 py-1.5 bg-[#182032] hover:bg-[#202c45] text-blue-300 border border-blue-700/40 rounded-lg font-semibold inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Registrar receita ou despesa</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#202738]">
            {lancamentos.map((item) => (
              <div
                key={item.id}
                className="py-3 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                      item.tipo === 'receita'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {item.tipo === 'receita' ? '+' : '-'}
                  </span>
                  <div>
                    <h4 className="font-semibold text-white">{item.descricao}</h4>
                    <span className="text-[11px] text-slate-400">
                      {item.categoria} · {item.data}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`font-bold text-sm ${
                      item.tipo === 'receita' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {item.tipo === 'receita' ? '+' : '-'} R${' '}
                    {item.valor.toFixed(2).replace('.', ',')}
                  </span>
                  <button
                    onClick={() => deleteLancamento(item.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 rounded"
                    title="Excluir lançamento"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fluxo de caixa diário & Top Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-white">
            Top despesas por categoria
          </h3>
          <div className="py-6 text-center text-xs text-slate-400">
            {despesas > 0 ? (
              <div className="space-y-2 text-left">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Despesas operacionais</span>
                  <span className="font-bold text-rose-400">
                    R$ {despesas.toFixed(2)}
                  </span>
                </div>
              </div>
            ) : (
              'Sem despesas.'
            )}
          </div>
        </div>

        <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-white">
            Top receitas por categoria
          </h3>
          <div className="py-6 text-center text-xs text-slate-400">
            {receitas > 0 ? (
              <div className="space-y-2 text-left">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Serviços da barbearia</span>
                  <span className="font-bold text-emerald-400">
                    R$ {receitas.toFixed(2)}
                  </span>
                </div>
              </div>
            ) : (
              'Sem receitas.'
            )}
          </div>
        </div>
      </div>

      {/* Promotional Banner matching exact prompt */}
      <div className="bg-gradient-to-br from-[#121825] to-[#162238] border border-blue-900/40 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Wallet className="w-5 h-5 text-blue-400" />
            <span>Financeiro na mão</span>
          </h3>
          <p className="text-xs text-slate-300">
            Entradas, saídas e comissões organizadas sem planilha.
          </p>
          <p className="text-[11px] text-slate-400">
            Escolha um plano e feche o mês sem surpresas.
          </p>
        </div>

        <button
          onClick={() => setActiveView('plano')}
          className="bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-all shadow-md shadow-blue-950/40 whitespace-nowrap self-start md:self-auto flex items-center gap-1.5"
        >
          <span>Ver planos</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
