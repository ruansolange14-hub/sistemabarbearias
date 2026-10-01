import React, { useState } from 'react';
import { useSuperAdmin } from '../../context/SuperAdminContext';
import { SuperAdminViewType } from '../../types/superAdmin';
import {
  ShieldAlert,
  LayoutDashboard,
  Building2,
  FileCheck,
  Package,
  Users,
  CreditCard,
  AlertTriangle,
  LineChart,
  Megaphone,
  Settings,
  History,
  LogOut,
  Bell,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  Shield,
  Search,
  CheckCircle,
  HelpCircle,
  Zap,
} from 'lucide-react';

interface SuperAdminLayoutProps {
  children: React.ReactNode;
  onExitSuperAdmin: () => void;
}

export const SuperAdminLayout: React.FC<SuperAdminLayoutProps> = ({
  children,
  onExitSuperAdmin,
}) => {
  const {
    currentSAView,
    setCurrentSAView,
    superAdminUser,
    logoutSuperAdmin,
    notifications,
    marcarNotificacaoLida,
    marcarTodasNotificacoesLidas,
  } = useSuperAdmin();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.lida).length;

  const menuItems: {
    id: SuperAdminViewType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'barbearias', label: 'Barbearias', icon: Building2 },
    { id: 'assinaturas', label: 'Assinaturas', icon: FileCheck },
    { id: 'planos', label: 'Planos', icon: Package },
    { id: 'usuarios', label: 'Usuários', icon: Users },
    { id: 'pagamentos', label: 'Pagamentos', icon: CreditCard },
    { id: 'inadimplencia', label: 'Inadimplência', icon: AlertTriangle, badge: 'Atenção' },
    { id: 'metricas', label: 'Métricas', icon: LineChart },
    { id: 'avisos', label: 'Avisos', icon: Megaphone },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
    { id: 'auditoria', label: 'Logs / Auditoria', icon: History },
  ];

  const handleNavClick = (view: SuperAdminViewType) => {
    setCurrentSAView(view);
    setMobileMenuOpen(false);
  };

  const getBreadcrumbLabel = () => {
    switch (currentSAView) {
      case 'dashboard':
        return 'Visão Geral do SaaS';
      case 'barbearias':
        return 'Gestão de Barbearias';
      case 'barbearia-detalhes':
        return 'Detalhes da Barbearia';
      case 'assinaturas':
        return 'Assinaturas Ativas & Histórico';
      case 'planos':
        return 'Planos Comerciais';
      case 'usuarios':
        return 'Usuários da Plataforma';
      case 'pagamentos':
        return 'Histórico de Pagamentos';
      case 'inadimplencia':
        return 'Controle de Inadimplência';
      case 'metricas':
        return 'Métricas & Crescimento';
      case 'avisos':
        return 'Avisos & Comunicados Globais';
      case 'configuracoes':
        return 'Configurações da Plataforma';
      case 'auditoria':
        return 'Trilha de Auditoria';
      default:
        return 'Administração';
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1218] text-slate-100 flex flex-col font-sans">
      {/* Super Admin Top Notice Ribbon */}
      <div className="bg-gradient-to-r from-[#121825] via-[#162238] to-[#121825] px-4 py-1.5 text-xs text-blue-200 border-b border-blue-900/40 flex items-center justify-between z-40">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-semibold text-white">MODO SUPER ADMINISTRADOR</span>
          <span className="hidden sm:inline text-blue-300/80">
            — Gestão global de tenants, assinaturas e faturamento SaaS
          </span>
        </div>

        <button
          onClick={onExitSuperAdmin}
          className="text-[11px] bg-blue-900/50 hover:bg-blue-800/60 text-blue-300 border border-blue-700/50 px-2.5 py-0.5 rounded transition-colors flex items-center gap-1"
        >
          <span>Ir para Barbearia (Tenant)</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Mobile Backdrop */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:static top-0 bottom-0 left-0 w-64 bg-[#131722] border-r border-[#232a3d] z-50 flex flex-col transition-transform duration-200 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-[#232a3d] flex items-center justify-between bg-[#161a25]">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-700 to-blue-950 flex items-center justify-center text-white shadow-lg shadow-blue-900/40 font-extrabold text-sm border border-blue-600/30">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-base tracking-tight text-white block">
                  Barber<span className="text-blue-500">Pilot</span>
                </span>
                <span className="text-[10px] text-blue-400 font-mono font-semibold tracking-wider uppercase block">
                  SUPER ADMIN
                </span>
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto px-2.5 py-4 space-y-1">
            <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Menu Principal
            </div>

            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSAView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-blue-950/70 text-blue-200 border border-blue-800/60 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#181f2e]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Preparation for future modules */}
            <div className="pt-4 pb-1">
              <div className="h-px bg-[#232a3d] mx-2" />
              <div className="px-3 pt-3 pb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Em Breve / Preparado
              </div>
              <div className="space-y-0.5 text-xs text-slate-500">
                <button
                  onClick={() => setCurrentSAView('configuracoes')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:text-slate-400"
                >
                  <span className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-slate-500" />
                    <span>Gateways de Pagamento</span>
                  </span>
                  <span className="text-[9px] text-slate-600 font-mono">v3.0</span>
                </button>
              </div>
            </div>
          </div>

          {/* User profile & logout */}
          <div className="p-3 border-t border-[#232a3d] bg-[#10141f] space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-700 to-blue-950 text-white font-bold text-xs flex items-center justify-center border border-blue-600/40">
                SA
              </div>
              <div className="overflow-hidden leading-tight flex-1">
                <div className="text-xs font-bold text-white truncate">
                  {superAdminUser?.nome || 'Admin Master'}
                </div>
                <div className="text-[10px] text-blue-400 truncate">
                  SUPER_ADMIN
                </div>
              </div>
            </div>

            <button
              onClick={logoutSuperAdmin}
              className="w-full flex items-center justify-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 py-1.5 rounded-lg transition-colors border border-rose-500/20"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair do Super Admin</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Header */}
          <header className="bg-[#131722] border-b border-[#232a3d] px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-1.5 rounded-lg bg-[#182030] text-slate-300 hover:text-white"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 hidden sm:inline">Super Admin</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 hidden sm:inline" />
                <span className="font-bold text-white tracking-wide">
                  {getBreadcrumbLabel()}
                </span>
              </div>
            </div>

            {/* Right actions: Notifications & Quick Switch */}
            <div className="flex items-center gap-3 relative">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-xl bg-[#182030] hover:bg-[#202b40] text-slate-300 hover:text-white border border-[#26324b] transition-colors relative"
                  title="Central de Notificações"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Popover */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#161a25] border border-[#26324b] rounded-2xl shadow-2xl p-4 z-50 space-y-3">
                    <div className="flex items-center justify-between border-b border-[#232a3d] pb-2">
                      <div className="flex items-center gap-1.5">
                        <Bell className="w-4 h-4 text-blue-400" />
                        <h4 className="font-bold text-white text-xs">
                          Notificações da Plataforma
                        </h4>
                      </div>
                      <button
                        onClick={marcarTodasNotificacoesLidas}
                        className="text-[10px] text-blue-400 hover:underline"
                      >
                        Marcar todas como lidas
                      </button>
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => marcarNotificacaoLida(notif.id)}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                            notif.lida
                              ? 'bg-[#121622] border-[#222a3d] text-slate-400'
                              : 'bg-[#182133] border-blue-800/40 text-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white text-xs">
                              {notif.titulo}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {notif.dataHora}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 mt-1">
                            {notif.mensagem}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* View Tenant button */}
              <button
                onClick={onExitSuperAdmin}
                className="hidden sm:flex items-center gap-1.5 text-xs bg-[#182030] hover:bg-[#202b40] text-slate-200 hover:text-white border border-[#26324b] px-3 py-1.5 rounded-xl transition-all font-medium"
              >
                <span>Ver Barbearias</span>
                <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
              </button>
            </div>
          </header>

          {/* Viewport Content */}
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
