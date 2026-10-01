import React, { useState } from 'react';
import { useBarber } from '../../context/BarberContext';
import {
  Award,
  Gift,
  Ticket,
  Sparkles,
  TrendingUp,
  ArrowRight,
  Share2,
  Plus,
  Copy,
  Check,
} from 'lucide-react';
import { CupomFidelidade } from '../../types';

export const FidelizacaoView: React.FC = () => {
  const { config, clientes, cupons, addCupom, setActiveView } = useBarber();

  const [activeTab, setActiveTab] = useState<'ranking' | 'perto_do_premio' | 'cupons' | 'divulgar' | 'ideias_ia' | 'configurar'>('ranking');
  const [isNovoCupomOpen, setIsNovoCupomOpen] = useState(false);
  const [codigoCupom, setCodigoCupom] = useState('');
  const [descontoValor, setDescontoValor] = useState('15');
  const [pontosNecessarios, setPontosNecessarios] = useState('50');

  const clientesComPontos = clientes.filter((c) => c.pontosFidelidade > 0);
  const pontosEmitidos = clientes.reduce((acc, c) => acc + c.pontosFidelidade, 0);
  const cuponsUsados = cupons.reduce((acc, c) => acc + c.usos, 0);
  const taxaResgate = cupons.length > 0 ? ((cuponsUsados / cupons.length) * 100).toFixed(0) : '0';

  const handleSalvarCupom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigoCupom) return;
    addCupom({
      codigo: codigoCupom.toUpperCase(),
      descricao: `R$ ${descontoValor} OFF com ${pontosNecessarios} pontos`,
      pontosNecessarios: parseInt(pontosNecessarios) || 50,
      descontoValor: parseFloat(descontoValor) || 15,
      tipoDesconto: 'fixo',
      ativo: true,
    });
    setIsNovoCupomOpen(false);
    setCodigoCupom('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Fidelização</span>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 font-bold border border-blue-700/50 uppercase">
              IA
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Programa de pontos, cupons automáticos e ações de retenção para trazer o cliente de volta.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#161a25] border border-[#242c3f] px-3.5 py-1.5 rounded-xl self-start sm:self-auto">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold text-white">
            {config.tokensIA}{' '}
            <span className="text-slate-400 font-normal">tokens</span>
          </span>
        </div>
      </div>

      {/* 5 Metric Cards matching exact user names */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-3.5 shadow-sm">
          <span className="text-[11px] text-slate-400 block font-medium">
            Clientes participando
          </span>
          <div className="text-xl font-bold text-white mt-0.5">
            {clientesComPontos.length}
          </div>
        </div>

        <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-3.5 shadow-sm">
          <span className="text-[11px] text-slate-400 block font-medium">
            Pontos emitidos
          </span>
          <div className="text-xl font-bold text-blue-400 mt-0.5">
            {pontosEmitidos}
          </div>
        </div>

        <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-3.5 shadow-sm">
          <span className="text-[11px] text-slate-400 block font-medium">
            Cupons gerados
          </span>
          <div className="text-xl font-bold text-white mt-0.5">
            {cupons.length}
          </div>
        </div>

        <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-3.5 shadow-sm">
          <span className="text-[11px] text-slate-400 block font-medium">
            Cupons usados
          </span>
          <div className="text-xl font-bold text-white mt-0.5">
            {cuponsUsados}
          </div>
        </div>

        <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-3.5 shadow-sm col-span-2 md:col-span-1">
          <span className="text-[11px] text-slate-400 block font-medium">
            Taxa de resgate
          </span>
          <div className="text-xl font-bold text-emerald-400 mt-0.5">
            {taxaResgate}%
          </div>
        </div>
      </div>

      {/* Tabs matching exact user names */}
      <div className="flex items-center gap-1.5 overflow-x-auto bg-[#161a25] border border-[#242c3f] p-2 rounded-xl text-xs font-semibold">
        {[
          { id: 'ranking', label: 'Ranking' },
          { id: 'perto_do_premio', label: 'Perto do prêmio' },
          { id: 'cupons', label: 'Cupons' },
          { id: 'divulgar', label: 'Divulgar' },
          { id: 'ideias_ia', label: 'Ideias IA' },
          { id: 'configurar', label: 'Configurar' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-blue-700 text-white font-bold shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content: Ranking */}
      {activeTab === 'ranking' && (
        <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-8 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
            <Award className="w-6 h-6" />
          </div>
          {clientesComPontos.length === 0 ? (
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Ainda não há clientes com pontos acumulados. Assim que os atendimentos gerarem pontos, o ranking aparece aqui.
            </p>
          ) : (
            <div className="space-y-2 max-w-lg mx-auto text-left">
              {clientesComPontos.map((cli, idx) => (
                <div
                  key={cli.id}
                  className="flex items-center justify-between p-3 bg-[#121622] rounded-lg border border-[#222a3d] text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-400">#{idx + 1}</span>
                    <span className="font-semibold text-white">{cli.nome}</span>
                  </div>
                  <span className="font-bold text-blue-400">
                    {cli.pontosFidelidade} pontos
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Cupons */}
      {activeTab === 'cupons' && (
        <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Cupons Ativos</h3>
            <button
              onClick={() => setIsNovoCupomOpen(true)}
              className="bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo cupom</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {cupons.map((c) => (
              <div
                key={c.id}
                className="bg-[#121622] border border-[#222a3d] rounded-xl p-3.5 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-blue-400" />
                    <span className="font-mono font-bold text-sm text-white">
                      {c.codigo}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-1">{c.descricao}</p>
                  <span className="text-[10px] text-amber-400 font-semibold block mt-0.5">
                    Custa {c.pontosNecessarios} pontos
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-slate-400 text-[10px] block">Usos: {c.usos}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold uppercase">
                    Ativo
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: Ideias IA */}
      {activeTab === 'ideias_ia' && (
        <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Ideias de Recompensas Sugeridas pela IA</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-[#121622] p-3.5 rounded-xl border border-[#222a3d] space-y-2">
              <h4 className="font-bold text-blue-300">Nível 1 · Entrada (50 pts)</h4>
              <p className="text-slate-400 text-[11px]">
                "Alinhamento de Barba ou Pomada Modeladora com 50% de desconto." Ótimo para incentivar o 2º corte.
              </p>
            </div>
            <div className="bg-[#121622] p-3.5 rounded-xl border border-[#222a3d] space-y-2">
              <h4 className="font-bold text-blue-300">Nível 2 · Intermediário (100 pts)</h4>
              <p className="text-slate-400 text-[11px]">
                "Corte Masculino Cortesia + Toalha Quente". Retém clientes recorrentes que cortam a cada 15 dias.
              </p>
            </div>
            <div className="bg-[#121622] p-3.5 rounded-xl border border-[#222a3d] space-y-2">
              <h4 className="font-bold text-blue-300">Nível 3 · VIP (200 pts)</h4>
              <p className="text-slate-400 text-[11px]">
                "Combo VIP Completo (Cabelo + Barba + Sobrancelha) + Bebida Cortesia". Transforma clientes em promotores.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Promotional Banner matching exact prompt */}
      <div className="bg-gradient-to-br from-[#121825] to-[#162238] border border-blue-900/40 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Gift className="w-5 h-5 text-blue-400" />
            <span>Fidelização</span>
          </h3>
          <p className="text-xs text-slate-300">
            Pontos e recompensas que fazem o cliente voltar mais vezes.
          </p>
          <p className="text-[11px] text-slate-400">
            Clientes fiéis sustentam a barbearia — mantenha isso ativo.
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

      {/* Modal Novo Cupom */}
      {isNovoCupomOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#161a25] border border-[#26324b] rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <h3 className="font-bold text-white text-base">Novo Cupom de Fidelidade</h3>
            <form onSubmit={handleSalvarCupom} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Código do Cupom</label>
                <input
                  type="text"
                  required
                  value={codigoCupom}
                  onChange={(e) => setCodigoCupom(e.target.value)}
                  placeholder="Ex: CORTEVIP20"
                  className="w-full bg-[#121622] border border-[#222a3d] rounded-lg px-3 py-2 text-white font-mono uppercase focus:outline-hidden focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-slate-300 font-medium block mb-1">Desconto (R$)</label>
                <input
                  type="number"
                  value={descontoValor}
                  onChange={(e) => setDescontoValor(e.target.value)}
                  className="w-full bg-[#121622] border border-[#222a3d] rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-slate-300 font-medium block mb-1">Pontos Necessários</label>
                <input
                  type="number"
                  value={pontosNecessarios}
                  onChange={(e) => setPontosNecessarios(e.target.value)}
                  className="w-full bg-[#121622] border border-[#222a3d] rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNovoCupomOpen(false)}
                  className="px-3 py-2 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-700 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-lg"
                >
                  Criar cupom
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
