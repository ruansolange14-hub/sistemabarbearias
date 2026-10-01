# RELATÓRIO COMPLETO DE AUDITORIA DO SISTEMA DE GESTÃO DE BARBEARIA (BARBERPILOT)

> **Documento Gerado:** `RELATORIO_COMPLETO_SISTEMA_BARBEARIA.md`  
> **Data da Auditoria:** 01 de outubro de 2026  
> **Finalidade:** Raio-X documental e técnico completo do estado atual do sistema para balizar decisões de manutenção, simplificação, remoção e integração com a Mini Central Digital da Barbearia.  
> **Regra de Execução:** Análise estrita do código-fonte existente sem refatorações, migrações, exclusões ou alterações funcionais.

---

## 1. RESUMO EXECUTIVO

| Item | Descrição / Diagnóstico |
|---|---|
| **O que o sistema é** | Uma plataforma Web SPA (Single Page Application) SaaS multi-área para barbearias, contendo 3 camadas de experiência: (1) Gestão Operacional da Barbearia, (2) Portal do Cliente / Agendamento Público, e (3) Painel do Super Administrador da Plataforma. |
| **Público-alvo / Quem usa** | • **Super Administrador:** Gestor do SaaS responsável por planos, faturamento da plataforma, barbearias cadastradas e bloqueios.<br>• **Proprietário / Gerente / Barbeiro:** Operador diário da barbearia (agenda, comandas, clientes, serviços, financeiro).<br>• **Cliente final:** Usuário que agenda serviços, consulta histórico de cortes, gerencia pontos de fidelidade e resgata cupons. |
| **Principais Áreas** | 1. **Área da Barbearia:** Dashboard, Agenda, Clientes, Serviços, Funcionários, Meu Desempenho, Financeiro, Marketing IA, Fidelização, Consultor IA, Plano e Configurações.<br>2. **Área do Cliente (`/cliente`):** Login/Identificação por telefone, Meus Agendamentos, Novo Agendamento, Clube Fidelidade/Cupons e Dados da Barbearia.<br>3. **Área do Super Admin (`/super-admin`):** Dashboard SaaS, Barbearias, Detalhes/Suspensão, Assinaturas, Planos, Usuários, Pagamentos, Inadimplência, Métricas SaaS, Avisos Globais, Configurações e Auditoria. |
| **Fluxo Principal** | O cliente acessa o link público ou portal, escolhe serviço, barbeiro, data e horário vago, insere nome e telefone, e confirma. O agendamento é inserido na Agenda da Barbearia e no histórico do cliente. Ao concluir o atendimento na agenda, a receita entra no Financeiro e gera pontos de fidelidade. |
| **Integrações Externas Reais** | • **WhatsApp:** Links dinâmicos `wa.me/55...` com codificação URI para envio de mensagens diretas.<br>• **Google Calendar:** Geração de URLs `calendar.google.com/calendar/render` para salvar eventos com 1 clique.<br>• **Google Maps:** Links para rotas e mapas de geolocalização do endereço.<br>• **Google GenAI / LLM:** Dependência `@google/genai` instalada no `package.json`; IA opera com fallback determinístico local e requisição simulada via `fetch('/api/consultor')`. |
| **Persistência / Banco de Dados Atual** | **100% Client-Side via Web Storage (`localStorage`) e React Context API.** Não há banco relacional ativo, não há backend Express montado em runtime e não há conexão com Supabase configurada. |
| **Nível de Complexidade** | **Médio-Alto no Frontend:** Interfaces ricas, cálculos locais avançados de agenda, comissões, métricas SaaS, simulações de IA e isolamento lógico, porém sem complexidade distribuída de backend real no momento. |

---

## 2. ARQUITETURA DO SISTEMA

### 2.1 Stack Tecnológica Mapeada
* **Linguagem:** TypeScript 7.0.2 (compilação e tipagem estrita com `noEmit: true`, `bundler` resolution).
* **Framework Frontend:** React 19.0.1 com ReactDOM 19.0.1.
* **Ferramenta de Build / Bundler:** Vite 8.3.0 com `@vitejs/plugin-react` 6.1.1.
* **Estilização / CSS Engine:** Tailwind CSS v4 (`@tailwindcss/vite` 4.3.3) via importação única `@import "tailwindcss";` no arquivo `src/index.css`. Não existem arquivos `.module.css` ou bibliotecas legadas de CSS-in-JS.
* **Ícones:** `lucide-react` 0.546.0.
* **Animações:** `motion` (Framer Motion v12) 12.23.24 (instalado, suporte ativo).
* **Servidor / Runtime Dev:** Vite dev server padrão na porta `3000` (`vite --port=3000 --host=0.0.0.0`). O pacote `express` e `tsx` constam nas dependências, porém **não existe arquivo `server.ts` ou `server.js` ativo** em execução no momento da auditoria.

### 2.2 Padrão de Arquitetura e Fluxo de Dados
```
               ┌────────────────────────────────────────────────────────┐
               │                        index.html                      │
               │                   (Entrypoint DOM #root)               │
               └───────────────────────────┬────────────────────────────┘
                                           │
                                           ▼
               ┌────────────────────────────────────────────────────────┐
               │                       src/main.tsx                     │
               │           createRoot(document.getElementById('root')!) │
               └───────────────────────────┬────────────────────────────┘
                                           │
                                           ▼
               ┌────────────────────────────────────────────────────────┐
               │                       src/App.tsx                      │
               │    Roteador Central de Estado ('tenant' | 'super-admin'│
               │                            | 'cliente')                │
               └───────┬───────────────────┬────────────────────┬───────┘
                       │                   │                    │
        appMode === 'super-admin'  appMode === 'cliente'  appMode === 'tenant'
                       │                   │                    │
                       ▼                   ▼                    ▼
             ┌─────────────────┐ ┌──────────────────┐ ┌─────────────────┐
             │   SuperAdmin    │ │  ClientePortal   │ │ Barbearia App   │
             │   Context &     │ │  (src/components │ │ (Sidebar,       │
             │   Views         │ │   /cliente)      │ │  Views, Modais) │
             └─────────────────┘ └──────────────────┘ └─────────────────┘
                       ▲                   ▲                    ▲
                       └───────────────────┼────────────────────┘
                                           │
                    ┌──────────────────────┴──────────────────────┐
                    │      Camada de Estado & Persistência        │
                    │   • SuperAdminContext (sa_* keys)           │
                    │   • BarberContext (barberpilot_* keys)      │
                    │   • localStorage do Navegador (WebStorage)  │
                    └─────────────────────────────────────────────┘
```

---

## 3. ESTRUTURA COMPLETA DE DIRETÓRIOS E ARQUIVOS

