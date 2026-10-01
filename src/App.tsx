import React, { useState, useEffect } from 'react';
import { BarberProvider, useBarber } from './context/BarberContext';
import { SuperAdminProvider, useSuperAdmin } from './context/SuperAdminContext';

// Tenant Components
import { TopBanner } from './components/TopBanner';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/views/DashboardView';
import { AgendaView } from './components/views/AgendaView';
import { ClientesView } from './components/views/ClientesView';
import { ServicosView } from './components/views/ServicosView';
import { FuncionariosView } from './components/views/FuncionariosView';
import { MeuDesempenhoView } from './components/views/MeuDesempenhoView';
import { FinanceiroView } from './components/views/FinanceiroView';
import { MarketingIaView } from './components/views/MarketingIaView';
import { FidelizacaoView } from './components/views/FidelizacaoView';
import { ConsultorIaView } from './components/views/ConsultorIaView';
import { PlanoView } from './components/views/PlanoView';
import { ConfiguracoesView } from './components/views/ConfiguracoesView';

// Tenant Modals
import { NovoAgendamentoModal } from './components/modals/NovoAgendamentoModal';
import { NovoClienteModal } from './components/modals/NovoClienteModal';
import { NovoServicoModal } from './components/modals/NovoServicoModal';
import { NovoLancamentoModal } from './components/modals/NovoLancamentoModal';
import { PublicBookingModal } from './components/modals/PublicBookingModal';
import { TourModal } from './components/modals/TourModal';
import { SupportModal } from './components/modals/SupportModal';

// Super Admin Components
import { SALoginView } from './components/superadmin/views/SALoginView';
import { SuperAdminLayout } from './components/superadmin/SuperAdminLayout';
import { SADashboardView } from './components/superadmin/views/SADashboardView';
import { SABarbeariasView } from './components/superadmin/views/SABarbeariasView';
import { SABarbeariaDetailView } from './components/superadmin/views/SABarbeariaDetailView';
import { SAPlanosView } from './components/superadmin/views/SAPlanosView';
import { SAAssinaturasView } from './components/superadmin/views/SAAssinaturasView';
import { SAPagamentosView } from './components/superadmin/views/SAPagamentosView';
import { SAInadimplenciaView } from './components/superadmin/views/SAInadimplenciaView';
import { SAUsuariosView } from './components/superadmin/views/SAUsuariosView';
import { SAMetricasView } from './components/superadmin/views/SAMetricasView';
import { SAAvisosView } from './components/superadmin/views/SAAvisosView';
import { SAConfiguracoesView } from './components/superadmin/views/SAConfiguracoesView';
import { SAAuditoriaView } from './components/superadmin/views/SAAuditoriaView';

// Cliente Portal Component (barberpilot.app/cliente)
import { ClientePortal } from './components/cliente/ClientePortal';

