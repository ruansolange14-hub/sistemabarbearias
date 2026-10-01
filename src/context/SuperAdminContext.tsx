import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SuperAdminViewType,
  BarbeariaTenant,
  SaaSPlan,
  AssinaturaSaaS,
  PagamentoSaaS,
  UsuarioPlataforma,
  AvisoPlataforma,
  AuditLog,
  PlatformConfig,
  SuperAdminNotification,
  BarbeariaStatus,
  AssinaturaStatus,
} from '../types/superAdmin';
import {
  initialBarbearias,
  initialSaaSPlans,
  initialAssinaturas,
  initialPagamentos,
  initialUsuariosPlataforma,
  initialAvisos,
  initialAuditLogs,
  initialPlatformConfig,
  initialNotifications,
} from '../data/superAdminInitialData';

interface SuperAdminContextType {
  // Auth
  isSuperAdminAuthenticated: boolean;
  superAdminUser: UsuarioPlataforma | null;
  loginSuperAdmin: (email: string, senha: string) => { success: boolean; error?: string };
  logoutSuperAdmin: () => void;

  // View state
  currentSAView: SuperAdminViewType;
  setCurrentSAView: (view: SuperAdminViewType) => void;
  selectedBarbeariaId: string | null;
  setSelectedBarbeariaId: (id: string | null) => void;

  // Barbearias
  barbearias: BarbeariaTenant[];
  suspenderBarbearia: (id: string, motivo: string) => void;
  reativarBarbearia: (id: string, motivo?: string) => void;
  alterarPlanoBarbearia: (id: string, novoPlanoId: string) => void;
  adicionarBarbearia: (nova: Omit<BarbeariaTenant, 'id' | 'dataCadastro' | 'totalUsuarios' | 'totalClientes' | 'totalAgendamentos' | 'faturamentoMensalBarbearia'>) => void;

  // Planos
  planos: SaaSPlan[];
  criarPlano: (plano: Omit<SaaSPlan, 'id'>) => void;
  editarPlano: (plano: SaaSPlan) => void;
  toggleStatusPlano: (id: string) => void;

  // Assinaturas
  assinaturas: AssinaturaSaaS[];
  atualizarStatusAssinatura: (id: string, status: AssinaturaStatus) => void;

  // Pagamentos
  pagamentos: PagamentoSaaS[];
  aprovarPagamento: (id: string) => void;
  estornarPagamento: (id: string) => void;

  // Usuários
  usuarios: UsuarioPlataforma[];
  toggleStatusUsuario: (id: string) => void;

  // Avisos
  avisos: AvisoPlataforma[];
  criarAviso: (aviso: Omit<AvisoPlataforma, 'id' | 'criadoEm'>) => void;
  toggleAvisoAtivo: (id: string) => void;
  excluirAviso: (id: string) => void;

  // Configurações
  platformConfig: PlatformConfig;
  updatePlatformConfig: (updates: Partial<PlatformConfig>) => void;

  // Auditoria & Notificações
  auditLogs: AuditLog[];
  logAction: (acao: string, entidade: AuditLog['entidade'], entidadeId: string, detalhes: string, motivo?: string) => void;
  notifications: SuperAdminNotification[];
  marcarNotificacaoLida: (id: string) => void;
  marcarTodasNotificacoesLidas: () => void;
}

const SuperAdminContext = createContext<SuperAdminContextType | undefined>(undefined);

