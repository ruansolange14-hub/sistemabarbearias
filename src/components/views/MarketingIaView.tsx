import React, { useState } from 'react';
import { useBarber } from '../../context/BarberContext';
import {
  Sparkles,
  Bot,
  MessageCircle,
  Clock,
  Users,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  Send,
  Copy,
  Check,
  Calendar,
} from 'lucide-react';
import { AutomacaoMarketing, CampanhaMarketing } from '../../types';

export const MarketingIaView: React.FC = () => {
  const {
    config,
    automacoes,
    toggleAutomacao,
    campanhas,
    addCampanha,
    setActiveView,
  } = useBarber();

  const [activeTab, setActiveTab] = useState<'visao_geral' | 'automacoes' | 'campanhas' | 'fila'>('visao_geral');
  const [periodo, setPeriodo] = useState<'30' | '60' | '90'>('30');

  // Generator modal
  const [isCampanhaModalOpen, setIsCampanhaModalOpen] = useState(false);
  const [objetivoCampanha, setObjetivoCampanha] = useState('Preencher horários vagos de terça e quarta-feira');
  const [gerandoIA, setGerandoIA] = useState(false);
  const [campanhaGerada, setCampanhaGerada] = useState<string>('');
  const [copiadoToast, setCopiadoToast] = useState(false);

  const ativasCount = automacoes.filter((a) => a.ativa).length;

  const handleGerarCampanha = () => {
    setGerandoIA(true);
    setTimeout(() => {
      const copy = `✂️ Fala meu amigo! Tudo certo?

Aqui é da *${config.nome}*! 💈
Notamos que a semana começou e queremos te presentear: agendando seu corte para *terça ou quarta*, você ganha uma higienização capilar premium de cortesia! 

Restam poucos horários livres com o barbeiro Ruan santos.

📲 Garanta o seu antes que lote:
${config.linkAgendaPublica}

Te esperamos na cadeira! 🔥`;
      setCampanhaGerada(copy);
      setGerandoIA(false);
    }, 700);
  };

  const handleSalvarCampanha = () => {
    if (!campanhaGerada) return;
    const newCamp: CampanhaMarketing = {
      id: `camp-${Date.now()}`,
      titulo: 'Promoção Meio de Semana VIP',
      objetivo: objetivoCampanha,
      mensagem: campanhaGerada,
      criadaEm: new Date().toLocaleDateString('pt-BR'),
      destinatarios: 28,
      status: 'enviada',
    };
    addCampanha(newCamp);
    setIsCampanhaModalOpen(false);
    setCampanhaGerada('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header matching exact copy */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Marketing IA</span>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 font-bold border border-blue-800/60 uppercase">
              IA
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Mensagens automáticas, recuperação de clientes e campanhas em um só lugar
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#161a25] border border-[#242c3f] px-3.5 py-1.5 rounded-xl self-start sm:self-auto">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold text-white">
            {config.tokensIA}{' '}
            <span className="text-slate-400 font-normal">tokens disponíveis</span>
          </span>
        </div>
      </div>

      {/* Tabs bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto bg-[#161a25] border border-[#242c3f] p-2 rounded-xl text-xs font-semibold">
        {[
          { id: 'visao_geral', label: 'Visão geral' },
          { id: 'automacoes', label: 'Automações' },
          { id: 'campanhas', label: 'Campanhas' },
          { id: 'fila', label: 'Fila de envios' },
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

      {/* Teste do Marketing IA — 50 tokens Banner */}
      <div className="bg-[#161a25] border border-blue-900/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Teste do Marketing IA — 50 tokens</span>
          </h3>
          <p className="text-xs text-slate-300">
            Durante o período de teste você pode experimentar as automações e campanhas. Saldo atual:{' '}
            <strong className="text-blue-400">{config.tokensIA} tokens</strong>.
          </p>
        </div>

        <button
          onClick={() => setActiveView('plano')}
          className="bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs px-3.5 py-2 rounded-lg transition-all whitespace-nowrap self-start sm:self-auto flex items-center gap-1 shadow-md shadow-blue-950/40"
        >
          <span>Ver planos</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Resultado do período & 4 Metrics */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300">Resultado do período</span>
          <div className="flex items-center gap-1 bg-[#161a25] p-1 rounded-lg border border-[#242c3f]">
            {(['30', '60', '90'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriodo(p)}
                className={`px-2.5 py-0.5 rounded font-medium ${
                  periodo === p ? 'bg-blue-700 text-white font-bold' : 'text-slate-400'
                }`}
              >
                {p} dias
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-4 shadow-sm">
            <span className="text-[11px] text-slate-400 block font-medium">
              Mensagens enviadas
            </span>
            <div className="text-2xl font-bold text-white mt-1">0</div>
            <span className="text-[10px] text-slate-500 block">
              0 aguardando na fila
            </span>
          </div>

          <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-4 shadow-sm">
            <span className="text-[11px] text-slate-400 block font-medium">
              Clientes recuperados
            </span>
            <div className="text-2xl font-bold text-emerald-400 mt-1">0</div>
            <span className="text-[10px] text-slate-500 block">
              Voltaram a agendar depois da mensagem
            </span>
          </div>

          <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-4 shadow-sm">
            <span className="text-[11px] text-slate-400 block font-medium">
              Vagas preenchidas
            </span>
            <div className="text-2xl font-bold text-blue-400 mt-1">0</div>
            <span className="text-[10px] text-slate-500 block">
              Cancelamentos reocupados pelo Autopilot
            </span>
          </div>

          <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-4 shadow-sm">
            <span className="text-[11px] text-slate-400 block font-medium">
              Receita atribuída
            </span>
            <div className="text-2xl font-bold text-white mt-1">R$ 0,00</div>
            <span className="text-[10px] text-slate-500 block">
              Recuperação + Autopilot
            </span>
          </div>
        </div>
      </div>

      {/* Section "Precisa da sua atenção" matching exact user transcription */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          Precisa da sua atenção
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {automacoes.map((item) => (
            <div
              key={item.id}
              className="bg-[#161a25] border border-[#242c3f] hover:border-blue-700/50 rounded-xl p-4 flex items-center justify-between gap-3 transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-xs md:text-sm">
                    {item.nome}{' '}
                    <span
                      className={`text-[11px] font-normal ${
                        item.ativa ? 'text-emerald-400' : 'text-slate-400'
                      }`}
                    >
                      está {item.ativa ? 'ativada' : 'desativada'}
                    </span>
                  </h4>
                </div>
                <p className="text-[11px] text-slate-400">{item.descricao}</p>
              </div>

              <button
                onClick={() => toggleAutomacao(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  item.ativa
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                    : 'bg-blue-700 hover:bg-blue-600 text-white'
                }`}
              >
                {item.ativa ? 'Ativada' : 'Ativar'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Section "Nenhuma campanha criada no período" */}
      <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-6 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400 mx-auto">
          <MessageCircle className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-white">
          Nenhuma campanha criada no período
        </h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Gere uma promoção com IA para preencher os dias mais fracos.
        </p>
        <button
          onClick={() => {
            setIsCampanhaModalOpen(true);
            handleGerarCampanha();
          }}
          className="bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all shadow-md shadow-blue-950/40 inline-flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Criar campanha</span>
        </button>
      </div>

      {/* Section "Automações: X de 11 ativas" */}
      <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-4 flex items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-white">Automações</h4>
          <span className="text-xs text-slate-400">
            {ativasCount} de 11 ativas
          </span>
        </div>

        <button
          onClick={() => setActiveTab('automacoes')}
          className="bg-[#182032] hover:bg-[#202c45] text-blue-300 border border-blue-700/40 px-3.5 py-1.5 rounded-lg text-xs font-semibold"
        >
          Gerenciar automações
        </button>
      </div>

      {/* AI Campaign Generator Modal */}
      {isCampanhaModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#161a25] border border-[#26324b] rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#232a3d] pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>Gerar Campanha com IA</span>
              </h3>
              <button
                onClick={() => setIsCampanhaModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">
                  Qual o objetivo desta campanha?
                </label>
                <input
                  type="text"
                  value={objetivoCampanha}
                  onChange={(e) => setObjetivoCampanha(e.target.value)}
                  placeholder="Ex: Preencher horários vagos de terça e quarta"
                  className="w-full bg-[#121622] border border-[#242c3f] rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <button
                type="button"
                onClick={handleGerarCampanha}
                disabled={gerandoIA}
                className="w-full bg-[#182032] hover:bg-[#202c45] text-blue-300 border border-blue-700/40 py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>{gerandoIA ? 'Gerando com IA...' : 'Regerar texto com IA'}</span>
              </button>

              {campanhaGerada && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-300 font-medium">
                      Mensagem gerada para WhatsApp:
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(campanhaGerada);
                        setCopiadoToast(true);
                        setTimeout(() => setCopiadoToast(false), 2000);
                      }}
                      className="text-[11px] text-blue-400 hover:underline flex items-center gap-1"
                    >
                      {copiadoToast ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiadoToast ? 'Copiado!' : 'Copiar texto'}</span>
                    </button>
                  </div>
                  <textarea
                    rows={8}
                    value={campanhaGerada}
                    onChange={(e) => setCampanhaGerada(e.target.value)}
                    className="w-full bg-[#121622] border border-[#242c3f] rounded-lg p-3 text-white text-xs font-mono leading-relaxed focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#232a3d]">
              <button
                type="button"
                onClick={() => setIsCampanhaModalOpen(false)}
                className="px-3 py-2 text-slate-400 hover:text-white text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSalvarCampanha}
                className="bg-blue-700 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-lg text-xs"
              >
                Salvar e ativar campanha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
