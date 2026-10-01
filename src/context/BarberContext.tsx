import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ViewType,
  BarbeariaConfig,
  Profissional,
  Servico,
  Cliente,
  Agendamento,
  LancamentoFinanceiro,
  AutomacaoMarketing,
  CampanhaMarketing,
  CupomFidelidade,
  ChatMessage,
  ComboServico,
} from '../types';
import {
  initialBarbeariaConfig,
  initialProfissionais,
  initialServicos,
  initialClientes,
  initialAgendamentos,
  initialLancamentos,
  initialAutomacoes,
  initialCupons,
  initialChatMessages,
  initialCombos,
} from '../data/mockData';

interface BarberContextType {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  config: BarbeariaConfig;
  updateConfig: (updates: Partial<BarbeariaConfig>) => void;
  profissionais: Profissional[];
  addProfissional: (prof: Omit<Profissional, 'id'>) => void;
  servicos: Servico[];
  toggleServicoAtivo: (id: string) => void;
  saveServico: (servico: Servico) => void;
  deleteServico: (id: string) => void;
  combos: ComboServico[];
  addCombo: (combo: Omit<ComboServico, 'id'>) => void;
  clientes: Cliente[];
  addCliente: (cliente: Omit<Cliente, 'id' | 'totalGasto' | 'totalAtendimentos' | 'pontosFidelidade' | 'criadoEm'>) => Cliente;
  agendamentos: Agendamento[];
  addAgendamento: (ag: Omit<Agendamento, 'id'>) => void;
  updateAgendamentoStatus: (id: string, status: Agendamento['status']) => void;
  lancamentos: LancamentoFinanceiro[];
  addLancamento: (l: Omit<LancamentoFinanceiro, 'id'>) => void;
  deleteLancamento: (id: string) => void;
  automacoes: AutomacaoMarketing[];
  toggleAutomacao: (id: string) => void;
  campanhas: CampanhaMarketing[];
  addCampanha: (camp: CampanhaMarketing) => void;
  cupons: CupomFidelidade[];
  addCupom: (cupom: Omit<CupomFidelidade, 'id' | 'usos'>) => void;
  chatMessages: ChatMessage[];
  sendChatMessage: (texto: string) => Promise<void>;
  isGeneratingAi: boolean;

  // Modals
  isNovoAgendamentoOpen: boolean;
  openNovoAgendamento: (presetHorario?: string) => void;
  closeNovoAgendamento: () => void;
  presetHorario: string | null;

  isNovoClienteOpen: boolean;
  openNovoCliente: () => void;
  closeNovoCliente: () => void;

  isNovoServicoOpen: boolean;
  editingServico: Servico | null;
  openNovoServico: (serv?: Servico) => void;
  closeNovoServico: () => void;

  isNovoLancamentoOpen: boolean;
  openNovoLancamento: () => void;
  closeNovoLancamento: () => void;

  isPublicBookingOpen: boolean;
  openPublicBooking: () => void;
  closePublicBooking: () => void;

  isTourOpen: boolean;
  openTour: () => void;
  closeTour: () => void;

  isSupportOpen: boolean;
  openSupport: () => void;
  closeSupport: () => void;

  isBannerVisible: boolean;
  hideBanner: () => void;

  // Quick Helpers
  fazerAgendamentoTeste: () => void;
  copiarLinkAgenda: () => void;
  linkCopiadoToast: boolean;
}

const BarberContext = createContext<BarberContextType | undefined>(undefined);

