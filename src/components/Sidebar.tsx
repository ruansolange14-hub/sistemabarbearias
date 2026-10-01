import React from 'react';
import { useBarber } from '../context/BarberContext';
import { ViewType } from '../types';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Scissors,
  UserCheck,
  TrendingUp,
  DollarSign,
  Sparkles,
  Award,
  Bot,
  CreditCard,
  Settings,
  ExternalLink,
  HelpCircle,
  Headphones,
  RotateCcw,
  Sparkle,
  Menu,
  X,
  Plane,
  Shield,
  Smartphone,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  onOpenSuperAdmin?: () => void;
  onOpenClientePortal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  mobileOpen,
  setMobileOpen,
  onOpenSuperAdmin,
  onOpenClientePortal,
}) => {
  const {
    activeView,
    setActiveView,
    config,
    openPublicBooking,
    openTour,
    openSupport,
  } = useBarber();

  const navItems: { id: ViewType; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'agenda', label: 'Agenda', icon: Calendar },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'servicos', label: 'Serviços', icon: Scissors },
    { id: 'funcionarios', label: 'Funcionários', icon: UserCheck },
    { id: 'meu-desempenho', label: 'Meu desempenho', icon: TrendingUp },
    { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
    { id: 'marketing-ia', label: 'Marketing IA', icon: Sparkles, badge: 'IA' },
    { id: 'fidelizacao', label: 'Fidelização', icon: Award },
    { id: 'consultor-ia', label: 'Consultor IA', icon: Bot, badge: 'Online' },
    { id: 'plano', label: 'Plano', icon: CreditCard },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
  ];

  const handleNavClick = (view: ViewType) => {
    setActiveView(view);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 w-64 bg-[#131722] border-r border-[#232a3d] z-50 flex flex-col transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Logo */}
        <div className="p-4 border-b border-[#232a3d] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center shadow-lg shadow-blue-900/40 text-white">
              <Plane className="w-5 h-5 transform -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-white font-sans">
                  Barber<span className="text-blue-500">Pilot</span>
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                GESTÃO INTELIGENTE
              </p>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barbearia Info Box */}
        <div className="p-3 border-b border-[#232a3d] bg-[#161a25]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              Barbearia
            </span>
            <button
              onClick={openPublicBooking}
              className="text-[11px] text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 hover:underline transition-colors"
              title="Abrir página pública de agendamento"
            >
              <span>meu site</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="font-semibold text-sm text-slate-100 truncate mb-1.5">
            {config.nome}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-blue-950/80 text-blue-300 border border-blue-800/60 rounded">
              {config.plano}
            </span>
            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded">
              {config.statusPlano}
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-blue-950/70 text-blue-200 border border-blue-800/60 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#191f2e]'
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
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                      item.id === 'consultor-ia'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-blue-900/50 text-blue-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 pb-1">
            <div className="h-px bg-[#232a3d] mx-2" />
          </div>

          {/* Secondary links */}
          <div className="space-y-0.5 text-xs text-slate-400">
            <button
              onClick={() => {
                alert('Novidades BarberPilot v2.4: Novo motor de Consultor IA, agendamento ultrarrápido e ranking de fidelidade integrados!');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:text-slate-200 hover:bg-[#191f2e] transition-colors"
            >
              <Sparkle className="w-3.5 h-3.5 text-amber-400" />
              <span>Novidades</span>
            </button>

            <button
              onClick={() => {
                alert('Base de conhecimento: Guia passo a passo para configurar horários, serviços, mensagens de WhatsApp e comissões da barbearia.');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:text-slate-200 hover:bg-[#191f2e] transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>Base de conhecimento</span>
            </button>

            <button
              onClick={openSupport}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:text-slate-200 hover:bg-[#191f2e] transition-colors"
            >
              <Headphones className="w-3.5 h-3.5 text-blue-400" />
              <span>Falar com o Suporte</span>
            </button>

            <button
              onClick={openTour}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:text-slate-200 hover:bg-[#191f2e] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Refazer tour</span>
            </button>

            <button
              onClick={() => {
                if (onOpenClientePortal) onOpenClientePortal();
              }}
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/30 transition-colors border border-emerald-800/40 mt-1"
            >
              <span className="flex items-center gap-2">
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold text-xs">Área do Cliente</span>
              </span>
              <span className="text-[9px] bg-emerald-900/50 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold">
                APP WEB
              </span>
            </button>

            <button
              onClick={() => {
                if (onOpenSuperAdmin) onOpenSuperAdmin();
              }}
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-blue-400 hover:text-blue-300 hover:bg-blue-950/40 transition-colors border border-blue-800/40 mt-1"
            >
              <span className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5" />
                <span className="font-semibold">Painel Super Admin</span>
              </span>
              <span className="text-[9px] bg-blue-900/50 text-blue-300 px-1.5 py-0.5 rounded font-mono font-bold">
                ROOT
              </span>
            </button>
          </div>
        </div>

        {/* User profile footer */}
        <div className="p-3 border-t border-[#232a3d] bg-[#10141f] flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-700 to-blue-950 flex items-center justify-center font-bold text-xs text-white shadow-sm flex-shrink-0 border border-blue-600/40">
            RS
          </div>
          <div className="overflow-hidden leading-tight flex-1">
            <div className="text-xs font-semibold text-slate-200 truncate">
              Ruan santos
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              ruansolange14@gmail.com
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
