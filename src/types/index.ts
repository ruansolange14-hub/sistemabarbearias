export type ViewType =
  | 'dashboard'
  | 'agenda'
  | 'clientes'
  | 'servicos'
  | 'funcionarios'
  | 'meu-desempenho'
  | 'financeiro'
  | 'marketing-ia'
  | 'fidelizacao'
  | 'consultor-ia'
  | 'plano'
  | 'configuracoes';

export interface BarbeariaConfig {
  nome: string;
  plano: 'Starter' | 'Essencial' | 'Pro';
  statusPlano: string;
  diasRestantesTeste: number;
  slug: string;
  telefoneAdmin: string;
  metaMensal: number;
  metaHoje: number;
  metaSemana: number;
  tipoDocumento: 'CNPJ' | 'CPF';
  documento: string;
  razaoSocial: string;
  googleReviewLink: string;
  googleReviewMsg: string;
  whatsappRelatorioSemanal: boolean;
  tokensIA: number;
  linkAgendaPublica: string;
  totalAcessos30Dias: number;
  acessosHoje: number;
  acessosOntem: number;
}

export interface Profissional {
  id: string;
  nome: string;
  avatar: string;
  email: string;
  telefone: string;
  comissaoBase: number;
  ativo: boolean;
  cor: string;
  cargo: string;
  horarioInicio: string;
  horarioFim: string;
}

export interface Servico {
  id: string;
  nome: string;
  duracao: number; // in minutes
  preco: number;
  ativo: boolean;
  categoria: string;
  cor: string;
  quemAtende: string[]; // 'todos' or array of professional ids
  adicionaisSugeridos?: string[];
  descricao?: string;
}

export interface ComboServico {
  id: string;
  nome: string;
  servicosIds: string[];
  precoOriginal: number;
  precoPromocional: number;
  duracao: number;
  ativo: boolean;
}

export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  instagram?: string;
  email?: string;
  aniversario?: string;
  endereco?: string;
  observacoes?: string;
  status: 'ativo' | 'em_risco' | 'inativo' | 'aniversariante';
  totalGasto: number;
  totalAtendimentos: number;
  ultimoAtendimento?: string;
  pontosFidelidade: number;
  criadoEm: string;
}

export interface Agendamento {
  id: string;
  clienteId?: string;
  clienteNome: string;
  clienteTelefone: string;
  profissionalId: string;
  profissionalNome: string;
  servicoId: string;
  servicoNome: string;
  data: string; // YYYY-MM-DD
  horario: string; // HH:mm
  duracao: number;
  valor: number;
  status: 'agendado' | 'atendido' | 'cancelado' | 'falta' | 'bloqueado';
  observacoes?: string;
  isTest?: boolean;
}

export interface LancamentoFinanceiro {
  id: string;
  tipo: 'receita' | 'despesa';
  categoria: string;
  valor: number;
  data: string;
  descricao: string;
  profissionalId?: string;
  agendamentoId?: string;
}

export interface AutomacaoMarketing {
  id: string;
  nome: string;
  descricao: string;
  gatilho: 'lembrete_24h' | 'pos_atendimento' | 'cliente_sumido' | 'aniversario_7d';
  ativa: boolean;
  canal: 'whatsapp';
  copia: string;
}

export interface CampanhaMarketing {
  id: string;
  titulo: string;
  objetivo: string;
  mensagem: string;
  criadaEm: string;
  destinatarios: number;
  status: 'rascunho' | 'enviada';
}

export interface CupomFidelidade {
  id: string;
  codigo: string;
  descricao: string;
  pontosNecessarios: number;
  descontoValor: number;
  tipoDesconto: 'fixo' | 'porcentagem';
  ativo: boolean;
  usos: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  texto: string;
  timestamp: string;
  tokensCost?: number;
}