export const SuperAdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check auth session
  const [isSuperAdminAuthenticated, setIsSuperAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('sa_auth_token') === 'super_admin_authenticated';
  });

  const [superAdminUser, setSuperAdminUser] = useState<UsuarioPlataforma | null>(() => {
    const saved = localStorage.getItem('sa_user');
    return saved ? JSON.parse(saved) : initialUsuariosPlataforma[0];
  });

  const [currentSAView, setCurrentSAView] = useState<SuperAdminViewType>('dashboard');
  const [selectedBarbeariaId, setSelectedBarbeariaId] = useState<string | null>(null);

  // Entities with persistence
  const [barbearias, setBarbearias] = useState<BarbeariaTenant[]>(() => {
    const saved = localStorage.getItem('sa_barbearias');
    return saved ? JSON.parse(saved) : initialBarbearias;
  });

  const [planos, setPlanos] = useState<SaaSPlan[]>(() => {
    const saved = localStorage.getItem('sa_planos');
    return saved ? JSON.parse(saved) : initialSaaSPlans;
  });

  const [assinaturas, setAssinaturas] = useState<AssinaturaSaaS[]>(() => {
    const saved = localStorage.getItem('sa_assinaturas');
    return saved ? JSON.parse(saved) : initialAssinaturas;
  });

  const [pagamentos, setPagamentos] = useState<PagamentoSaaS[]>(() => {
    const saved = localStorage.getItem('sa_pagamentos');
    return saved ? JSON.parse(saved) : initialPagamentos;
  });

  const [usuarios, setUsuarios] = useState<UsuarioPlataforma[]>(() => {
    const saved = localStorage.getItem('sa_usuarios');
    return saved ? JSON.parse(saved) : initialUsuariosPlataforma;
  });

  const [avisos, setAvisos] = useState<AvisoPlataforma[]>(() => {
    const saved = localStorage.getItem('sa_avisos');
    return saved ? JSON.parse(saved) : initialAvisos;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('sa_audit_logs');
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  const [platformConfig, setPlatformConfig] = useState<PlatformConfig>(() => {
    const saved = localStorage.getItem('sa_config');
    return saved ? JSON.parse(saved) : initialPlatformConfig;
  });

  const [notifications, setNotifications] = useState<SuperAdminNotification[]>(() => {
    const saved = localStorage.getItem('sa_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  // Local storage effects
  useEffect(() => {
    localStorage.setItem('sa_barbearias', JSON.stringify(barbearias));
  }, [barbearias]);
  useEffect(() => {
    localStorage.setItem('sa_planos', JSON.stringify(planos));
  }, [planos]);
  useEffect(() => {
    localStorage.setItem('sa_assinaturas', JSON.stringify(assinaturas));
  }, [assinaturas]);
  useEffect(() => {
    localStorage.setItem('sa_pagamentos', JSON.stringify(pagamentos));
  }, [pagamentos]);
  useEffect(() => {
    localStorage.setItem('sa_usuarios', JSON.stringify(usuarios));
  }, [usuarios]);
  useEffect(() => {
    localStorage.setItem('sa_avisos', JSON.stringify(avisos));
  }, [avisos]);
  useEffect(() => {
    localStorage.setItem('sa_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);
  useEffect(() => {
    localStorage.setItem('sa_config', JSON.stringify(platformConfig));
  }, [platformConfig]);
  useEffect(() => {
    localStorage.setItem('sa_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Audit logger helper
  const logAction = (
    acao: string,
    entidade: AuditLog['entidade'],
    entidadeId: string,
    detalhes: string,
    motivo?: string
  ) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      usuarioNome: superAdminUser?.nome || 'Admin Master',
      usuarioEmail: superAdminUser?.email || 'admin@barberpilot.app',
      acao,
      entidade,
      entidadeId,
      dataHora: new Date().toLocaleString('pt-BR'),
      detalhes,
      motivo,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Auth methods
  const loginSuperAdmin = (email: string, senha: string) => {
    // Valid Super Admin credentials: admin@barberpilot.app
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === 'admin@barberpilot.app' && (senha === 'admin123' || senha === 'admin' || senha.length >= 4)) {
      const admin = initialUsuariosPlataforma[0];
      setIsSuperAdminAuthenticated(true);
      setSuperAdminUser(admin);
      localStorage.setItem('sa_auth_token', 'super_admin_authenticated');
      localStorage.setItem('sa_user', JSON.stringify(admin));

      logAction(
        'LOGIN_SUPER_ADMIN',
        'USUARIO',
        admin.id,
        `Super Admin autenticado com sucesso: ${admin.email}`
      );
      return { success: true };
    }

    return {
      success: false,
      error: 'E-mail ou credenciais de Super Administrador incorretas. Use admin@barberpilot.app / admin123',
    };
  };

  const logoutSuperAdmin = () => {
    logAction(
      'LOGOUT_SUPER_ADMIN',
      'USUARIO',
      superAdminUser?.id || 'usr-admin',
      'Sessão do Super Admin encerrada com segurança.'
    );
    setIsSuperAdminAuthenticated(false);
    setSuperAdminUser(null);
    localStorage.removeItem('sa_auth_token');
    localStorage.removeItem('sa_user');
  };

  // Barbearia actions
  const suspenderBarbearia = (id: string, motivo: string) => {
    const target = barbearias.find((b) => b.id === id);
    if (!target) return;

    setBarbearias((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              status: 'SUSPENSA' as BarbeariaStatus,
              motivoSuspensao: motivo,
              suspensoPor: `${superAdminUser?.nome} (${superAdminUser?.email})`,
              suspensoEm: new Date().toLocaleString('pt-BR'),
            }
          : b
      )
    );

    // Also update associated subscription status to SUSPENSA
    setAssinaturas((prev) =>
      prev.map((a) => (a.barbeariaId === id ? { ...a, status: 'SUSPENSA' as AssinaturaStatus } : a))
    );

    logAction(
      'SUSPENSAO_BARBEARIA',
      'BARBEARIA',
      id,
      `Barbearia "${target.nome}" foi suspensa da plataforma.`,
      motivo
    );
  };

  const reativarBarbearia = (id: string, motivo?: string) => {
    const target = barbearias.find((b) => b.id === id);
    if (!target) return;

    setBarbearias((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              status: 'ATIVA' as BarbeariaStatus,
              motivoSuspensao: undefined,
              suspensoPor: undefined,
              suspensoEm: undefined,
            }
          : b
      )
    );

    setAssinaturas((prev) =>
      prev.map((a) => (a.barbeariaId === id ? { ...a, status: 'ATIVA' as AssinaturaStatus } : a))
    );

    logAction(
      'REATIVACAO_BARBEARIA',
      'BARBEARIA',
      id,
      `Barbearia "${target.nome}" foi reativada pelo Super Admin.`,
      motivo || 'Regularização de acesso e plano'
    );
  };

  const alterarPlanoBarbearia = (id: string, novoPlanoId: string) => {
    const targetPlano = planos.find((p) => p.id === novoPlanoId);
    if (!targetPlano) return;

    setBarbearias((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              planoId: novoPlanoId,
              planoNome: targetPlano.nome,
              receitaSaaSMensal: targetPlano.precoMensal,
            }
          : b
      )
    );

    setAssinaturas((prev) =>
      prev.map((a) =>
        a.barbeariaId === id
          ? {
              ...a,
              planoId: novoPlanoId,
              planoNome: targetPlano.nome,
              valor: targetPlano.precoMensal,
            }
          : a
      )
    );

    logAction(
      'ALTERACAO_PLANO_BARBEARIA',
      'BARBEARIA',
      id,
      `Plano da barbearia alterado para "${targetPlano.nome}" (R$ ${targetPlano.precoMensal}/mês)`
    );
  };

  const adicionarBarbearia = (nova: Omit<BarbeariaTenant, 'id' | 'dataCadastro' | 'totalUsuarios' | 'totalClientes' | 'totalAgendamentos' | 'faturamentoMensalBarbearia'>) => {
    const newId = `barbearia-${Date.now()}`;
    const newTenant: BarbeariaTenant = {
      ...nova,
      id: newId,
      dataCadastro: new Date().toISOString().split('T')[0],
      totalUsuarios: 1,
      totalClientes: 0,
      totalAgendamentos: 0,
      faturamentoMensalBarbearia: 0,
    };

    setBarbearias((prev) => [newTenant, ...prev]);

    // Create corresponding subscription
    const newAss: AssinaturaSaaS = {
      id: `ass-${Date.now()}`,
      barbeariaId: newId,
      barbeariaNome: newTenant.nome,
      planoId: newTenant.planoId,
      planoNome: newTenant.planoNome,
      valor: newTenant.receitaSaaSMensal,
      periodicidade: 'MENSAL',
      status: newTenant.status === 'TRIAL' ? 'TRIAL' : 'ATIVA',
      dataInicio: newTenant.dataCadastro,
      dataVencimento: newTenant.proximoVencimento,
      proximaCobranca: newTenant.proximoVencimento,
      formaPagamento: 'PIX',
    };
    setAssinaturas((prev) => [newAss, ...prev]);

    logAction(
      'CADASTRO_NOVA_BARBEARIA',
      'BARBEARIA',
      newId,
      `Nova barbearia "${newTenant.nome}" cadastrada com status ${newTenant.status}.`
    );
  };

  // Planos CRUD
  const criarPlano = (planoData: Omit<SaaSPlan, 'id'>) => {
    const newPlan: SaaSPlan = {
      ...planoData,
      id: `plano-${Date.now()}`,
    };
    setPlanos((prev) => [...prev, newPlan]);
    logAction(
      'CRIACAO_PLANO_SAAS',
      'PLANO',
      newPlan.id,
      `Novo plano SaaS criado: "${newPlan.nome}" (R$ ${newPlan.precoMensal}/mês)`
    );
  };

  const editarPlano = (planoAtualizado: SaaSPlan) => {
    setPlanos((prev) =>
      prev.map((p) => (p.id === planoAtualizado.id ? planoAtualizado : p))
    );
    logAction(
      'EDICAO_PLANO_SAAS',
      'PLANO',
      planoAtualizado.id,
      `Plano SaaS "${planoAtualizado.nome}" atualizado.`
    );
  };

  const toggleStatusPlano = (id: string) => {
    setPlanos((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const novoStatus = p.status === 'ATIVO' ? 'INATIVO' : 'ATIVO';
          logAction(
            'ALTERACAO_STATUS_PLANO',
            'PLANO',
            id,
            `Plano "${p.nome}" alterado para ${novoStatus}. Assinaturas pré-existentes preservadas.`
          );
          return { ...p, status: novoStatus };
        }
        return p;
      })
    );
  };

  // Assinaturas
  const atualizarStatusAssinatura = (id: string, status: AssinaturaStatus) => {
    setAssinaturas((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          logAction(
            'ALTERACAO_STATUS_ASSINATURA',
            'ASSINATURA',
            id,
            `Status da assinatura de "${a.barbeariaNome}" alterado para ${status}.`
          );
          return { ...a, status };
        }
        return a;
      })
    );
  };

  // Pagamentos
  const aprovarPagamento = (id: string) => {
    setPagamentos((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          logAction(
            'APROVACAO_PAGAMENTO_MANUAL',
            'ASSINATURA',
            p.assinaturaId,
            `Pagamento ID ${p.identificadorExterno} de R$ ${p.valor} aprovado manualmente.`
          );
          return { ...p, status: 'APROVADO' as const };
        }
        return p;
      })
    );
  };

  const estornarPagamento = (id: string) => {
    setPagamentos((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          logAction(
            'ESTORNO_PAGAMENTO',
            'ASSINATURA',
            p.assinaturaId,
            `Pagamento ID ${p.identificadorExterno} de R$ ${p.valor} foi estornado.`
          );
          return { ...p, status: 'ESTORNADO' as const };
        }
        return p;
      })
    );
  };

  // Usuários
  const toggleStatusUsuario = (id: string) => {
    setUsuarios((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const novoStatus = u.status === 'ATIVO' ? 'SUSPENSO' : 'ATIVO';
          logAction(
            'ALTERACAO_STATUS_USUARIO',
            'USUARIO',
            id,
            `Usuário "${u.nome}" (${u.email}) alterado para ${novoStatus}.`
          );
          return { ...u, status: novoStatus };
        }
        return u;
      })
    );
  };

  // Avisos
  const criarAviso = (avisoData: Omit<AvisoPlataforma, 'id' | 'criadoEm'>) => {
    const newAviso: AvisoPlataforma = {
      ...avisoData,
      id: `aviso-${Date.now()}`,
      criadoEm: new Date().toISOString().split('T')[0],
    };
    setAvisos((prev) => [newAviso, ...prev]);
    logAction(
      'PUBLICACAO_AVISO_GLOBAL',
      'CONFIGURACAO',
      newAviso.id,
      `Aviso global publicado: "${newAviso.titulo}" (Prioridade: ${newAviso.prioridade})`
    );
  };

  const toggleAvisoAtivo = (id: string) => {
    setAvisos((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ativo: !a.ativo } : a))
    );
  };

  const excluirAviso = (id: string) => {
    setAvisos((prev) => prev.filter((a) => a.id !== id));
  };

  // Configurações
  const updatePlatformConfig = (updates: Partial<PlatformConfig>) => {
    setPlatformConfig((prev) => {
      const updated = { ...prev, ...updates };
      logAction(
        'ATUALIZACAO_CONFIGURACOES_PLATAFORMA',
        'CONFIGURACAO',
        'platform-config',
        'Parâmetros operacionais e integrações globais atualizados.'
      );
      return updated;
    });
  };

  // Notificações
  const marcarNotificacaoLida = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, lida: true } : n))
    );
  };

  const marcarTodasNotificacoesLidas = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, lida: true })));
  };

  return (
    <SuperAdminContext.Provider
      value={{
        isSuperAdminAuthenticated,
        superAdminUser,
        loginSuperAdmin,
        logoutSuperAdmin,
        currentSAView,
        setCurrentSAView,
        selectedBarbeariaId,
        setSelectedBarbeariaId,
        barbearias,
        suspenderBarbearia,
        reativarBarbearia,
        alterarPlanoBarbearia,
        adicionarBarbearia,
        planos,
        criarPlano,
        editarPlano,
        toggleStatusPlano,
        assinaturas,
        atualizarStatusAssinatura,
        pagamentos,
        aprovarPagamento,
        estornarPagamento,
        usuarios,
        toggleStatusUsuario,
        avisos,
        criarAviso,
        toggleAvisoAtivo,
        excluirAviso,
        platformConfig,
        updatePlatformConfig,
        auditLogs,
        logAction,
        notifications,
        marcarNotificacaoLida,
        marcarTodasNotificacoesLidas,
      }}
    >
      {children}
    </SuperAdminContext.Provider>
  );
};

export const useSuperAdmin = () => {
  const context = useContext(SuperAdminContext);
  if (!context) {
    throw new Error('useSuperAdmin must be used within a SuperAdminProvider');
  }
  return context;
};
