import React, { useState } from 'react';
import { useSuperAdmin } from '../../../context/SuperAdminContext';
import {
  Settings,
  Building,
  DollarSign,
  FileCheck,
  Bell,
  Zap,
  Check,
  Shield,
  MessageCircle,
  CreditCard,
} from 'lucide-react';

export const SAConfiguracoesView: React.FC = () => {
  const { platformConfig, updatePlatformConfig } = useSuperAdmin();

  const [activeTab, setActiveTab] = useState<'geral' | 'negocio' | 'assinaturas' | 'notificacoes' | 'integracoes'>('geral');
  const [salvo, setSalvo] = useState(false);

  // States
  const [nomePlataforma, setNomePlataforma] = useState(platformConfig.geral.nomePlataforma);
  const [emailContato, setEmailContato] = useState(platformConfig.geral.emailContato);
  const [telefoneSuporte, setTelefoneSuporte] = useState(platformConfig.geral.telefoneSuporte);

  const [moeda, setMoeda] = useState(platformConfig.negocio.moeda);
  const [fusoHorario, setFusoHorario] = useState(platformConfig.negocio.fusoHorario);
  const [regrasGerais, setRegrasGerais] = useState(platformConfig.negocio.regrasGerais);

  const [diasTeste, setDiasTeste] = useState(platformConfig.assinaturas.diasPeriodoTeste.toString());
  const [diasAtrasoSuspender, setDiasAtrasoSuspender] = useState(platformConfig.assinaturas.diasAtrasoParaSuspender.toString());
  const [diasAvisoVencimento, setDiasAvisoVencimento] = useState(platformConfig.assinaturas.diasAvisoAntesVencimento.toString());

  const [gatewayProvedor, setGatewayProvedor] = useState(platformConfig.integracoes.gatewayProvedor);
  const [gatewayAmbiente, setGatewayAmbiente] = useState(platformConfig.integracoes.gatewayAmbiente);
  const [whatsappProvedor, setWhatsappProvedor] = useState(platformConfig.integracoes.whatsappProvedor);

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlatformConfig({
      geral: {
        ...platformConfig.geral,
        nomePlataforma,
        emailContato,
        telefoneSuporte,
      },
      negocio: {
        ...platformConfig.negocio,
        moeda,
        fusoHorario,
        regrasGerais,
      },
      assinaturas: {
        ...platformConfig.assinaturas,
        diasPeriodoTeste: parseInt(diasTeste) || 14,
        diasAtrasoParaSuspender: parseInt(diasAtrasoSuspender) || 15,
        diasAvisoAntesVencimento: parseInt(diasAvisoVencimento) || 3,
      },
      integracoes: {
        ...platformConfig.integracoes,
        gatewayProvedor,
        gatewayAmbiente,
        whatsappProvedor,
      },
    });

    setSalvo(true);
    setTimeout(() => setSalvo(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span>Configurações Globais da Plataforma</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Parâmetros operacionais do SaaS, regras comerciais de inadimplência e camadas de integração.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Sub-nav */}
        <div className="md:col-span-4 lg:col-span-3 space-y-1">
          {[
            { id: 'geral', label: 'Geral', desc: 'Identidade e Contato', icon: Building },
            { id: 'negocio', label: 'Negócio', desc: 'Moeda e Fusos', icon: DollarSign },
            { id: 'assinaturas', label: 'Assinaturas', desc: 'Trial e Tolerância', icon: FileCheck },
            { id: 'notificacoes', label: 'Notificações', desc: 'Canais e Alertas', icon: Bell },
            { id: 'integracoes', label: 'Integrações', desc: 'Gateways e WhatsApp', icon: Zap },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full text-left p-3 rounded-2xl transition-all border ${
                  isActive
                    ? 'bg-[#182032] border-blue-600/50 text-white shadow-xs'
                    : 'bg-[#161a25] border-transparent text-slate-400 hover:text-white hover:bg-[#1a2030]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                  <div>
                    <span className="font-bold text-xs block text-slate-200">{tab.label}</span>
                    <span className="text-[10px] text-slate-500 block">{tab.desc}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Content Form */}
        <div className="md:col-span-8 lg:col-span-9 bg-[#161a25] border border-[#242c3f] rounded-3xl p-6 shadow-sm space-y-6">
          <form onSubmit={handleSalvar} className="space-y-5 text-xs">
            {/* GERAL */}
            {activeTab === 'geral' && (
              <div className="space-y-4">
                <h3 className="font-bold text-white text-sm border-b border-[#242c3f] pb-2">
                  Configurações Gerais
                </h3>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Nome da Plataforma</label>
                  <input
                    type="text"
                    value={nomePlataforma}
                    onChange={(e) => setNomePlataforma(e.target.value)}
                    className="w-full bg-[#121622] border border-[#222a3d] rounded-xl px-3.5 py-2 text-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">E-mail de Contato/Suporte</label>
                    <input
                      type="email"
                      value={emailContato}
                      onChange={(e) => setEmailContato(e.target.value)}
                      className="w-full bg-[#121622] border border-[#222a3d] rounded-xl px-3.5 py-2 text-white focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Telefone / WhatsApp Geral</label>
                    <input
                      type="text"
                      value={telefoneSuporte}
                      onChange={(e) => setTelefoneSuporte(e.target.value)}
                      className="w-full bg-[#121622] border border-[#222a3d] rounded-xl px-3.5 py-2 text-white focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* NEGÓCIO */}
            {activeTab === 'negocio' && (
              <div className="space-y-4">
                <h3 className="font-bold text-white text-sm border-b border-[#242c3f] pb-2">
                  Parâmetros de Negócio
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Moeda Padrão</label>
                    <input
                      type="text"
                      value={moeda}
                      onChange={(e) => setMoeda(e.target.value)}
                      className="w-full bg-[#121622] border border-[#222a3d] rounded-xl px-3.5 py-2 text-white focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Fuso Horário Padrão</label>
                    <input
                      type="text"
                      value={fusoHorario}
                      onChange={(e) => setFusoHorario(e.target.value)}
                      className="w-full bg-[#121622] border border-[#222a3d] rounded-xl px-3.5 py-2 text-white focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Regras Gerais de Cobrança</label>
                  <textarea
                    rows={3}
                    value={regrasGerais}
                    onChange={(e) => setRegrasGerais(e.target.value)}
                    className="w-full bg-[#121622] border border-[#222a3d] rounded-xl p-3 text-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* ASSINATURAS */}
            {activeTab === 'assinaturas' && (
              <div className="space-y-4">
                <h3 className="font-bold text-white text-sm border-b border-[#242c3f] pb-2">
                  Regras de Assinatura e Tolerância
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Período de Teste (Dias)</label>
                    <input
                      type="number"
                      value={diasTeste}
                      onChange={(e) => setDiasTeste(e.target.value)}
                      className="w-full bg-[#121622] border border-[#222a3d] rounded-xl px-3.5 py-2 text-white focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Dias p/ Suspensão</label>
                    <input
                      type="number"
                      value={diasAtrasoSuspender}
                      onChange={(e) => setDiasAtrasoSuspender(e.target.value)}
                      className="w-full bg-[#121622] border border-[#222a3d] rounded-xl px-3.5 py-2 text-white focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Aviso Prévio (Dias)</label>
                    <input
                      type="number"
                      value={diasAvisoVencimento}
                      onChange={(e) => setDiasAvisoVencimento(e.target.value)}
                      className="w-full bg-[#121622] border border-[#222a3d] rounded-xl px-3.5 py-2 text-white focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* INTEGRAÇÕES */}
            {activeTab === 'integracoes' && (
              <div className="space-y-4">
                <h3 className="font-bold text-white text-sm border-b border-[#242c3f] pb-2">
                  Camada de Abstração de Gateways e WhatsApp
                </h3>
                <p className="text-xs text-slate-400">
                  Arquitetura desacoplada para processamento real de PIX, Cartão e mensagens sem amarrar a plataforma a um único fornecedor.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-[#121622] p-4 rounded-2xl border border-[#222a3d] space-y-3">
                    <span className="font-bold text-white text-xs flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-blue-400" />
                      Gateway de Pagamento
                    </span>
                    <div>
                      <label className="text-slate-400 text-[11px] block mb-1">Provedor Ativo</label>
                      <select
                        value={gatewayProvedor}
                        onChange={(e) => setGatewayProvedor(e.target.value as any)}
                        className="w-full bg-[#161a25] border border-[#26324b] rounded-xl px-3 py-1.5 text-white focus:outline-hidden focus:border-blue-500"
                      >
                        <option value="MercadoPago">MercadoPago (Recomendado BR)</option>
                        <option value="Asaas">Asaas (Boleto & PIX Automático)</option>
                        <option value="Stripe">Stripe (Global & Cartão)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-400 text-[11px] block mb-1">Ambiente</label>
                      <select
                        value={gatewayAmbiente}
                        onChange={(e) => setGatewayAmbiente(e.target.value as any)}
                        className="w-full bg-[#161a25] border border-[#26324b] rounded-xl px-3 py-1.5 text-white focus:outline-hidden focus:border-blue-500"
                      >
                        <option value="sandbox">Sandbox / Homologação</option>
                        <option value="production">Produção</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-[#121622] p-4 rounded-2xl border border-[#222a3d] space-y-3">
                    <span className="font-bold text-white text-xs flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                      Provedor WhatsApp API
                    </span>
                    <div>
                      <label className="text-slate-400 text-[11px] block mb-1">Provedor de Disparos</label>
                      <select
                        value={whatsappProvedor}
                        onChange={(e) => setWhatsappProvedor(e.target.value as any)}
                        className="w-full bg-[#161a25] border border-[#26324b] rounded-xl px-3 py-1.5 text-white focus:outline-hidden focus:border-blue-500"
                      >
                        <option value="EvolutionAPI">Evolution API (Open Source)</option>
                        <option value="Z-API">Z-API (Instância Cloud)</option>
                        <option value="MetaCloudAPI">Meta Cloud API Oficial</option>
                      </select>
                    </div>
                    <div className="text-[11px] text-slate-400 pt-2">
                      Estado: <span className="text-amber-400 font-semibold">Abstração pronta para webhook</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-[#242c3f]">
              {salvo ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5 text-xs">
                  <Check className="w-4 h-4" /> Configurações salvas e auditadas com sucesso!
                </span>
              ) : (
                <span className="text-slate-500 text-[11px]">
                  Todas as alterações geram registros na trilha de auditoria.
                </span>
              )}

              <button
                type="submit"
                className="bg-blue-700 hover:bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl shadow-md shadow-blue-950/40"
              >
                Salvar Configurações
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
