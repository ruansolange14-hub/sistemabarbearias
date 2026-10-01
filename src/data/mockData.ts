import {
  BarbeariaConfig,
  Profissional,
  Servico,
  Cliente,
  Agendamento,
  LancamentoFinanceiro,
  AutomacaoMarketing,
  CupomFidelidade,
  ChatMessage,
  ComboServico,
} from '../types';

export const initialBarbeariaConfig: BarbeariaConfig = {
  nome: 'Barbearia do manel',
  plano: 'Essencial',
  statusPlano: 'Período de teste',
  diasRestantesTeste: 3,
  slug: 'barbearia-do-manel',
  telefoneAdmin: '(44) 9996-2395',
  metaMensal: 0,
  metaHoje: 0,
  metaSemana: 0,
  tipoDocumento: 'CNPJ',
  documento: '00.000.000/0000-00',
  razaoSocial: 'Nome cadastrado na Receita Federal',
  googleReviewLink: 'https://g.page/r/...',
  googleReviewMsg:
    'Olá {cliente}! Foi um prazer te atender na {barbearia}. 💈\n\nSe curtiu o atendimento, deixa uma avaliação no Google? Leva menos de 1 minuto e ajuda demais:\n{link}\n\nObrigado!',
  whatsappRelatorioSemanal: true,
  tokensIA: 100,
  linkAgendaPublica: 'https://barberpilot.app/barbearia-do-manel',
  totalAcessos30Dias: 2,
  acessosHoje: 2,
  acessosOntem: 0,
};

export const initialProfissionais: Profissional[] = [
  {
    id: 'prof-1',
    nome: 'Ruan santos',
    avatar: 'RS',
    email: 'ruansolange14@gmail.com',
    telefone: '(44) 9996-2395',
    comissaoBase: 0,
    ativo: true,
    cor: '#38bdf8', // sky-400
    cargo: 'Barbeiro Chefe / Proprietário',
    horarioInicio: '09:00',
    horarioFim: '19:00',
  },
];

export const initialServicos: Servico[] = [
  {
    id: 'serv-1',
    nome: 'Barba',
    duracao: 30,
    preco: 40.0,
    ativo: true,
    categoria: 'Básico',
    cor: '#38bdf8',
    quemAtende: ['todos'],
    adicionaisSugeridos: ['Toalha quente', 'Óleo hidratante'],
    descricao: 'Alinhamento completo, navalha e pós-barba refrescante.',
  },
  {
    id: 'serv-2',
    nome: 'Barba com toalha quente',
    duracao: 45,
    preco: 60.0,
    ativo: false,
    categoria: 'Básico',
    cor: '#0ea5e9',
    quemAtende: ['todos'],
    descricao: 'Ritual tradicional com vaporização, toalha quente aromatizada e massagem.',
  },
  {
    id: 'serv-3',
    nome: 'Corte + Barba',
    duracao: 60,
    preco: 150.0,
    ativo: true,
    categoria: 'Básico',
    cor: '#6366f1',
    quemAtende: ['todos'],
    adicionaisSugeridos: ['Sobrancelha', 'Lavagem especial'],
    descricao: 'Combo premium completo para renovar o visual por inteiro.',
  },
  {
    id: 'serv-4',
    nome: 'Corte + Sobrancelha',
    duracao: 40,
    preco: 60.0,
    ativo: false,
    categoria: 'Básico',
    cor: '#8b5cf6',
    quemAtende: ['todos'],
    descricao: 'Corte masculino moderno acompanhado de design de sobrancelha.',
  },
  {
    id: 'serv-5',
    nome: 'Corte infantil',
    duracao: 30,
    preco: 40.0,
    ativo: false,
    categoria: 'Básico',
    cor: '#ec4899',
    quemAtende: ['todos'],
    descricao: 'Atendimento especial e paciente para crianças até 11 anos.',
  },
  {
    id: 'serv-6',
    nome: 'Corte masculino',
    duracao: 30,
    preco: 50.0,
    ativo: true,
    categoria: 'Básico',
    cor: '#06b6d4',
    quemAtende: ['todos'],
    adicionaisSugeridos: ['Barba', 'Lavagem'],
    descricao: 'Degradê na navalha, tesoura ou máquina com acabamento impecável.',
  },
  {
    id: 'serv-7',
    nome: 'Corte na tesoura',
    duracao: 45,
    preco: 70.0,
    ativo: false,
    categoria: 'Básico',
    cor: '#14b8a6',
    quemAtende: ['todos'],
    descricao: 'Estilização clássica exclusivamente com tesouras artesanais.',
  },
  {
    id: 'serv-8',
    nome: 'Corte social/executivo',
    duracao: 40,
    preco: 70.0,
    ativo: false,
    categoria: 'Básico',
    cor: '#3b82f6',
    quemAtende: ['todos'],
    descricao: 'Corte sóbrio, limpo e elegante para o dia a dia corporativo.',
  },
  {
    id: 'serv-9',
    nome: 'Pigmentação de barba',
    duracao: 45,
    preco: 80.0,
    ativo: false,
    categoria: 'Química',
    cor: '#f59e0b',
    quemAtende: ['todos'],
    descricao: 'Camuflagem de fios brancos e preenchimento de falhas.',
  },
  {
    id: 'serv-10',
    nome: 'Sobrancelha na navalha',
    duracao: 15,
    preco: 25.0,
    ativo: false,
    categoria: 'Básico',
    cor: '#10b981',
    quemAtende: ['todos'],
    descricao: 'Alinhamento rápido e limpo com lâmina e navalhete descartável.',
  },
];