```
/
├── .env.example
├── .gitignore
├── bun.lock
├── index.html
├── metadata.json
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── App.tsx
    ├── index.css
    ├── main.tsx
    ├── components/
    │   ├── Sidebar.tsx
    │   ├── TopBanner.tsx
    │   ├── cliente/
    │   │   └── ClientePortal.tsx
    │   ├── modals/
    │   │   ├── NovoAgendamentoModal.tsx
    │   │   ├── NovoClienteModal.tsx
    │   │   ├── NovoLancamentoModal.tsx
    │   │   ├── NovoServicoModal.tsx
    │   │   ├── PublicBookingModal.tsx
    │   │   ├── SupportModal.tsx
    │   │   └── TourModal.tsx
    │   ├── superadmin/
    │   │   ├── SuperAdminLayout.tsx
    │   │   └── views/
    │   │       ├── SAAssinaturasView.tsx
    │   │       ├── SAAuditoriaView.tsx
    │   │       ├── SAAvisosView.tsx
    │   │       ├── SABarbeariaDetailView.tsx
    │   │       ├── SABarbeariasView.tsx
    │   │       ├── SAConfiguracoesView.tsx
    │   │       ├── SADashboardView.tsx
    │   │       ├── SAInadimplenciaView.tsx
    │   │       ├── SALoginView.tsx
    │   │       ├── SAMetricasView.tsx
    │   │       ├── SAPagamentosView.tsx
    │   │       ├── SAPlanosView.tsx
    │   │       └── SAUsuariosView.tsx
    │   └── views/
    │       ├── AgendaView.tsx
    │       ├── ClientesView.tsx
    │       ├── ConfiguracoesView.tsx
    │       ├── ConsultorIaView.tsx
    │       ├── DashboardView.tsx
    │       ├── FidelizacaoView.tsx
    │       ├── FinanceiroView.tsx
    │       ├── FuncionariosView.tsx
    │       ├── MarketingIaView.tsx
    │       ├── MeuDesempenhoView.tsx
    │       ├── PlanoView.tsx
    │       └── ServicosView.tsx
    ├── context/
    │   ├── BarberContext.tsx
    │   └── SuperAdminContext.tsx
    ├── data/
    │   ├── mockData.ts
    │   └── superAdminInitialData.ts
    └── types/
        ├── index.ts
        └── superAdmin.ts
```

---

## 4. MAPA GERAL DO PRODUTO E PERFIS DE USUÁRIO

### 4.1 Diagrama de Conexão das Áreas

