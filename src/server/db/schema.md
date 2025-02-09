# Schema do Banco de Dados

Este documento descreve o schema do banco de dados da aplicação de compartilhamento de assinaturas, detalhando cada entidade e suas relações.

## Entidades

### Users

Representa os usuários do sistema. Um usuário pode ser tanto dono de algumas contas quanto usuário de outras simultaneamente.

**Campos:**

- `id`: CUID único para identificação
- `name`: Nome completo do usuário
- `email`: Email único do usuário (usado para login)
- `password`: Senha criptografada
- `createdAt`: Data de criação do registro
- `updatedAt`: Data da última atualização

**Índices:**

- `emailIdx`: Índice no email para buscas rápidas

**Uso:**

- Autenticação e autorização
- Perfil do usuário
- Base para todas as outras operações

**Controle de Acesso:**

- Um usuário é considerado OWNER de uma conta quando ele é referenciado como `ownerId` na tabela `accounts`
- Um usuário é considerado USER de uma conta quando ele tem uma solicitação APPROVED na tabela `accessRequests`
- O mesmo usuário pode ser OWNER de algumas contas e USER de outras simultaneamente
- As permissões são verificadas em tempo de execução baseadas nas relações entre as entidades

### Accounts

Representa as contas/assinaturas que podem ser compartilhadas.

**Campos:**

- `id`: CUID único para identificação
- `serviceName`: Nome do serviço (ex: Netflix, Spotify)
- `ownerId`: ID do usuário dono da conta
- `startDate`: Data de início da assinatura
- `expirationDate`: Data de expiração da assinatura
- `status`: Status da conta (ACTIVE, INACTIVE, EXPIRED)
- `maxUsers`: Número máximo de usuários permitidos
- `price`: Preço total da assinatura
- `createdAt`: Data de criação do registro
- `updatedAt`: Data da última atualização

**Índices:**

- `ownerIdx`: Índice no dono para listagem rápida de contas por dono
- `statusIdx`: Índice no status para filtros
- `expirationIdx`: Índice na data de expiração para notificações

**Uso:**

- Gerenciamento de assinaturas compartilhadas
- Controle de limites de usuários
- Base para solicitações de acesso

### AccessRequests

Gerencia as solicitações de acesso às contas compartilhadas.

**Campos:**

- `id`: CUID único para identificação
- `accountId`: ID da conta solicitada
- `requesterId`: ID do usuário solicitante
- `status`: Status da solicitação (PENDING, APPROVED, REJECTED, EXPIRED)
- `requestDate`: Data da solicitação
- `approvalDate`: Data da aprovação (se aprovada)
- `expirationDate`: Data de expiração do acesso
- `createdAt`: Data de criação do registro
- `updatedAt`: Data da última atualização

**Índices:**

- `accountRequesterIdx`: Índice composto para verificação de solicitações duplicadas
- `statusIdx`: Índice no status para filtros
- `expirationIdx`: Índice na data de expiração para renovações

**Uso:**

- Controle de solicitações de acesso
- Base para transações financeiras
- Gestão de renovações de acesso

### Transactions

Registra todas as transações financeiras relacionadas aos compartilhamentos.

**Campos:**

- `id`: CUID único para identificação
- `requestId`: ID da solicitação de acesso relacionada
- `amount`: Valor da transação
- `status`: Status do pagamento (PENDING, COMPLETED, FAILED, REFUNDED)
- `transactionDate`: Data da transação
- `paymentMethod`: Método de pagamento utilizado
- `createdAt`: Data de criação do registro
- `updatedAt`: Data da última atualização

**Índices:**

- `requestIdx`: Índice na solicitação para rastreamento
- `statusIdx`: Índice no status para filtros
- `dateIdx`: Índice na data para relatórios

**Uso:**

- Registro de pagamentos
- Controle financeiro
- Relatórios e análises

### History

Registra todas as ações importantes no sistema para auditoria.

**Campos:**

- `id`: CUID único para identificação
- `entityType`: Tipo da entidade relacionada (USER, ACCOUNT, ACCESS_REQUEST, TRANSACTION)
- `entityId`: ID da entidade relacionada
- `action`: Ação realizada
- `metadata`: Dados adicionais em JSON
- `userId`: ID do usuário que realizou a ação
- `createdAt`: Data da ação

**Índices:**

- `entityIdx`: Índice composto para busca por entidade
- `userIdx`: Índice no usuário para auditoria
- `dateIdx`: Índice na data para relatórios

**Uso:**

- Auditoria do sistema
- Rastreamento de mudanças
- Relatórios de atividade

## Fluxos de Negócio

### 1. Compartilhamento de Conta

1. Qualquer usuário pode criar uma Account, tornando-se automaticamente seu OWNER
2. Define preço e número máximo de usuários
3. Outros usuários podem fazer AccessRequests para esta conta
4. O OWNER (verificado pela relação `ownerId`) aprova/rejeita solicitações
5. Após aprovação, Transaction é gerada
6. Após pagamento confirmado, acesso é liberado

### 2. Renovação de Acesso

1. Sistema identifica AccessRequests próximas da expiração
2. Notifica usuários sobre necessidade de renovação
3. Usuário confirma interesse em renovar
4. Nova Transaction é gerada
5. Após pagamento, expirationDate é atualizado

### 3. Controle de Acesso

1. Sistema monitora número de usuários ativos por Account
2. Impede novas aprovações quando limite é atingido
3. Monitora status de pagamento e expiração
4. Revoga acesso automaticamente em caso de:
   - Falta de pagamento
   - Expiração do período
   - Cancelamento pelo OWNER (verificado pela relação `ownerId`)

### 4. Auditoria e Segurança

1. Todas as ações importantes são registradas na History
2. Mudanças de status são rastreadas
3. Transações financeiras são documentadas
4. Permissões são verificadas em tempo real através das relações:
   - OWNER: verificado pelo campo `ownerId` em `accounts`
   - USER: verificado por `accessRequests` com status APPROVED