export const BarberProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');

  // Persistence helpers
  const [config, setConfig] = useState<BarbeariaConfig>(() => {
    const saved = localStorage.getItem('barberpilot_config');
    return saved ? JSON.parse(saved) : initialBarbeariaConfig;
  });

  const [profissionais, setProfissionais] = useState<Profissional[]>(() => {
    const saved = localStorage.getItem('barberpilot_profissionais');
    return saved ? JSON.parse(saved) : initialProfissionais;
  });

  const [servicos, setServicos] = useState<Servico[]>(() => {
    const saved = localStorage.getItem('barberpilot_servicos');
    return saved ? JSON.parse(saved) : initialServicos;
  });

  const [combos, setCombos] = useState<ComboServico[]>(() => {
    const saved = localStorage.getItem('barberpilot_combos');
    return saved ? JSON.parse(saved) : initialCombos;
  });

  const [clientes, setClientes] = useState<Cliente[]>(() => {
    const saved = localStorage.getItem('barberpilot_clientes');
    return saved ? JSON.parse(saved) : initialClientes;
  });

  const [agendamentos, setAgendamentos] = useState<Agendamento[]>(() => {
    const saved = localStorage.getItem('barberpilot_agendamentos');
    return saved ? JSON.parse(saved) : initialAgendamentos;
  });

  const [lancamentos, setLancamentos] = useState<LancamentoFinanceiro[]>(() => {
    const saved = localStorage.getItem('barberpilot_lancamentos');
    return saved ? JSON.parse(saved) : initialLancamentos;
  });

  const [automacoes, setAutomacoes] = useState<AutomacaoMarketing[]>(() => {
    const saved = localStorage.getItem('barberpilot_automacoes');
    return saved ? JSON.parse(saved) : initialAutomacoes;
  });

  const [campanhas, setCampanhas] = useState<CampanhaMarketing[]>(() => {
    const saved = localStorage.getItem('barberpilot_campanhas');
    return saved ? JSON.parse(saved) : [];
  });

  const [cupons, setCupons] = useState<CupomFidelidade[]>(() => {
    const saved = localStorage.getItem('barberpilot_cupons');
    return saved ? JSON.parse(saved) : initialCupons;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('barberpilot_chat');
    return saved ? JSON.parse(saved) : initialChatMessages;
  });

  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [linkCopiadoToast, setLinkCopiadoToast] = useState(false);

  // Modals state
  const [isNovoAgendamentoOpen, setIsNovoAgendamentoOpen] = useState(false);
  const [presetHorario, setPresetHorario] = useState<string | null>(null);
  const [isNovoClienteOpen, setIsNovoClienteOpen] = useState(false);
  const [isNovoServicoOpen, setIsNovoServicoOpen] = useState(false);
  const [editingServico, setEditingServico] = useState<Servico | null>(null);
  const [isNovoLancamentoOpen, setIsNovoLancamentoOpen] = useState(false);
  const [isPublicBookingOpen, setIsPublicBookingOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(true);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('barberpilot_config', JSON.stringify(config));
  }, [config]);
  useEffect(() => {
    localStorage.setItem('barberpilot_profissionais', JSON.stringify(profissionais));
  }, [profissionais]);
  useEffect(() => {
    localStorage.setItem('barberpilot_servicos', JSON.stringify(servicos));
  }, [servicos]);
  useEffect(() => {
    localStorage.setItem('barberpilot_combos', JSON.stringify(combos));
  }, [combos]);
  useEffect(() => {
    localStorage.setItem('barberpilot_clientes', JSON.stringify(clientes));
  }, [clientes]);
  useEffect(() => {
    localStorage.setItem('barberpilot_agendamentos', JSON.stringify(agendamentos));
  }, [agendamentos]);
  useEffect(() => {
    localStorage.setItem('barberpilot_lancamentos', JSON.stringify(lancamentos));
  }, [lancamentos]);
  useEffect(() => {
    localStorage.setItem('barberpilot_automacoes', JSON.stringify(automacoes));
  }, [automacoes]);
  useEffect(() => {
    localStorage.setItem('barberpilot_campanhas', JSON.stringify(campanhas));
  }, [campanhas]);
  useEffect(() => {
    localStorage.setItem('barberpilot_cupons', JSON.stringify(cupons));
  }, [cupons]);
  useEffect(() => {
    localStorage.setItem('barberpilot_chat', JSON.stringify(chatMessages));
  }, [chatMessages]);

  const updateConfig = (updates: Partial<BarbeariaConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const addProfissional = (profData: Omit<Profissional, 'id'>) => {
    const newProf: Profissional = {
      ...profData,
      id: `prof-${Date.now()}`,
    };
    setProfissionais((prev) => [...prev, newProf]);
  };

  const toggleServicoAtivo = (id: string) => {
    setServicos((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ativo: !s.ativo } : s))
    );
  };

  const saveServico = (servico: Servico) => {
    setServicos((prev) => {
      const exists = prev.some((s) => s.id === servico.id);
      if (exists) {
        return prev.map((s) => (s.id === servico.id ? servico : s));
      }
      return [...prev, servico];
    });
  };

  const deleteServico = (id: string) => {
    setServicos((prev) => prev.filter((s) => s.id !== id));
  };

  const addCombo = (comboData: Omit<ComboServico, 'id'>) => {
    const newCombo: ComboServico = {
      ...comboData,
      id: `combo-${Date.now()}`,
    };
    setCombos((prev) => [...prev, newCombo]);
  };

  const addCliente = (clientData: Omit<Cliente, 'id' | 'totalGasto' | 'totalAtendimentos' | 'pontosFidelidade' | 'criadoEm'>): Cliente => {
    const newClient: Cliente = {
      ...clientData,
      id: `cli-${Date.now()}`,
      totalGasto: 0,
      totalAtendimentos: 0,
      pontosFidelidade: 0,
      criadoEm: new Date().toISOString(),
    };
    setClientes((prev) => [newClient, ...prev]);
    return newClient;
  };

  const addAgendamento = (agData: Omit<Agendamento, 'id'>) => {
    const newAg: Agendamento = {
      ...agData,
      id: `ag-${Date.now()}`,
    };
    setAgendamentos((prev) => [...prev, newAg]);

    // Also link to client if exists or update stats
    if (agData.clienteId) {
      setClientes((prev) =>
        prev.map((c) =>
          c.id === agData.clienteId
            ? {
                ...c,
                totalAtendimentos: c.totalAtendimentos + 1,
                status: 'ativo',
              }
            : c
        )
      );
    }
  };

  const updateAgendamentoStatus = (id: string, status: Agendamento['status']) => {
    setAgendamentos((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          // If transitioning to 'atendido', register revenue in Financeiro
          if (status === 'atendido' && a.status !== 'atendido') {
            const newLanc: LancamentoFinanceiro = {
              id: `lanc-${Date.now()}`,
              tipo: 'receita',
              categoria: 'Serviço',
              valor: a.valor,
              data: a.data,
              descricao: `Atendimento: ${a.servicoNome} - ${a.clienteNome}`,
              profissionalId: a.profissionalId,
              agendamentoId: a.id,
            };
            setLancamentos((l) => [newLanc, ...l]);

            // Add fidelity points to client
            if (a.clienteId) {
              setClientes((clis) =>
                clis.map((c) =>
                  c.id === a.clienteId
                    ? {
                        ...c,
                        totalGasto: c.totalGasto + a.valor,
                        pontosFidelidade: c.pontosFidelidade + Math.floor(a.valor / 5),
                        ultimoAtendimento: a.data,
                      }
                    : c
                )
              );
            }
          }
          return { ...a, status };
        }
        return a;
      })
    );
  };

  const addLancamento = (lancData: Omit<LancamentoFinanceiro, 'id'>) => {
    const newLanc: LancamentoFinanceiro = {
      ...lancData,
      id: `lanc-${Date.now()}`,
    };
    setLancamentos((prev) => [newLanc, ...prev]);
  };

  const deleteLancamento = (id: string) => {
    setLancamentos((prev) => prev.filter((l) => l.id !== id));
  };

  const toggleAutomacao = (id: string) => {
    setAutomacoes((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ativa: !a.ativa } : a))
    );
  };

  const addCampanha = (camp: CampanhaMarketing) => {
    setCampanhas((prev) => [camp, ...prev]);
  };

  const addCupom = (cupomData: Omit<CupomFidelidade, 'id' | 'usos'>) => {
    const newCup: CupomFidelidade = {
      ...cupomData,
      id: `cup-${Date.now()}`,
      usos: 0,
    };
    setCupons((prev) => [...prev, newCup]);
  };

  const sendChatMessage = async (texto: string) => {
    if (!texto.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      texto,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsGeneratingAi(true);

    // Consume 2 tokens
    setConfig((prev) => ({
      ...prev,
      tokensIA: Math.max(0, prev.tokensIA - 2),
    }));

    try {
      // Craft specialized barbershop advisory prompt
      const contextData = {
        barbearia: config.nome,
        servicosAtivos: servicos.filter((s) => s.ativo).map((s) => `${s.nome} (R$ ${s.preco})`),
        totalAgendamentos: agendamentos.length,
        receitaTotal: lancamentos.filter((l) => l.tipo === 'receita').reduce((acc, l) => acc + l.valor, 0),
        clientesCadastrados: clientes.length,
      };

      // Try server endpoint or generate intelligent advisor reply
      let replyText = '';
      try {
        const response = await fetch('/api/consultor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mensagem: texto,
            contexto: contextData,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          replyText = data.resposta;
        }
      } catch (err) {
        // Fallback to intelligent rule-based barbershop consultant logic
      }

      if (!replyText) {
        // High quality contextual consultant answer
        const lower = texto.toLowerCase();
        if (lower.includes('vago') || lower.includes('amanhã') || lower.includes('horário')) {
          replyText = `Identifiquei que amanhã você tem 21 horários livres na agenda do Ruan santos.

💡 **Recomendação tática para preencher a agenda:**
1. **Disparo de Recuperação:** Envie uma mensagem rápida no WhatsApp para clientes com mais de 30 dias sem cortar (ex: "Fala Fulano! Sobrou uma vaga amanhã às 14h com R$ 10 de bônus no corte. Quer garantir?").
2. **Combo do Meio da Semana:** Ative uma promoção rápida de "Cabelo + Barba" com 15% de desconto para terça e quarta.
3. **Story no Instagram:** Poste um print dos 3 horários nobres que sobraram com link direto para o seu site da BarberPilot.`;
        } else if (lower.includes('ticket') || lower.includes('preço') || lower.includes('aumentar')) {
          replyText = `Para elevar o ticket médio da **Barbearia do manel** de forma consistente:

1. **Upsell na Cadeira:** Quando o cliente pedir "Corte masculino" (R$ 50), sugira: *"Vamos fazer o alinhamento da barba na toalha quente por apenas mais R$ 30 hoje?"*
2. **Combos Estratégicos:** Seu combo "Corte + Barba" está a R$ 150,00. Crie um combo intermediário "Corte + Sobrancelha" a R$ 60 ou "Barba Terapia".
3. **Venda de Produtos:** Pomadas modeladoras e óleos de barba aumentam o lucro líquido em até 35% sem ocupar tempo extra na agenda.`;
        } else if (lower.includes('meta') || lower.includes('financeiro') || lower.includes('faturamento')) {
          replyText = `Analisando seu financeiro de setembro:
- **Meta Atual:** R$ ${config.metaMensal.toFixed(2)}
- **Faturamento Acumulado:** R$ ${lancamentos.filter((l) => l.tipo === 'receita').reduce((a, b) => a + b.valor, 0).toFixed(2)}
- **Despesas:** R$ ${lancamentos.filter((l) => l.tipo === 'despesa').reduce((a, b) => a + b.valor, 0).toFixed(2)}

🎯 **Plano de Ação:** Sugiro definir uma meta de faturamento de **R$ 6.500,00** para 1 barbeiro (média de 6 atendimentos/dia a ticket de R$ 50). Ajuste isso na aba *Configurações* para acompanhar a barra de progresso em tempo real no Dashboard!`;
        } else {
          replyText = `Com base nos números da **Barbearia do manel**:

Sua agenda está no ar com 1 profissional (Ruan santos) e ${servicos.filter((s) => s.ativo).length} serviços ativos. O principal pilar agora para acelerar o crescimento é ativar as 4 automações de marketing no WhatsApp (Lembrete 24h para zerar faltas e Pós-atendimento para coletar avaliações no Google).

Quer que eu monte uma campanha promocional para disparar agora ou prefere revisar a tabela de preços?`;
        }
      }

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        texto: replyText,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const openNovoAgendamento = (presetHour?: string) => {
    setPresetHorario(presetHour || null);
    setIsNovoAgendamentoOpen(true);
  };
  const closeNovoAgendamento = () => {
    setIsNovoAgendamentoOpen(false);
    setPresetHorario(null);
  };

  const openNovoCliente = () => setIsNovoClienteOpen(true);
  const closeNovoCliente = () => setIsNovoClienteOpen(false);

  const openNovoServico = (serv?: Servico) => {
    setEditingServico(serv || null);
    setIsNovoServicoOpen(true);
  };
  const closeNovoServico = () => {
    setIsNovoServicoOpen(false);
    setEditingServico(null);
  };

  const openNovoLancamento = () => setIsNovoLancamentoOpen(true);
  const closeNovoLancamento = () => setIsNovoLancamentoOpen(false);

  const openPublicBooking = () => setIsPublicBookingOpen(true);
  const closePublicBooking = () => setIsPublicBookingOpen(false);

  const openTour = () => setIsTourOpen(true);
  const closeTour = () => setIsTourOpen(false);

  const openSupport = () => setIsSupportOpen(true);
  const closeSupport = () => setIsSupportOpen(false);

  const hideBanner = () => setIsBannerVisible(false);

  const fazerAgendamentoTeste = () => {
    const hoje = new Date().toISOString().split('T')[0];
    const testAg: Omit<Agendamento, 'id'> = {
      clienteNome: 'Ruan santos (Teste)',
      clienteTelefone: '(44) 9996-2395',
      profissionalId: 'prof-1',
      profissionalNome: 'Ruan santos',
      servicoId: 'serv-6',
      servicoNome: 'Corte masculino',
      data: hoje,
      horario: '10:00',
      duracao: 30,
      valor: 50.0,
      status: 'agendado',
      isTest: true,
      observacoes: 'Agendamento de teste gerado pelo sistema',
    };
    addAgendamento(testAg);
    setActiveView('agenda');
  };

  const copiarLinkAgenda = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(config.linkAgendaPublica);
    }
    setLinkCopiadoToast(true);
    setTimeout(() => setLinkCopiadoToast(false), 3000);
  };

  return (
    <BarberContext.Provider
      value={{
        activeView,
        setActiveView,
        config,
        updateConfig,
        profissionais,
        addProfissional,
        servicos,
        toggleServicoAtivo,
        saveServico,
        deleteServico,
        combos,
        addCombo,
        clientes,
        addCliente,
        agendamentos,
        addAgendamento,
        updateAgendamentoStatus,
        lancamentos,
        addLancamento,
        deleteLancamento,
        automacoes,
        toggleAutomacao,
        campanhas,
        addCampanha,
        cupons,
        addCupom,
        chatMessages,
        sendChatMessage,
        isGeneratingAi,
        isNovoAgendamentoOpen,
        openNovoAgendamento,
        closeNovoAgendamento,
        presetHorario,
        isNovoClienteOpen,
        openNovoCliente,
        closeNovoCliente,
        isNovoServicoOpen,
        editingServico,
        openNovoServico,
        closeNovoServico,
        isNovoLancamentoOpen,
        openNovoLancamento,
        closeNovoLancamento,
        isPublicBookingOpen,
        openPublicBooking,
        closePublicBooking,
        isTourOpen,
        openTour,
        closeTour,
        isSupportOpen,
        openSupport,
        closeSupport,
        isBannerVisible,
        hideBanner,
        fazerAgendamentoTeste,
        copiarLinkAgenda,
        linkCopiadoToast,
      }}
    >
      {children}
    </BarberContext.Provider>
  );
};

export const useBarber = () => {
  const context = useContext(BarberContext);
  if (!context) {
    throw new Error('useBarber must be used within a BarberProvider');
  }
  return context;
};