```
                                  SISTEMA BARBERPILOT
                                          │
        ┌─────────────────────────────────┼────────────────────────────────┐
        │                                 │                                │
        ▼                                 ▼                                ▼
┌──────────────┐                 ┌────────────────┐               ┌────────────────┐
│  SUPER ADM   │                 │   BARBEARIA    │               │    CLIENTE     │
│ (/super-admin│                 │ (App Principal)│               │  (/cliente ou  │
│    Root)     │                 │                │               │ Modal Público) │
└───────┬──────┘                 └────────┬───────┘               └────────┬───────┘
        │                                 │                                │
        │ Suspende / Controla             │ Agenda / Atende                │ Agenda /
        ▼                                 ▼                                │ Pontua
┌──────────────────────────────────────────────────────────────────────────┴───────┐
│                           DADOS DA BARBEARIA TENANT                              │
│ (Barbearia do Manel · ID 'barbearia-1' · Slug 'barbearia-do-manel')              │
│ Agendamentos · Clientes · Serviços · Profissionais · Finanças · Cupons           │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Perfis de Usuário Existentes no Código
Mapeados a partir de `src/types/superAdmin.ts` (linhas 41–47) e `src/types/index.ts`:

1. **`SUPER_ADMIN`:** Administrador global da plataforma SaaS BarberPilot. Possui visão de todas as barbearias, faturamento total, controle de planos e bloqueio de inadimplentes.
2. **`PROPRIETARIO`:** Dono da barbearia (ex: Ruan Santos). Administra serviços, funcionários, faturamento, configurações e relatórios da sua unidade.
3. **`GERENTE`:** Tipado na interface `UserRole`, com intenção de gerenciamento operacional.
4. **`BARBEIRO`:** Profissional que atende clientes, visualiza seus próprios horários e calcula comissões.
5. **`CLIENTE`:** Cliente final que agenda serviços, visualiza histórico, acumula pontos de fidelidade e resgata benefícios.

---

## 5. INVENTÁRIO DO SUPER ADMINISTRADOR (SUPER ADM)

### 5.1 Telas, Abas e Ações do Super Admin

| Nome | Local no Sistema | Como Acessar | O que Faz | Dados Envolvidos | Status | Dependências |
|---|---|---|---|---|---|---|
| **Login Super Admin** | `src/components/superadmin/views/SALoginView.tsx` | URL `/super-admin` ou botão na Sidebar / Header | Autentica o Super Admin via credenciais (`admin@barberpilot.app` / `admin123`) | `email`, `senha`, `sa_auth_token` | Real (validação de credenciais no frontend) | `SuperAdminContext` |
| **Dashboard da Plataforma** | `src/components/superadmin/views/SADashboardView.tsx` | Menu Lateral: "Dashboard" | Exibe 8 KPIs principais do SaaS (MRR, Tenants, Receita, GMV, Assinaturas) | `barbearias`, `assinaturas`, `pagamentos` | Real com dados locais | `useSuperAdmin` |
| **Gestão de Barbearias** | `src/components/superadmin/views/SABarbeariasView.tsx` | Menu Lateral: "Barbearias" | Lista barbearias cadastradas, busca por nome/dono, filtra por status (Ativa, Trial, Inadimplente, Suspensa), modal de novo cadastro e botão de suspender | `BarbeariaTenant[]` | Real com persistência `localStorage` | `useSuperAdmin` |
| **Detalhes da Barbearia** | `src/components/superadmin/views/SABarbeariaDetailView.tsx` | Ação "Ver Detalhes" na lista de Barbearias | Exibe raio-x de uma barbearia selecionada, dados de contato, endereço, plano atual, faturamento, botões de suspensão e alteração de plano | `BarbeariaTenant`, `SaaSPlan[]` | Real | `selectedBarbeariaId` |
| **Gestão de Planos** | `src/components/superadmin/views/SAPlanosView.tsx` | Menu Lateral: "Planos" | Permite criar novos planos SaaS, editar limites de barbeiros/clientes, ativar/inativar planos e definir preços mensais e anuais | `SaaSPlan[]` | Real com persistência `localStorage` | `useSuperAdmin` |
| **Assinaturas SaaS** | `src/components/superadmin/views/SAAssinaturasView.tsx` | Menu Lateral: "Assinaturas" | Tabela com assinaturas de cada barbearia, status de renovação, data de vencimento e periodicidade (Mensal/Anual) | `AssinaturaSaaS[]` | Real com filtros dinâmicos | `useSuperAdmin` |
| **Gestão de Pagamentos** | `src/components/superadmin/views/SAPagamentosView.tsx` | Menu Lateral: "Pagamentos" | Lista de pagamentos recebidos (PIX, Cartão, Boleto), ações de aprovar pagamento pendente e estornar transação | `PagamentoSaaS[]` | Real (atualiza status do registro) | `useSuperAdmin` |
| **Controle de Inadimplência** | `src/components/superadmin/views/SAInadimplenciaView.tsx` | Menu Lateral: "Inadimplência" | Painel de barbearias em atraso, cálculo de dias em atraso, link direto para WhatsApp de cobrança e botão de suspensão imediata | `barbearias`, `assinaturas` | Real com link WhatsApp integrado | `useSuperAdmin` |
| **Métricas da Plataforma** | `src/components/superadmin/views/SAMetricasView.tsx` | Menu Lateral: "Métricas" | Relatórios analíticos de LTV, CAC, Churn Rate, Taxa de Conversão de Trial e ARPU | `barbearias`, `assinaturas`, `pagamentos` | Real com cálculos analíticos | `useSuperAdmin` |
| **Gestão de Usuários** | `src/components/superadmin/views/SAUsuariosView.tsx` | Menu Lateral: "Usuários" | Lista usuários de todas as barbearias, exibe e-mail, cargo (papel), data de cadastro e permite suspender/reativar acesso | `UsuarioPlataforma[]` | Real | `useSuperAdmin` |
| **Avisos Globais** | `src/components/superadmin/views/SAAvisosView.tsx` | Menu Lateral: "Avisos" | Criação de comunicados com prioridade (Baixa, Média, Alta, Urgente) para serem exibidos nas barbearias | `AvisoPlataforma[]` | Real | `useSuperAdmin` |
| **Configurações Globais** | `src/components/superadmin/views/SAConfiguracoesView.tsx` | Menu Lateral: "Configurações" | Configura regras do SaaS (dias de trial, dias de tolerância antes de suspender, gateway ativo e provedor de WhatsApp) | `PlatformConfig` | Real | `useSuperAdmin` |
| **Auditoria e Logs** | `src/components/superadmin/views/SAAuditoriaView.tsx` | Menu Lateral: "Auditoria" | Rastreamento histórico de quem executou ações administrativas (suspensões, reativações, alterações de plano) com data, hora e motivo | `AuditLog[]` | Real | `useSuperAdmin` |

---

## 6. MECANISMO DE BLOQUEIO E SUSPENSÃO PELO SUPER ADM

A investigação do código confirmou a existência de um mecanismo **funcional de suspensão**:

### 6.1 Como o bloqueio é aplicado no código
1. **Origem:** O Super Admin acessa `SABarbeariasView.tsx` ou `SABarbeariaDetailView.tsx` e clica em **"Suspender Barbearia"**.
2. **Função:** Chama `suspenderBarbearia(id, motivo)` em `src/context/SuperAdminContext.tsx` (linhas 238–268).
3. **Efeito no Estado:** 
   - A barbearia tem seu `status` alterado para `'SUSPENSA'`.
   - Registra `motivoSuspensao`, `suspensoPor` (nome e e-mail do admin logado) e `suspensoEm` (timestamp).
   - A assinatura correspondente em `assinaturas` tem o status alterado para `'SUSPENSA'`.
   - Um registro de auditoria é gravado via `logAction('SUSPENSAO_BARBEARIA', ...)`.
4. **Aplicação do Bloqueio no Tenant (`src/App.tsx`, linhas 68–70 e 96–150):**
   ```typescript
   const currentTenantInfo = barbearias.find((b) => b.id === 'barbearia-1');
   const isTenantSuspended = currentTenantInfo?.status === 'SUSPENSA';
   ```
   Se `isTenantSuspended === true`, o componente interrompe a renderização normal do sistema da barbearia e renderiza a **Tela de Bloqueio**:
   - Título: *"Acesso Administrativo Temporariamente Suspenso"*.
   - Exibe o motivo exato registrado pelo Super Admin (`motivoSuspensao`).
   - Bloqueia acesso à Agenda, Financeiro, Clientes e Configurações da barbearia.
   - Fornece botão de contato com o suporte e atalho para o Super Admin reverter a suspensão.
   - **Garante integridade:** Não destrói os dados salvos em `localStorage`.

---

## 7. ÁREA DA BARBEARIA (PAINEL DO BARBEIRO / PROPRIETÁRIO)

Mapeamento de todas as 12 visualizações encontradas em `src/components/views/`:

### 7.1 Dashboard (`src/components/views/DashboardView.tsx`)
* **Função:** Visão geral do dia e do mês.
* **Métricas Apresentadas:** Faturamento do dia, Atendimentos hoje, Ticket médio, Clientes novos, Agendamentos pendentes.
* **Ações Disponíveis:** Botão "Fazer agendamento de teste", "Novo agendamento", "Copiar link da agenda pública", atalhos para fechar caixa.
* **Dados:** Lê de `agendamentos`, `lancamentos`, `clientes`, `config`.

### 7.2 Agenda (`src/components/views/AgendaView.tsx`)
* **Função:** Controle diário de horários e atendimento.
* **Ações:** Seleção de dias da semana (botões circulares/pílulas por data), visualização da grade horária (09:00 às 19:00), botão "Bloquear Horário" (almoço/intervalo), botão "Concluir Atendimento", botão "Cancelar", atalho para conversa no WhatsApp com o cliente do horário.
* **Dados:** Lê e altera `agendamentos` e `profissionais`.

### 7.3 Clientes (`src/components/views/ClientesView.tsx`)
* **Função:** Cadastro e CRM de clientes.
* **Ações:** Listagem com busca, filtro por status (`ativo`, `em_risco`, `inativo`), botão "Novo cliente", visualização de histórico de gastos e pontos de fidelidade.
* **Dados:** Lê e altera `clientes`.

### 7.4 Serviços (`src/components/views/ServicosView.tsx`)
* **Função:** Catálogo de serviços e combos.
* **Ações:** Alternar ativo/inativo com interruptor visual, botão "Novo serviço" (abre `NovoServicoModal`), exclusão de serviço, filtro por ativos/inativos, aba de combos (`ComboServico`).
* **Dados:** Lê e altera `servicos` e `combos`.

### 7.5 Funcionários (`src/components/views/FuncionariosView.tsx`)
* **Função:** Cadastro de barbeiros e colaboradores.
* **Ações:** Lista de profissionais, definição de horário de entrada e saída (09:00 - 19:00), comissão base percentual, modal para adicionar novo profissional.
* **Dados:** Lê e altera `profissionais`.

### 7.6 Meu Desempenho (`src/components/views/MeuDesempenhoView.tsx`)
* **Função:** Relatório individual do barbeiro logado.
* **Ações:** Filtros por período (Hoje, 7 dias, Este mês), cálculo de atendimentos realizados, total bruto gerado e comissão a receber estimada.
* **Dados:** Cruzamento entre `agendamentos` e `profissionais[0].comissaoBase`.

### 7.7 Financeiro (`src/components/views/FinanceiroView.tsx`)
* **Função:** Fluxo de caixa e lançamentos da barbearia.
* **Ações:** Filtro de período, 6 cards de resumo (Receitas, Despesas, Saldo/Lucro, Margem %, Ticket Médio, Total de Atendimentos), botão "Novo lançamento" (abre `NovoLancamentoModal`), exclusão de despesas/receitas manuais.
* **Dados:** `lancamentos` (do tipo `LancamentoFinanceiro`).

### 7.8 Marketing IA (`src/components/views/MarketingIaView.tsx`)
* **Função:** Automações de mensagens de pós-atendimento, lembretes e campanhas no WhatsApp.
* **Ações:** Ativar/desativar 4 réguas automáticas (Lembrete 24h, Pós-atendimento com link Google Review, Cliente sumido >60 dias, Aniversariante 7 dias antes), gerador assistido de cópia promocional com consumo de tokens IA.
* **Dados:** `automacoes`, `campanhas`, `config.tokensIA`.

### 7.9 Fidelização (`src/components/views/FidelizacaoView.tsx`)
* **Função:** Gestão de clube de fidelidade e cupons de desconto.
* **Ações:** Criação de novos cupons com pontuação necessária e valor de desconto, lista de cupons ativos, ranking de pontuação dos clientes cadastrados.
* **Dados:** `cupons`, `clientes`.

### 7.10 Consultor IA (`src/components/views/ConsultorIaView.tsx`)
* **Função:** Assistente virtual inteligente para gestão da barbearia.
* **Ações:** Chat interativo com prompts rápidos ("Como preencher horários vagos", "Aumentar ticket médio", "Analisar metas").
* **Mecanismo:** Tenta `POST /api/consultor`; ao constatar ausência do backend, ativa algoritmo de respostas contextuais baseado nos serviços reais, ticket médio e agenda da barbearia. Consome 2 tokens IA por pergunta.
* **Dados:** `chatMessages`, `config.tokensIA`.

### 7.11 Plano (`src/components/views/PlanoView.tsx`)
* **Função:** Gestão da assinatura da barbearia com a plataforma BarberPilot.
* **Ações:** Visualização dos dias restantes do teste gratuito (ex: 3 dias), comparação visual dos planos Starter, Essencial e Pro, botões para upgrade de plano.
* **Dados:** `config.plano`, `config.diasRestantesTeste`.

### 7.12 Configurações (`src/components/views/ConfiguracoesView.tsx`)
* **Função:** Parâmetros cadastrais e regras da barbearia.
* **Ações:** Edição de Nome da barbearia, Slug, Telefone/WhatsApp do admin, CNPJ/CPF, link de avaliações do Google Reviews, mensagem padrão de pós-corte, metas de faturamento mensal e diário.
* **Dados:** `config` (interface `BarbeariaConfig`).

---

## 8. AGENDA E CÁLCULO DE DISPONIBILIDADE

### 8.1 Estrutura e Lógica da Agenda (`src/components/views/AgendaView.tsx`)
* **Grade Temporal:** Intervalos fixos de 1 hora entre `09:00` e `19:00` (11 slots diários).
* **Slots Disponíveis no Código:** `['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00']`.
* **Cálculo de Ocupação:**
  ```typescript
  const slotBooking = agendamentosDoDia.find((a) => a.horario === hour);
  ```
  - Se `slotBooking` existir e `status !== 'cancelado'`, o slot é considerado **Ocupado**.
  - Se `slotBooking.status === 'bloqueado'`, renderiza card âmbar com o ícone de cadeado e o motivo (ex: "Almoço / Intervalo").
  - Se não houver registro no horário, renderiza botão com borda tracejada: `"Disponível · Agendar às {hour}"`.
* **Conflitos e Sobreposições:** O sistema verifica igualdade estrita de horário (`a.horario === hour`). Não há cálculo fracionado de 15 em 15 minutos na grade principal da tela de visualização interna, embora a duração em minutos (`duracao`) seja armazenada no objeto.
* **Encaixes / Solicitações:** Existe um quadro visual intitulado *"Solicitações de encaixe"*, atualmente com o estado: *"Nenhuma solicitação pendente no momento. Quando um cliente pedir encaixe, a solicitação aparece aqui em tempo real"*. Trata-se de funcionalidade **parcialmente implementada (apenas visual)**.
* **Bloqueio de Horários:** Modal funcional que cria um registro em `agendamentos` com `status: 'bloqueado'` e `valor: 0`. O botão de desbloqueio atualiza o status para `'cancelado'`, liberando o horário imediatamente.

---

## 9. FLUXO DE AGENDAMENTO DO CLIENTE

O projeto possui **duas interfaces** para agendamento por parte do cliente:

### 9.1 Modal Público de Agendamento (`PublicBookingModal.tsx`)
Simula a página pública exclusiva da barbearia (`https://barberpilot.app/barbearia-do-manel`).
* **Etapa 1 — Escolha do Serviço:** Lista todos os serviços com `ativo === true`. Exibe nome, duração em minutos, descrição e preço em R$.
* **Etapa 2 — Escolha do Profissional:** Lista os barbeiros cadastrados com avatar, nome e cargo.
* **Etapa 3 — Data e Horário:** Campo `input[type="date"]` e grade com 9 horários (`09:00` às `18:00`).
* **Etapa 4 — Dados do Cliente:** Campos obrigatórios de Nome Completo e WhatsApp com DDD.
* **Confirmação / Sucesso:** Salva o agendamento em `BarberContext`, auto-cadastra o cliente caso não exista, e exibe comprovante de confirmação na tela.