import { Menu, ShieldAlert, ExternalLink, Shield, Headphones, Smartphone } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { activeView, openPublicBooking, openSupport, config } = useBarber();
  const {
    isSuperAdminAuthenticated,
    currentSAView,
    barbearias,
  } = useSuperAdmin();

  // Root routing mode: 'tenant' or 'super-admin' or 'cliente'
  const [appMode, setAppMode] = useState<'tenant' | 'super-admin' | 'cliente'>(() => {
    // Check if initial URL or query param requested Super Admin or Cliente Portal
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const search = window.location.search;
      if (path.startsWith('/super-admin') || search.includes('mode=super-admin')) {
        return 'super-admin';
      }
      if (path.startsWith('/cliente') || search.includes('mode=cliente') || search.includes('portal=cliente')) {
        return 'cliente';
      }
    }
    return 'tenant';
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if current tenant barbearia is suspended
  const currentTenantInfo = barbearias.find((b) => b.id === 'barbearia-1');
  const isTenantSuspended = currentTenantInfo?.status === 'SUSPENSA';

  // If in Cliente Portal Mode (https://barberpilot.app/cliente)
  if (appMode === 'cliente') {
    return (
      <ClientePortal
        onBackToBarbearia={() => setAppMode('tenant')}
        onOpenSuperAdmin={() => setAppMode('super-admin')}
      />
    );
  }

  // If in Super Admin Mode
  if (appMode === 'super-admin') {
    if (!isSuperAdminAuthenticated) {
      return <SALoginView onBackToApp={() => setAppMode('tenant')} />;
    }

    return (
      <SuperAdminLayout onExitSuperAdmin={() => setAppMode('tenant')}>
        {currentSAView === 'dashboard' && <SADashboardView />}
        {currentSAView === 'barbearias' && <SABarbeariasView />}
        {currentSAView === 'barbearia-detalhes' && <SABarbeariaDetailView />}
        {currentSAView === 'planos' && <SAPlanosView />}
        {currentSAView === 'assinaturas' && <SAAssinaturasView />}
        {currentSAView === 'pagamentos' && <SAPagamentosView />}
        {currentSAView === 'inadimplencia' && <SAInadimplenciaView />}
        {currentSAView === 'usuarios' && <SAUsuariosView />}
        {currentSAView === 'metricas' && <SAMetricasView />}
        {currentSAView === 'avisos' && <SAAvisosView />}
        {currentSAView === 'configuracoes' && <SAConfiguracoesView />}
        {currentSAView === 'auditoria' && <SAAuditoriaView />}
      </SuperAdminLayout>
    );
  }

  // Tenant Suspension Lock Screen (with full historical preservation)
  if (isTenantSuspended) {
    return (
      <div className="min-h-screen bg-[#0f1218] text-slate-100 flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-lg w-full bg-[#161a25] border-2 border-rose-500/50 rounded-3xl p-8 text-center space-y-6 shadow-2xl relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 mx-auto flex items-center justify-center">
            <ShieldAlert className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider bg-rose-500/15 px-3 py-1 rounded-full border border-rose-500/30">
              Acesso Administrativo Temporariamente Suspenso
            </span>
            <h1 className="text-2xl font-extrabold text-white">
              {config.nome}
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
              Esta barbearia foi suspensa pela administração da plataforma.
            </p>
          </div>

          <div className="bg-[#121622] p-4 rounded-2xl border border-[#242c3f] text-xs text-left space-y-2">
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Motivo registrado:</span>
              <span className="text-rose-300 font-medium">
                {currentTenantInfo?.motivoSuspensao || 'Suspensão manual de segurança'}
              </span>
            </div>
            <p className="text-emerald-400 text-[11px]">
              ✓ Todos os seus dados, histórico de clientes, serviços e finanças estão 100% seguros e preservados.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={openSupport}
              className="w-full sm:w-auto bg-blue-700 hover:bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-900/40"
            >
              <Headphones className="w-4 h-4" />
              <span>Falar com o Suporte</span>
            </button>

            <button
              onClick={() => setAppMode('super-admin')}
              className="w-full sm:w-auto bg-[#182030] hover:bg-[#1e283d] text-slate-300 border border-[#2b3752] font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>Acesso Super Admin</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Normal Tenant Barbearia App
  return (
    <div className="min-h-screen bg-[#0f1218] text-slate-100 flex flex-col font-sans">
      {/* Top Warning Banner */}
      <TopBanner />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <Sidebar
          mobileOpen={mobileMenuOpen}
          setMobileOpen={setMobileMenuOpen}
          onOpenSuperAdmin={() => setAppMode('super-admin')}
          onOpenClientePortal={() => setAppMode('cliente')}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Mobile Bar */}
          <header className="lg:hidden bg-[#131722] border-b border-[#232a3d] p-3.5 flex items-center justify-between sticky top-0 z-30">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 rounded-lg bg-[#19202f] text-slate-200 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>

            <span className="font-bold text-sm text-white">
              Barber<span className="text-blue-500">Pilot</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setAppMode('cliente')}
                className="text-xs bg-emerald-950/70 text-emerald-300 border border-emerald-800/60 px-2 py-1 rounded-lg font-medium flex items-center gap-1"
                title="Área do Cliente"
              >
                <Smartphone className="w-3 h-3" />
                <span>Cliente</span>
              </button>

              <button
                onClick={() => setAppMode('super-admin')}
                className="text-xs bg-blue-950/70 text-blue-300 border border-blue-800/60 px-2 py-1 rounded-lg font-medium flex items-center gap-1"
                title="Acesso Super Admin"
              >
                <Shield className="w-3 h-3" />
                <span>Admin</span>
              </button>

              <button
                onClick={openPublicBooking}
                className="text-xs bg-blue-900/50 hover:bg-blue-800/60 text-blue-300 border border-blue-700/60 px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-colors"
              >
                <span>Site</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </header>

          {/* Page View Viewport */}
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {activeView === 'dashboard' && <DashboardView />}
            {activeView === 'agenda' && <AgendaView />}
            {activeView === 'clientes' && <ClientesView />}
            {activeView === 'servicos' && <ServicosView />}
            {activeView === 'funcionarios' && <FuncionariosView />}
            {activeView === 'meu-desempenho' && <MeuDesempenhoView />}
            {activeView === 'financeiro' && <FinanceiroView />}
            {activeView === 'marketing-ia' && <MarketingIaView />}
            {activeView === 'fidelizacao' && <FidelizacaoView />}
            {activeView === 'consultor-ia' && <ConsultorIaView />}
            {activeView === 'plano' && <PlanoView />}
            {activeView === 'configuracoes' && <ConfiguracoesView />}
          </main>
        </div>
      </div>

      {/* Global Tenant Modals */}
      <NovoAgendamentoModal />
      <NovoClienteModal />
      <NovoServicoModal />
      <NovoLancamentoModal />
      <PublicBookingModal />
      <TourModal />
      <SupportModal />
    </div>
  );
};

export default function App() {
  return (
    <SuperAdminProvider>
      <BarberProvider>
        <MainAppContent />
      </BarberProvider>
    </SuperAdminProvider>
  );
}
