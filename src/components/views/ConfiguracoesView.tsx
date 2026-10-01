import React, { useState } from 'react';
import { useBarber } from '../../context/BarberContext';
import {
  Settings,
  Building2,
  Globe,
  Clock,
  Palette,
  Sparkles,
  Check,
  ExternalLink,
  MessageSquare,
  ArrowRight,
  Shield,
  Smartphone,
} from 'lucide-react';

export const ConfiguracoesView: React.FC = () => {
  const { config, updateConfig, setActiveView, openPublicBooking } = useBarber();

  const [activeTab, setActiveTab] = useState<'barbearia' | 'pagina_publica' | 'horarios' | 'aparencia' | 'creditos_ia'>('barbearia');

  // Form states
  const [telefoneAdmin, setTelefoneAdmin] = useState(config.telefoneAdmin);
  const [metaMensal, setMetaMensal] = useState(config.metaMensal.toString());
  const [tipoDoc, setTipoDoc] = useState<'CNPJ' | 'CPF'>(config.tipoDocumento);
  const [documento, setDocumento] = useState(config.documento);
  const [nomeFantasia, setNomeFantasia] = useState(config.nome);
  const [razaoSocial, setRazaoSocial] = useState(config.razaoSocial);
  const [googleReviewLink, setGoogleReviewLink] = useState(config.googleReviewLink);
  const [googleReviewMsg, setGoogleReviewMsg] = useState(config.googleReviewMsg);
  const [relatorioWhatsapp, setRelatorioWhatsapp] = useState(config.whatsappRelatorioSemanal);
  const [salvoFeedback, setSalvoFeedback] = useState(false);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateConfig({
      telefoneAdmin,
      metaMensal: parseFloat(metaMensal) || 0,
      tipoDocumento: tipoDoc,
      documento,
      nome: nomeFantasia,
      razaoSocial,
      googleReviewLink,
      googleReviewMsg,
      whatsappRelatorioSemanal: relatorioWhatsapp,
    });
    setSalvoFeedback(true);
    setTimeout(() => setSalvoFeedback(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Configurações
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Gerencie sua barbearia, site e equipe.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Sub-nav matching exact items */}
        <div className="md:col-span-4 lg:col-span-3 space-y-1">
          {[
            {
              id: 'barbearia',
              label: 'Barbearia',
              sub: 'Dados operacionais e fiscais',
              icon: Building2,
            },
            {
              id: 'pagina_publica',
              label: 'Página pública',
              sub: 'Site, identidade e domínio',
              icon: Globe,
            },
            {
              id: 'horarios',
              label: 'Horários',
              sub: 'Jornada de trabalho da equipe',
              icon: Clock,
            },
            {
              id: 'aparencia',
              label: 'Aparência',
              sub: 'Tema e visual do painel',
              icon: Palette,
            },
            {
              id: 'creditos_ia',
              label: 'Créditos IA',
              sub: 'Consumo e recarga de tokens',
              icon: Sparkles,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full text-left p-3 rounded-xl transition-all border ${
                  isActive
                    ? 'bg-[#182032] border-blue-600/50 text-white shadow-xs'
                    : 'bg-[#161a25] border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#1c2232]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-blue-400' : 'text-slate-400'
                    }`}
                  />
                  <div className="overflow-hidden">
                    <span className="font-bold text-xs block truncate text-slate-100">
                      {tab.label}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {tab.sub}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Tab Content */}
        <div className="md:col-span-8 lg:col-span-9 space-y-6">
          {activeTab === 'barbearia' && (
            <form onSubmit={handleSave} className="space-y-6">
              {/* Header Box */}
              <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white">Barbearia</h2>
                  <p className="text-xs text-slate-400">
                    Dados operacionais e fiscais
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Tudo salvo</span>
                  </span>

                  <button
                    type="submit"
                    className="bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg transition-all shadow-xs"
                  >
                    Salvar alterações
                  </button>
                </div>
              </div>

              {/* Dados operacionais */}
              <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-5 space-y-4 shadow-sm">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Dados operacionais
                  </h3>
                  <p className="text-xs text-slate-400">
                    Usados internamente no sistema.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-slate-300 font-medium block mb-1">
                      Telefone administrativo
                    </label>
                    <input
                      type="text"
                      value={telefoneAdmin}
                      onChange={(e) => setTelefoneAdmin(e.target.value)}
                      className="w-full bg-[#121622] border border-[#222a3d] rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-medium block mb-1">
                      Meta mensal (R$)
                    </label>
                    <input
                      type="number"
                      value={metaMensal}
                      onChange={(e) => setMetaMensal(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-[#121622] border border-[#222a3d] rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Cadastro da empresa */}
              <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Cadastro da empresa
                    </h3>
                    <p className="text-xs text-slate-400">
                      Dados fiscais e jurídicos. Aparecem em relatórios e recibos, nunca no site.
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Tudo salvo</span>
                  </span>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="text-slate-300 font-medium block mb-1">
                      Tipo de documento
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 text-slate-200 cursor-pointer">
                        <input
                          type="radio"
                          name="tipoDoc"
                          checked={tipoDoc === 'CNPJ'}
                          onChange={() => setTipoDoc('CNPJ')}
                          className="accent-blue-600"
                        />
                        <span>CNPJ</span>
                      </label>

                      <label className="flex items-center gap-1.5 text-slate-200 cursor-pointer">
                        <input
                          type="radio"
                          name="tipoDoc"
                          checked={tipoDoc === 'CPF'}
                          onChange={() => setTipoDoc('CPF')}
                          className="accent-blue-600"
                        />
                        <span>CPF</span>
                      </label>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Use CPF se você atua como autônomo (MEI sem CNPJ).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-300 font-medium block mb-1">
                        {tipoDoc}
                      </label>
                      <input
                        type="text"
                        value={documento}
                        onChange={(e) => setDocumento(e.target.value)}
                        className="w-full bg-[#121622] border border-[#222a3d] rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-slate-300 font-medium block mb-1">
                        Nome fantasia
                      </label>
                      <input
                        type="text"
                        value={nomeFantasia}
                        onChange={(e) => setNomeFantasia(e.target.value)}
                        className="w-full bg-[#121622] border border-[#222a3d] rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 font-medium block mb-1">
                      Razão social (nome empresarial)
                    </label>
                    <input
                      type="text"
                      value={razaoSocial}
                      onChange={(e) => setRazaoSocial(e.target.value)}
                      placeholder="Nome cadastrado na Receita Federal"
                      className="w-full bg-[#121622] border border-[#222a3d] rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Avaliações no Google */}
              <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-5 space-y-4 shadow-sm">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Avaliações no Google
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Ao concluir um atendimento na agenda, o cliente com WhatsApp cadastrado recebe automaticamente um convite para avaliar sua barbearia no Google.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="text-slate-300 font-medium block mb-1">
                      Link de avaliação do Google
                    </label>
                    <input
                      type="text"
                      value={googleReviewLink}
                      onChange={(e) => setGoogleReviewLink(e.target.value)}
                      className="w-full bg-[#121622] border border-[#222a3d] rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-blue-500 font-mono text-[11px]"
                    />
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Como encontrar: acesse o Perfil da Empresa no Google (google.com/business), abra sua barbearia, clique em Pedir avaliações e copie o link gerado. Também funciona buscando sua barbearia no Google Maps → Compartilhar.
                    </p>
                  </div>

                  <div>
                    <label className="text-slate-300 font-medium block mb-1">
                      Mensagem enviada (opcional)
                    </label>
                    <textarea
                      rows={6}
                      value={googleReviewMsg}
                      onChange={(e) => setGoogleReviewMsg(e.target.value)}
                      className="w-full bg-[#121622] border border-[#222a3d] rounded-lg p-3 text-white text-xs font-mono leading-relaxed focus:outline-hidden focus:border-blue-500"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Deixe em branco para usar a mensagem automática. Variáveis disponíveis: {'{cliente}'}, {'{barbearia}'}, {'{link}'}.
                    </p>
                  </div>
                </div>
              </div>

              {/* Relatório semanal por WhatsApp */}
              <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-5 flex items-center justify-between gap-4 shadow-sm">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-blue-400" />
                    <span>Relatório semanal por WhatsApp</span>
                  </h3>
                  <p className="text-xs text-slate-400 max-w-lg">
                    Toda segunda de manhã você recebe um resumo com atendimentos, faturamento, ticket médio e clientes sem retorno.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-semibold text-emerald-400 hidden sm:flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Tudo salvo</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => setRelatorioWhatsapp(!relatorioWhatsapp)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                      relatorioWhatsapp ? 'bg-blue-600 justify-end' : 'bg-slate-700 justify-start'
                    }`}
                  >
                    <div className="bg-white w-4 h-4 rounded-full shadow-md" />
                  </button>
                </div>
              </div>
            </form>
          )}

          {activeTab === 'pagina_publica' && (
            <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-5 space-y-4">
              <h3 className="text-base font-bold text-white">Página pública de agendamento</h3>
              <p className="text-xs text-slate-400">
                Este é o link que seus clientes usam para agendar horários online sozinhos pelo celular ou computador.
              </p>

              <div className="bg-[#121622] p-4 rounded-xl border border-[#222a3d] flex items-center justify-between gap-3 text-xs">
                <span className="font-mono text-blue-300 truncate">
                  {config.linkAgendaPublica}
                </span>

                <button
                  onClick={openPublicBooking}
                  className="bg-blue-700 hover:bg-blue-600 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 flex-shrink-0"
                >
                  <span>Testar página</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'horarios' && (
            <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-5 space-y-4">
              <h3 className="text-base font-bold text-white">Horários de Funcionamento</h3>
              <div className="space-y-2 text-xs">
                {['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'].map((dia) => (
                  <div key={dia} className="flex items-center justify-between py-2 border-b border-[#202738]">
                    <span className="font-semibold text-slate-200">{dia}</span>
                    <span className="text-blue-400 font-mono">09:00 - 19:00</span>
                  </div>
                ))}
                <div className="flex items-center justify-between py-2 text-slate-500">
                  <span>Domingo</span>
                  <span>Fechado</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'aparencia' && (
            <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-5 space-y-4">
              <h3 className="text-base font-bold text-white">Aparência do Painel</h3>
              <p className="text-xs text-slate-400">
                Tema selecionado conforme solicitado: <strong>Dark Acinzentado com Azul Escuro Profundo</strong>.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#121622] border-2 border-blue-500" />
                <span className="text-xs text-slate-200 font-medium">Dark Gray & Deep Blue (Ativo)</span>
              </div>
            </div>
          )}

          {activeTab === 'creditos_ia' && (
            <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-5 space-y-4">
              <h3 className="text-base font-bold text-white">Créditos de IA</h3>
              <p className="text-xs text-slate-400">
                Você possui <strong className="text-blue-400">{config.tokensIA} tokens</strong> disponíveis no plano Essencial.
              </p>
              <button
                onClick={() => setActiveView('plano')}
                className="bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-lg"
              >
                Fazer upgrade para Pro (300 tokens)
              </button>
            </div>
          )}

          {/* Promotional Banner matching exact prompt */}
          <div className="bg-gradient-to-br from-[#121825] to-[#162238] border border-blue-900/40 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Deixe do seu jeito</h3>
              <p className="text-xs text-slate-300">
                Ajuste horários, página pública, lembretes e identidade visual.
              </p>
              <p className="text-[11px] text-slate-400">
                Com um plano, sua página segue recebendo agendamentos.
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
      </div>
    </div>
  );
};