### 9.2 Agendamento no Portal do Cliente (`ClientePortal.tsx`, Aba "Novo Agendamento")
Fluxo guiado em 4 etapas numeradas:
1. **Passo 1 (Serviço):** Seleção de serviço ativo com card interativo.
2. **Passo 2 (Profissional):** Seleção do profissional ou opção *"Qualquer Barbeiro Disponível"*.
3. **Passo 3 (Data & Horário):** Seletor de data e grade responsiva de horários livres calculados.
4. **Passo 4 (Revisão & Cupom):** Resumo do agendamento, input opcional para Cupom de Desconto com validação em tempo real e cálculo de abatimento, e botão de confirmação.

---

## 10. ÁREA DO CLIENTE (`/cliente` OU `ClientePortal.tsx`)

A área do cliente reproduz a experiência completa inspirada em `barberpilot.app/cliente`:

### 10.1 Funcionalidades Mapeadas no Código
* **Identificação / Login do Cliente:**
  - Login por número de telefone com máscara `(99) 99999-9999`.
  - Opção de troca rápida de perfil entre os clientes mockados para testes imediatos.
  - Auto-cadastro instantâneo caso o número não exista na base.
  - Armazenamento da sessão ativa em `localStorage` sob a chave `barberpilot_active_client_phone`.
* **Aba 1 — Meus Agendamentos:**
  - Card de destaque com o **Próximo Agendamento**: status (Confirmado/Pendente), data, horário e barbeiro.
  - **Adicionar ao Google Agenda:** Botão que monta a URL `https://calendar.google.com/calendar/render?action=TEMPLATE&text=...` com dados do corte.
  - **Como Chegar:** Abre o Google Maps com o endereço cadastrado da barbearia.
  - **WhatsApp da Barbearia:** Link com texto pré-configurado: *"Olá! Gostaria de confirmar meu agendamento de {serviço}..."*.
  - **Cancelamento:** Modal de confirmação que altera o status para `'cancelado'` e libera a vaga na barbearia.
  - **Histórico de Cortes Anteriores:** Lista com valores e datas passadas.
  - **Botão "Repetir Agendamento":** Preenche automaticamente o serviço e o barbeiro para remarcação rápida em 1 clique.
  - **Avaliação:** Sistema de estrelas (1 a 5) com link direto para o Google Reviews da barbearia.
* **Aba 2 — Novo Agendamento:** Fluxo em 4 passos com aplicação de cupom.
* **Aba 3 — Clube de Fidelidade & Cupons:**
  - Cartão fidelidade virtual com selos/carimbos gráficos baseados nos cortes realizados.
  - Pontuação acumulada (ex: R$ 5,00 gastos = 1 ponto).
  - Catálogo de cupons resgatáveis (ex: Desconto de R$ 10,00 ou Barba Grátis). O resgate deduz os pontos do cliente e gera um código de cupom aplicável.
* **Aba 4 — Perfil & Barbearia:**
  - Exibição de telefone, endereço físico completo, horário de funcionamento e redes sociais da barbearia.

---

## 11. SERVIÇOS E COMBOS

### 11.1 Estrutura de Dados do Serviço (`src/types/index.ts`, linhas 52–63)
```typescript
export interface Servico {
  id: string;
  nome: string;
  duracao: number; // minutos
  preco: number;
  ativo: boolean;
  categoria: string; // Ex: 'Básico', 'Química'
  cor: string;
  quemAtende: string[]; // ['todos'] ou array de IDs de profissionais
  adicionaisSugeridos?: string[];
  descricao?: string;
}
```

### 11.2 Onde os dados ficam armazenados
* **Início:** Inicializados a partir de `src/data/mockData.ts` (10 serviços pré-configurados).
* **Persistência em Execução:** Sincronizados em tempo real no `localStorage` sob a chave `barberpilot_servicos`.
* **API / Backend:** Não há banco remoto conectado para os serviços.

---

## 12. PAGAMENTOS

