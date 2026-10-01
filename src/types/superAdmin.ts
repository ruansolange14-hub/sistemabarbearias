export type SuperAdminViewType =
  | 'dashboard'
  | 'barbearias'
  | 'barbearia-detalhes'
  | 'assinaturas'
  | 'planos'
  | 'usuarios'
  | 'pagamentos'
  | 'inadimplencia'
  | 'metricas'
  | 'avisos'
  | 'configuracoes'
  | 'auditoria';

export type BarbeariaStatus =
  | 'ATIVA'
  | 'TRIAL'
  | 'INADIMPLENTE'
  | 'SUSPENSA'
  | 'CANCELADA';

export type SaaSPlanPeriod = 'MENSAL' | 'ANUAL';

export type AssinaturaStatus =
  | 'ATIVA'
  | 'TRIAL'
  | 'PENDENTE'
  | 'ATRASADA'
  | 'CANCELADA'
  | 'SUSPENSA';

export type PagamentoStatus =
  | 'APROVADO'
  | 'PENDENTE'
  | 'RECUSADO'
  | 'ESTORNADO'
  | 'CANCELADO';

export type PagamentoMetodo = 'PIX' | 'CARTAO' | 'BOLETO';

export type UserRole =
  | 'SUPER_ADMIN'
  | 'PROPRIETARIO'
  | 'GERENTE'
  | 'BARBEIRO'
  | 'CLIENTE';

export interface SaaSPlan {
  id: string;
  nome: string;
  descricao: string;
  precoMensal: number;
  precoAnual: number;
  limiteBarbeiros: number; // -1 for unlimited
  limiteFuncionarios: number;
  limiteClientes: number; // -1 for unlimited
  limiteArmazenamentoMb: number;
  funcionalidadesHabilitadas: string[];
  status: 'ATIVO' | 'INATIVO';
  destaque: boolean;
  ordem: number;
}

export interface BarbeariaTenant {
  id: string;
  nome: string;
  slug: string;
  logoUrl?: string;
  descricao?: string;
  proprietarioNome: string;
  proprietarioEmail: string;
  proprietarioTelefone: string;
  whatsapp: string;
  instagram?: string;
  endereco: {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  planoId: string;
  planoNome: string;
  status: BarbeariaStatus;
  dataCadastro: string; // YYYY-MM-DD
  proximoVencimento: string; // YYYY-MM-DD
  trialTerminaEm?: string; // YYYY-MM-DD
  totalUsuarios: number;
  totalClientes: number;
  totalAgendamentos: number;
  faturamentoMensalBarbearia: number; // GMV of barbershop
  receitaSaaSMensal: number; // Platform fee / SaaS subscription
  motivoSuspensao?: string;
  suspensoPor?: string;
  suspensoEm?: string;
}

export interface AssinaturaSaaS {
  id: string;
  barbeariaId: string;
  barbeariaNome: string;
  planoId: string;
  planoNome: string;
  valor: number;
  periodicidade: SaaSPlanPeriod;
  status: AssinaturaStatus;
  dataInicio: string;
  dataVencimento: string;
  proximaCobranca: string;
  formaPagamento: PagamentoMetodo;
  historicoCobrancas?: {
    data: string;
    valor: number;
    status: PagamentoStatus;
  }[];
}

export interface PagamentoSaaS {
  id: string;
  barbeariaId: string;
  barbeariaNome: string;
  assinaturaId: string;
  valor: number;
  data: string;
  metodo: PagamentoMetodo;
  status: PagamentoStatus;
  identificadorExterno: string; // Gateway transaction ID
  comprovanteUrl?: string;
}

export interface UsuarioPlataforma {
  id: string;
  nome: string;
  email: string;
  papel: UserRole;
  barbeariaId?: string;
  barbeariaNome?: string;
  status: 'ATIVO' | 'SUSPENSO';
  dataCadastro: string;
  ultimoAcesso: string;
  avatar?: string;
}

export interface AvisoPlataforma {
  id: string;
  titulo: string;
  descricao: string;
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE';
  periodoInicio: string;
  periodoFim: string;
  ativo: boolean;
  publico: 'TODAS' | 'ESPECIFICAS';
  barbeariasAlvo?: string[]; // IDs
  criadoEm: string;
}

export interface AuditLog {
  id: string;
  usuarioNome: string;
  usuarioEmail: string;
  acao: string; // e.g., 'SUSPENSAO_BARBEARIA', 'ALTERACAO_PLANO'
  entidade: 'BARBEARIA' | 'PLANO' | 'ASSINATURA' | 'USUARIO' | 'CONFIGURACAO';
  entidadeId: string;
  dataHora: string;
  detalhes: string;
  motivo?: string;
}

export interface PlatformConfig {
  geral: {
    nomePlataforma: string;
    logoUrl: string;
    faviconUrl: string;
    emailContato: string;
    telefoneSuporte: string;
  };
  negocio: {
    moeda: string; // 'BRL (R$)'
    fusoHorario: string; // 'America/Sao_Paulo'
    regrasGerais: string;
  };
  assinaturas: {
    diasPeriodoTeste: number;
    diasAtrasoParaSuspender: number;
    diasAvisoAntesVencimento: number;
    permitirRenovacaoAutomatica: boolean;
  };
  notificacoes: {
    emailsAtivos: boolean;
    avisosAtivos: boolean;
    lembretesWhatsApp: boolean;
  };
  integracoes: {
    gatewayProvedor: 'MercadoPago' | 'Stripe' | 'Asaas';
    gatewayAmbiente: 'sandbox' | 'production';
    whatsappProvedor: 'EvolutionAPI' | 'Z-API' | 'MetaCloudAPI';
    whatsappAtivo: boolean;
  };
}

export interface SuperAdminNotification {
  id: string;
  tipo: 'NOVA_BARBEARIA' | 'ASSINATURA_PAGA' | 'INADIMPLENCIA' | 'CANCELAMENTO' | 'ALERTA';
  titulo: string;
  mensagem: string;
  dataHora: string;
  lida: boolean;
  link?: string;
}