export const initialCombos: ComboServico[] = [
  {
    id: 'combo-1',
    nome: 'Cabelo + Barba VIP',
    servicosIds: ['serv-6', 'serv-1'],
    precoOriginal: 90.0,
    precoPromocional: 80.0,
    duracao: 60,
    ativo: true,
  },
];

export const initialClientes: Cliente[] = [];

export const initialAgendamentos: Agendamento[] = [];

export const initialLancamentos: LancamentoFinanceiro[] = [];

export const initialAutomacoes: AutomacaoMarketing[] = [
  {
    id: 'aut-1',
    nome: 'Lembrete — 24 horas antes',
    descricao: 'Aviso um dia antes do horário para reduzir faltas.',
    gatilho: 'lembrete_24h',
    ativa: false,
    canal: 'whatsapp',
    copia:
      'Fala {cliente}! Lembrando do seu corte amanhã às {horario} na {barbearia}. Se precisar remarcar, avisa por aqui!',
  },
  {
    id: 'aut-2',
    nome: 'Pós-atendimento',
    descricao: 'Agradece e pede uma avaliação depois que o cliente é atendido.',
    gatilho: 'pos_atendimento',
    ativa: false,
    canal: 'whatsapp',
    copia:
      'E aí {cliente}! Obrigado pela preferência hoje. Se puder avaliar nosso trabalho no Google, fortalece muito: {link}',
  },
  {
    id: 'aut-3',
    nome: 'Cliente sumido (>60 dias)',
    descricao: 'Recupera clientes que não retornam há mais de 60 dias.',
    gatilho: 'cliente_sumido',
    ativa: false,
    canal: 'whatsapp',
    copia:
      'Fala {cliente}, sumido! Passando pra lembrar que seu visual merece um talento. Clica aqui e garante seu horário esta semana!',
  },
  {
    id: 'aut-4',
    nome: 'Aniversário — 7 dias antes',
    descricao:
      'Aviso antecipado convidando o cliente a marcar horário para a semana do aniversário.',
    gatilho: 'aniversario_7d',
    ativa: false,
    canal: 'whatsapp',
    copia:
      'Parabéns antecipado {cliente}! 🎂 Que tal agendar seu horário com um agrado exclusivo da {barbearia} para comemorar no estilo?',
  },
];

export const initialCupons: CupomFidelidade[] = [
  {
    id: 'cup-1',
    codigo: 'CORTEVIP10',
    descricao: 'R$ 10 OFF no próximo corte',
    pontosNecessarios: 50,
    descontoValor: 10,
    tipoDesconto: 'fixo',
    ativo: true,
    usos: 0,
  },
  {
    id: 'cup-2',
    codigo: 'BARBAGRATIS',
    descricao: 'Barba gratuita ao resgatar',
    pontosNecessarios: 100,
    descontoValor: 40,
    tipoDesconto: 'fixo',
    ativo: true,
    usos: 0,
  },
];

export const initialChatMessages: ChatMessage[] = [
  {
    id: 'msg-welcome',
    sender: 'assistant',
    texto:
      'Oi! Eu sou o seu Consultor IA. Analiso os números da sua barbearia, identifico horários ociosos, ajudo a precificar serviços e sugiro estratégias para aumentar o faturamento da Barbearia do manel.',
    timestamp: '23:59',
  },
];