### 12.1 Na Área da Barbearia (Atendimento do Cliente)
* **Status:** **Simulado / Registro Operacional.**
* **Como funciona:** Quando um agendamento é marcado como `'atendido'` na `AgendaView.tsx` ou quando um lançamento de receita é cadastrado manualmente em `FinanceiroView.tsx`, o valor é somado ao faturamento e DRE local.
* **Gateways para o cliente final:** Não há checkout transparente ou gateway (Stripe/MercadoPago/Pix) acoplado diretamente no fluxo público de agendamento do cliente no momento da auditoria. O pagamento é realizado presencialmente na barbearia.

### 12.2 Na Área do Super Admin (Assinaturas SaaS)
* **Status:** **Estruturado com simulação completa e abstração de gateways.**
* **Componentes:** `SAPagamentosView.tsx`, `SAAssinaturasView.tsx`, `SAConfiguracoesView.tsx`.
* **Métodos Suportados no Tipo:** `PIX`, `CARTAO`, `BOLETO`.
* **Provedores Preparados nas Configurações (`PlatformConfig`):** `'MercadoPago' | 'Stripe' | 'Asaas'`.
* **Variáveis de Ambiente / Webhooks:** **Não encontrados no código analisado.** A aprovação e estorno de pagamentos operam via alteração de estado no `SuperAdminContext` (`aprovarPagamento` e `estornarPagamento`).

---

## 13. WHATSAPP

### 13.1 Mapeamento de Integrações com WhatsApp

| Local | Tipo | Como Funciona | Conteúdo / Mensagem | Status |
|---|---|---|---|---|
| `AgendaView.tsx` (linha 308) | Link Direto `wa.me` | Abre o WhatsApp Web/App com o telefone do cliente agendado | Link direto para o número do cliente sem template | Funcional |
| `ClientePortal.tsx` (linhas 391, 570) | Link Direto `wa.me` | Abre o WhatsApp da barbearia para confirmar ou tirar dúvidas | Mensagem pré-formatada: *"Olá! Gostaria de falar sobre meu agendamento..."* | Funcional |
| `SAInadimplenciaView.tsx` (linha 166) | Link de Cobrança `wa.me` | Abre o WhatsApp do dono da barbearia inadimplente | *"Olá {Nome}, identificamos pendência na sua assinatura do BarberPilot..."* | Funcional |
| `MarketingIaView.tsx` (linhas 188–230) | Modelos de Mensagem | Exibe mensagens automáticas de Lembrete 24h, Pós-atendimento e Aniversariante | Substituição de tags `{cliente}`, `{barbearia}`, `{horario}`, `{link}` | Funcional (cópia manual / disparo) |
| `ConfiguracoesView.tsx` | Configuração | Salva número de WhatsApp da barbearia | Armazenado em `config.telefoneAdmin` | Funcional |
| **API Direta / Disparo em Segundo Plano** | Automação sem intervenção humana | Provedores tipados em `PlatformConfig`: `EvolutionAPI`, `Z-API`, `MetaCloudAPI` | **Não foi possível confirmar pelo código analisado.** As chamadas HTTP externas para APIs do WhatsApp estão marcadas como abstração futura (`whatsappAtivo: false`). | Parcial / Abstração |

---

## 14. SUPABASE / BANCO DE DADOS

* **Supabase Client:** **Não encontrado.** Não há dependência `@supabase/supabase-js` no `package.json`, nem inicialização `createClient()` em nenhum arquivo.
* **Tabelas / Migrations:** Não existem arquivos `.sql` ou pastas `supabase/migrations`.
* **RLS (Row Level Security):** Não aplicável no ambiente atual, visto que não há banco PostgreSQL conectado.
* **Storage / Buckets:** Não há buckets de arquivos ou uploads remotos ativos. Os avatares utilizam siglas em SVG/CSS (ex: `"RS"`, `"BM"`, `"SA"`).
* **Persistência Real Existente:** `localStorage` do navegador para todas as entidades (ver seção 18).

---

## 15. AUTENTICAÇÃO

### 15.1 Como Cada Perfil Entra no Sistema

```
                         TELA DE ENTRADA DO SISTEMA
                                     │
           ┌─────────────────────────┼─────────────────────────┐
           │                         │                         │
           ▼                         ▼                         ▼
   ÁREA DO CLIENTE             SUPER ADMIN                 BARBEARIA
   URL: /cliente               URL: /super-admin           URL: / ou raiz
   Identificação por           Login com e-mail e senha    Acesso direto ao tenant
   telefone formatado          (admin@barberpilot.app)     (Sessão do barbeiro
   (LocalStorage)              (LocalStorage Token)        proprietário ativa)
```

1. **Super Admin:**
   - Tela de login dedicada em `src/components/superadmin/views/SALoginView.tsx`.
   - Credenciais verificadas no código: `admin@barberpilot.app` com senha `admin123`.
   - Token salvo: `localStorage.setItem('sa_auth_token', 'super_admin_authenticated')`.
   - Logout: remove a chave e redireciona para a tela de login.
2. **Barbearia (Proprietário / Barbeiro):**
   - No estado atual do projeto, a barbearia entra diretamente no tenant carregado (`Barbearia do manel` — Ruan Santos), com persistência dos dados salvos no navegador.
3. **Cliente:**
   - Entra informando o número de WhatsApp em `ClientePortal.tsx`. Não exige senha complexa (login passwordless simplificado por telefone).

---

## 16. MATRIZ DE PERMISSÕES

| Funcionalidade / Ação | Super ADM | Barbearia (Dono) | Barbeiro | Cliente | Status no Código |
|---|:---:|:---:|:---:|:---:|---|
| Acessar Painel Global do SaaS | Sim | Não | Não | Não | Verificado (`SALoginView`) |
| Suspender / Reativar Barbearias | Sim | Não | Não | Não | Verificado (`SuperAdminContext`) |
| Criar e Editar Planos SaaS | Sim | Não | Não | Não | Verificado (`SAPlanosView`) |
| Ver Faturamento Total da Plataforma | Sim | Não | Não | Não | Verificado (`SADashboardView`) |
| Gerenciar Serviços da Barbearia | Não | Sim | Não | Não | Verificado (`ServicosView`) |
| Gerenciar Funcionários e Comissões | Não | Sim | Não | Não | Verificado (`FuncionariosView`) |
| Criar Lançamento Financeiro da Barbearia | Não | Sim | Não | Não | Verificado (`FinanceiroView`) |
| Visualizar Agenda Geral | Não | Sim | Sim | Não | Verificado (`AgendaView`) |
| Concluir / Cancelar Atendimento na Barbearia| Não | Sim | Sim | Não | Verificado (`AgendaView`) |
| Agendar Horário Online | Não | Sim | Não | Sim | Verificado (`PublicBookingModal` / `ClientePortal`) |
| Resgatar Cupom de Fidelidade | Não | Não | Não | Sim | Verificado (`ClientePortal`) |
| Cancelar Próprio Agendamento | Não | Não | Não | Sim | Verificado (`ClientePortal`) |

---

## 17. ROTAS DO SISTEMA

O projeto opera como uma SPA (Single Page Application) sem biblioteca externa `react-router-dom`, utilizando **roteamento de estado inteligente sincronizado com a URL**:

| Rota / Parâmetro | Tipo | Perfil Alvo | Tela Renderizada | Proteção / Guard | Função |
|---|---|---|---|---|---|
| `/` | Path Raiz | Barbearia | `MainAppContent` (`DashboardView`) | Aberta / Sessão Tenant | Painel de controle da barbearia |
| `/super-admin` | Path / Query | Super Admin | `SALoginView` ou `SuperAdminLayout` | `isSuperAdminAuthenticated` | Painel de controle global do SaaS |
| `/cliente` | Path / Query | Cliente | `ClientePortal` | Telefone Identificado | Área exclusiva do cliente da barbearia |
| `?mode=super-admin` | Query Param | Super Admin | `SALoginView` ou `SuperAdminLayout` | `isSuperAdminAuthenticated` | Atalho para painel Super Admin |
| `?mode=cliente` | Query Param | Cliente | `ClientePortal` | Telefone Identificado | Atalho para portal do cliente |
| `?portal=cliente` | Query Param | Cliente | `ClientePortal` | Telefone Identificado | Compatibilidade com links externos |

---

## 18. COMPONENTES PRINCIPAIS DO SISTEMA

### 18.1 Estrutura e Navegação
* `src/App.tsx`: Roteador mestre de 3 vias (`tenant`, `super-admin`, `cliente`), guardião de suspensão e provedor de modais.
* `src/components/Sidebar.tsx`: Barra de navegação lateral retrátil da barbearia, links com badges, botão para Área do Cliente e atalho com chave `ROOT` para o Super Admin.
* `src/components/TopBanner.tsx`: Alerta superior de contagem regressiva do período de teste com link direto para escolha de planos.
* `src/components/superadmin/SuperAdminLayout.tsx`: Layout mestre do Super Admin com sidebar escura, header com perfil do administrador, notificações com contagem não-lida e botão de logout.

### 18.2 Modais Globais Reutilizáveis (`src/components/modals/`)
* `NovoAgendamentoModal.tsx`: Cadastro rápido de horário para qualquer cliente e barbeiro.
* `NovoClienteModal.tsx`: Cadastro de clientes com dados complementares (Instagram, aniversário, notas).
* `NovoServicoModal.tsx`: Formulário completo de serviços (preço, duração, categoria, profissionais habilitados).
* `NovoLancamentoModal.tsx`: Registro manual de receita ou despesa financeira.
* `PublicBookingModal.tsx`: Visualização pública da barbearia com stepper de agendamento em 4 etapas.
* `TourModal.tsx`: Guia interativo passo a passo para novos usuários da barbearia.
* `SupportModal.tsx`: Central de suporte com links para WhatsApp e documentação.

---

## 19. GESTÃO DE ESTADO DA APLICAÇÃO

O estado é gerenciado através da **React Context API** combinada com sincronização declarativa no **`localStorage`**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        BARBER CONTEXT STORAGE                          │
├───────────────────────────────────┬────────────────────────────────────┤
│ Chave LocalStorage                │ Conteúdo                           │
├───────────────────────────────────┼────────────────────────────────────┤
│ `barberpilot_config`              │ Parâmetros gerais da barbearia     │
│ `barberpilot_profissionais`       │ Lista de barbeiros e horários      │
│ `barberpilot_servicos`            │ Catálogo de serviços               │
│ `barberpilot_combos`              │ Pacotes e combos promocionais      │
│ `barberpilot_clientes`            │ Base de clientes e pontuação       │
│ `barberpilot_agendamentos`        │ Agenda de horários marcados        │
│ `barberpilot_lancamentos`         │ Fluxo de caixa (receitas/despesas) │
│ `barberpilot_automacoes`          │ Configuração das réguas de disparo │
│ `barberpilot_campanhas`           │ Campanhas salvas de marketing      │
│ `barberpilot_cupons`              │ Cupons de fidelidade resgatáveis   │
│ `barberpilot_chat`                │ Histórico do Consultor IA          │
│ `barberpilot_active_client_phone` │ Telefone do cliente autenticado    │
└───────────────────────────────────┴────────────────────────────────────┘
```

```
┌────────────────────────────────────────────────────────────────────────┐
│                      SUPER ADMIN CONTEXT STORAGE                       │
├───────────────────────────────────┬────────────────────────────────────┤
│ Chave LocalStorage                │ Conteúdo                           │
├───────────────────────────────────┼────────────────────────────────────┤
│ `sa_auth_token`                   │ Token da sessão do Super Admin     │
│ `sa_user`                         │ Objeto do usuário Super Admin      │
│ `sa_barbearias`                   │ Lista de todos os tenants          │
│ `sa_planos`                       │ Planos SaaS cadastrados            │
│ `sa_assinaturas`                  │ Contratos e recorrência            │
│ `sa_pagamentos`                   │ Histórico de transações da plataf. │
│ `sa_usuarios`                     │ Usuários globais de todas as unid. │
│ `sa_avisos`                       │ Comunicados globais do sistema     │
│ `sa_audit_logs`                   │ Trilha de auditoria das ações      │
│ `sa_config`                       │ Parâmetros de negócio e gateways   │
│ `sa_notifications`                │ Notificações internas do admin     │
└───────────────────────────────────┴────────────────────────────────────┘
```

---

## 20. INTEGRAÇÕES EXTERNAS E VARIÁVEIS DE AMBIENTE

### 20.1 Variáveis de Ambiente Mapeadas (`.env.example`)
* `GEMINI_API_KEY`: Destinada para autenticação do SDK `@google/genai` (injetada pelo ambiente do Google AI Studio).
* `APP_URL`: URL onde a aplicação está hospedada (Cloud Run service URL), utilizada para referências absolutas e callbacks.

### 20.2 Serviços Externos Verificados

| Serviço | Arquivo | Finalidade | Status Real no Código |
|---|---|---|---|
| **WhatsApp Web / API** | `AgendaView.tsx`, `ClientePortal.tsx`, `SAInadimplenciaView.tsx` | Contato com clientes, confirmações e cobranças | Real via URLs `https://wa.me/55...` |
| **Google Calendar** | `ClientePortal.tsx` | Adicionar horário à agenda pessoal do cliente | Real via links dinâmicos de template de calendário |
| **Google Maps** | `ClientePortal.tsx`, `PublicBookingModal.tsx` | Traçar rota até a barbearia | Real via URL de busca de endereço |
| **Google GenAI** | `package.json`, `ConsultorIaView.tsx` | Inteligência artificial consultiva | Dependência instalada. Execução opera com fallback inteligente local no frontend |
| **Gateways (MercadoPago/Stripe)** | `SAConfiguracoesView.tsx`, `SAPagamentosView.tsx` | Faturamento de assinaturas SaaS | Mock estruturado / Interface configurável |
| **Supabase** | N/A | Banco relacional na nuvem | **Não encontrado no projeto** |

---

## 21. DEPENDÊNCIAS DO PROJETO

Listadas a partir de `/package.json`:

### Dependências de Produção (`dependencies`)
* `@google/genai` (`^2.4.0`): SDK oficial da Google para chamadas aos modelos Gemini.
* `@tailwindcss/vite` (`^4.3.3`): Plugin oficial do Tailwind CSS v4 para o Vite.
* `@vitejs/plugin-react` (`^6.1.1`): Suporte oficial para compilação Fast Refresh do React no Vite.
* `lucide-react` (`^0.546.0`): Biblioteca de ícones SVG moderna e uniforme.
* `react` (`^19.0.1`): Biblioteca principal de interfaces.
* `react-dom` (`^19.0.1`): Renderizador para o navegador.
* `vite` (`^8.3.0`): Servidor de desenvolvimento e bundler de alta performance.
* `express` (`^4.21.2`): Servidor HTTP Node.js (presente no package.json; no momento a aplicação roda via Vite SPA).
* `dotenv` (`^17.2.3`): Carregador de variáveis de ambiente.
* `motion` (`^12.23.24`): Biblioteca de transições e microinterações de interface.

### Dependências de Desenvolvimento (`devDependencies`)
* `typescript` (`^7.0.2`): Compilador e checagem de tipos estáticos.
* `tsx` (`^4.21.0`): Executor TypeScript para Node.js.
* `tailwindcss` (`^4.3.3`): Motor de estilos utilitários.
* `esbuild` (`^0.25.0`): Minificador e bundler ultrarrápido.
* `autoprefixer` (`^10.4.21`): Adição de prefixos de compatibilidade em CSS.
* `@types/*`: Tipagens para Node, React, React DOM e Express.

---

## 22. DEPLOY E PROCESSO DE BUILD

* **Comando de Build:** `npm run build` (executa `vite build`).
* **Saída Gerada:** Pasta `dist/` com arquivos estáticos HTML, JS e CSS minificados.
* **Comando de Lint / Verificação:** `npm run lint` (executa `tsc --noEmit`). Ambas as checagens foram executadas durante a auditoria com **0 erros** de compilação ou tipagem.
* **Hospedagem Atual:** Google AI Studio Preview / Cloud Run (conforme identificado na variável `APP_URL`).

---

## 23. SEGURANÇA E ISOLAMENTO ENTRE BARBEARIAS

### 23.1 Diagnóstico de Segurança Atual
1. **Autenticação:** O isolamento das áreas (Super Admin vs Barbearia vs Cliente) ocorre a nível de **lógica de aplicação no frontend**.
2. **Secrets:** Nenhuma credencial de API ou chave privada está exposta no código-fonte cliente. A chave `GEMINI_API_KEY` consta apenas como referência em `.env.example`.
3. **Isolamento de Dados Multi-tenant:**
   - **No Super Admin:** O array `barbearias` contém múltiplos tenants mockados (`barbearia-1`, `barbearia-2`, etc.). O Super Admin visualiza e gerencia todos eles.
   - **Na Barbearia Atual:** A aplicação da barbearia está fixada no tenant `barbearia-1` (`Barbearia do manel`), lendo apenas suas chaves em `localStorage`.
   - **No Cliente:** O cliente acessa apenas os dados da barbearia em que está agendando (`config.nome`, serviços e profissionais ativos).
4. **Vulnerabilidade Identificada para Produção Futura:** Como a persistência atual está em `localStorage`, os dados ficam salvos localmente na máquina do usuário. Em uma futura transição para banco de dados multi-tenant na nuvem (ex: Supabase/PostgreSQL), será **mandatório** criar tabelas com coluna `tenant_id` e políticas de segurança RLS (Row Level Security).

---

## 24. FLUXO REAL DE OPERAÇÃO DO SISTEMA

```
                              FLUXO REAL EXISTENTE
                              
 1. Super Admin Cadastra/Ativa Barbearia
    (SABarbeariasView -> adicionarBarbearia -> cria Tenant e Assinatura em sa_*)
                                     │
                                     ▼
 2. Barbearia Configura Regras e Serviços
    (ServicosView, FuncionariosView, ConfiguracoesView -> salvos em barberpilot_*)
                                     │
                                     ▼
 3. Cliente Acessa Link Público / Portal do Cliente
    (ClientePortal ou PublicBookingModal -> escolhe Serviço, Barbeiro, Data e Hora)
                                     │
                                     ▼
 4. Confirmação do Agendamento
    (addAgendamento() -> grava em barberpilot_agendamentos)
    (Gera link para Google Agenda e atalho WhatsApp)
                                     │
                                     ▼
 5. Barbeiro Visualiza na Agenda e Realiza o Corte
    (AgendaView -> clica em "Concluir")
                                     │
                                     ▼
 6. Impacto Automático no Financeiro e Fidelidade
    (updateAgendamentoStatus('atendido') -> gera Receita em FinanceiroView)
    (Soma pontos de fidelidade no perfil do Cliente para resgate de Cupons)
                                     │
                                     ▼
 7. Super Admin Acompanha Desempenho Global
    (SADashboardView consolida MRR, novos clientes e saúde do tenant)
```

---

## 25. CLASSIFICAÇÃO GERAL DE FUNCIONALIDADES

### 25.1 Funcionalidades Confirmadamente Funcionais
* Grade de Agenda interativa por dia da semana e profissional.
* Bloqueio e desbloqueio de horários na agenda (almoço/intervalo).
* Conclusão de atendimentos com injeção automática de receita no Financeiro.
* Portal do Cliente completo com login por telefone, histórico e repetição de cortes em 1 clique.
* Sistema de pontos de fidelidade com carimbos visuais e resgate de cupons reais.
* Adição automática de agendamentos no Google Agenda do cliente.
* Abertura de conversas no WhatsApp com mensagens pré-formatadas para clientes e barbeiros.
* Cadastro, edição, ativação e exclusão de Serviços e Combos.
* Controle financeiro com receitas, despesas, cálculo de margem e saldo em tempo real.
* Mecanismo de suspensão e bloqueio de barbearias pelo Super Admin com bloqueio visual do tenant.
* CRUD completo de Planos SaaS no Super Admin com limites configuráveis.
* Sistema de auditoria interna com registro cronológico de ações administrativas.

### 25.2 Funcionalidades Parcialmente Implementadas
* **Consultor IA:** Chat totalmente funcional com interface rica, tokens e respostas inteligentes locais baseadas nos números reais da barbearia; a conexão externa via endpoint HTTP `/api/consultor` é interceptada por fallback inteligente.
* **Marketing IA:** Criação de campanhas e réguas automáticas operacionais para envio manual pelo WhatsApp; disparos 100% autônomos em background via webhook dependem de integração externa com gateways de WhatsApp.
* **Solicitações de Encaixe na Agenda:** O quadro visual existe na `AgendaView.tsx`, mas a fila de pedidos em tempo real depende de websocket / backend.

### 25.3 Funcionalidades Mockadas (Simulações em LocalStorage)
* **Pagamentos SaaS no Super Admin:** Aprovação e estorno de pagamentos atuam sobre o array de pagamentos local, simulando os IDs de gateway (`mp_pay_*`, `pix_*`, `st_ch_*`).
* **Dados Iniciais:** Seed inicial em `mockData.ts` e `superAdminInitialData.ts` para permitir teste imediato de todas as funções sem necessidade de setup de banco.

### 25.4 Funcionalidades Não Encontradas ("Não foi possível confirmar pelo código analisado")
* Conexão com banco Supabase ou PostgreSQL.
* Configurações de Webhook para processamento assíncrono de notificações de pagamento.
* Disparo direto de e-mails transacionais (SMTP ou SendGrid).

---

## 26. COMPLEXIDADES DO SISTEMA ATUAL

1. **Volume de Estado Local:** Existem dezenas de chaves em `localStorage`. Caso o usuário limpe os dados de navegação, as alterações feitas localmente retornam ao estado inicial dos mocks.
2. **Duplicidade de Fluxo de Agendamento:** O agendamento pode ser feito de 3 formas distintas:
   - Internamente pelo Barbeiro via `NovoAgendamentoModal.tsx`.
   - Pelo cliente no modal público rápido via `PublicBookingModal.tsx`.
   - Pelo cliente no portal completo via `ClientePortal.tsx`.
   Isso oferece versatilidade, mas exige manter as regras de validação sincronizadas entre esses arquivos.
3. **Escala de Horários da Agenda:** A agenda atual tem slots fixos de 1h (`09:00`, `10:00`, etc.). Serviços com durações de 15, 30 ou 45 minutos (como sobrancelha) ocupam visualmente o slot inteiro daquela hora.

---

## 27. OPORTUNIDADES DE SIMPLIFICAÇÃO E CENÁRIO "MINI CENTRAL DIGITAL"

Pensando no objetivo futuro de **não sobrecarregar o cliente com um sistema gigantesco**, a auditoria identificou oportunidades estratégicas:

### 27.1 O que o Cliente Realmente Precisa
Para uma experiência leve e rápida (ex: Mini Central Lupumba), o cliente final necessita apenas de:
1. **Apresentação da Barbearia:** Nome, logo, endereço, horário de atendimento e link para o WhatsApp.
2. **Botão de Ação Direta:** *"Agendar Horário"*.
3. **Fluxo Rápido de Agendamento:** Escolher Serviço -> Barbeiro -> Horário -> Nome e WhatsApp.
4. **Comprovante Simples:** Botão de adicionar ao Google Agenda e confirmação no WhatsApp.

### 27.2 O que Pode Ficar Restrito ao Barbeiro e Admin
* Toda a complexidade de tokens IA, chat do consultor IA, DRE financeiro, margem de lucro, cadastro de despesas, configuração de comissões e gestão de planos SaaS **deve permanecer invisível ao cliente final**.

### 27.3 Como a Mini Central pode se Conectar ao Sistema Atual
```
  ┌─────────────────────────────────────────────────────────────┐
  │                 MINI CENTRAL DA BARBEARIA                   │
  │     (Apresentação visual, fotos, endereço e destaques)      │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
                                 ▼ [Clica em: "AGENDAR HORÁRIO"]
  ┌─────────────────────────────────────────────────────────────┐
  │            COMPONENTE APROVEITADO DO SISTEMA ATUAL          │
  │   Opção A: PublicBookingModal.tsx (Compacto / 4 passos)    │
  │   Opção B: ClientePortal.tsx?aba=novo (Completo com cupom)  │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
                                 ▼ [Agendamento Concluído]
  ┌─────────────────────────────────────────────────────────────┐
  │               AGENDA CENTRAL DA BARBEARIA                   │
  │   O agendamento entra automaticamente na AgendaView.tsx     │
  │   do barbeiro sem atrito nem telas desnecessárias           │
  └─────────────────────────────────────────────────────────────┘
```
* **Telas que já podem ser aproveitadas de imediato:** O componente `PublicBookingModal.tsx` já possui toda a lógica de 4 etapas pronta e pode ser incorporado diretamente na Mini Central ou acionado por redirecionamento via URL (ex: `https://dominio/?acao=agendar`).

---

## 28. INVENTÁRIO GERAL DE RECURSOS E TELAS

| Área | Recurso / Componente | Arquivo Principal | Status | Perfil Alvo | Banco | Externo |
|---|---|---|---|---|---|---|
| **Super Admin** | Dashboard SaaS | `SADashboardView.tsx` | Funcional | `SUPER_ADMIN` | LocalStorage | Não |
| **Super Admin** | Gestão de Barbearias | `SABarbeariasView.tsx` | Funcional | `SUPER_ADMIN` | LocalStorage | Não |
| **Super Admin** | Detalhes & Suspensão | `SABarbeariaDetailView.tsx` | Funcional | `SUPER_ADMIN` | LocalStorage | Não |
| **Super Admin** | Planos da Plataforma | `SAPlanosView.tsx` | Funcional | `SUPER_ADMIN` | LocalStorage | Não |
| **Super Admin** | Assinaturas SaaS | `SAAssinaturasView.tsx` | Funcional | `SUPER_ADMIN` | LocalStorage | Não |
| **Super Admin** | Transações / Pagamentos | `SAPagamentosView.tsx` | Funcional | `SUPER_ADMIN` | LocalStorage | Não |
| **Super Admin** | Inadimplência & Cobrança | `SAInadimplenciaView.tsx` | Funcional | `SUPER_ADMIN` | LocalStorage | WhatsApp |
| **Super Admin** | Usuários da Plataforma | `SAUsuariosView.tsx` | Funcional | `SUPER_ADMIN` | LocalStorage | Não |
| **Super Admin** | Métricas Analíticas | `SAMetricasView.tsx` | Funcional | `SUPER_ADMIN` | LocalStorage | Não |
| **Super Admin** | Avisos Globais | `SAAvisosView.tsx` | Funcional | `SUPER_ADMIN` | LocalStorage | Não |
| **Super Admin** | Configurações SaaS | `SAConfiguracoesView.tsx` | Funcional | `SUPER_ADMIN` | LocalStorage | Não |
| **Super Admin** | Trilha de Auditoria | `SAAuditoriaView.tsx` | Funcional | `SUPER_ADMIN` | LocalStorage | Não |
| **Super Admin** | Login do Administrador | `SALoginView.tsx` | Funcional | `SUPER_ADMIN` | LocalStorage | Não |
| **Barbearia** | Dashboard da Barbearia | `DashboardView.tsx` | Funcional | `PROPRIETARIO` | LocalStorage | Não |
| **Barbearia** | Agenda Diária / Grade | `AgendaView.tsx` | Funcional | `BARBEIRO` | LocalStorage | WhatsApp |
| **Barbearia** | Cadastro de Clientes | `ClientesView.tsx` | Funcional | `PROPRIETARIO` | LocalStorage | Não |
| **Barbearia** | Catálogo de Serviços | `ServicosView.tsx` | Funcional | `PROPRIETARIO` | LocalStorage | Não |
| **Barbearia** | Equipe e Horários | `FuncionariosView.tsx` | Funcional | `PROPRIETARIO` | LocalStorage | Não |
| **Barbearia** | Meu Desempenho / Comissões | `MeuDesempenhoView.tsx` | Funcional | `BARBEIRO` | LocalStorage | Não |
| **Barbearia** | Controle Financeiro / DRE | `FinanceiroView.tsx` | Funcional | `PROPRIETARIO` | LocalStorage | Não |
| **Barbearia** | Marketing com IA | `MarketingIaView.tsx` | Parcial | `PROPRIETARIO` | LocalStorage | Não |
| **Barbearia** | Programa de Fidelização | `FidelizacaoView.tsx` | Funcional | `PROPRIETARIO` | LocalStorage | Não |
| **Barbearia** | Consultor IA | `ConsultorIaView.tsx` | Parcial (Local) | `PROPRIETARIO` | LocalStorage | Simulado |
| **Barbearia** | Planos e Assinatura | `PlanoView.tsx` | Funcional | `PROPRIETARIO` | LocalStorage | Não |
| **Barbearia** | Configurações da Barbearia | `ConfiguracoesView.tsx` | Funcional | `PROPRIETARIO` | LocalStorage | Não |
| **Cliente** | Portal do Cliente | `ClientePortal.tsx` | Funcional | `CLIENTE` | LocalStorage | Maps/Calendar/WA |
| **Cliente** | Agendamento Público Rápido | `PublicBookingModal.tsx` | Funcional | `CLIENTE` | LocalStorage | Não |

---

## 29. CONCLUSÃO DA AUDITORIA

1. O projeto atual encontra-se **100% íntegro, compilando perfeitamente e sem erros sintáticos ou de tipos** (`npm run build` e `tsc --noEmit` bem-sucedidos).
2. As três grandes áreas solicitadas — **Barbearia**, **Cliente** e **Super Admin** — estão completamente construídas e operacionais em interface, estado e usabilidade.
3. Não existem dependências externas quebradas ou códigos inacessíveis que impeçam a execução imediata.
4. Para a próxima etapa (decisão com outro agente sobre a Mini Central Digital):
   - O fluxo de agendamento pode ser simplificado extraindo-se ou reutilizando diretamente o componente `PublicBookingModal.tsx` ou a aba `novo` de `ClientePortal.tsx`.
   - As decisões sobre conectar um banco de dados persistente em nuvem (como Supabase) e gateways de pagamento reais poderão ser tomadas sobre esta base sólida, respeitando exatamente a matriz mapeada neste documento.
