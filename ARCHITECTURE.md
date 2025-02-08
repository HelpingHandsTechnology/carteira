# Carteira - Arquitetura do Sistema

## Visão Geral

Este documento descreve a arquitetura do sistema Carteira, um sistema moderno de gestão financeira construído com tecnologias de ponta e foco em type-safety e performance.

## Stack Tecnológica

### Frontend
- **Next.js**: Framework React para renderização híbrida (SSR/CSR)
  - Páginas e componentes fortemente tipados
  - Roteamento baseado em sistema de arquivos
  - Componentes React reutilizáveis

### Backend (API)
- **Elysia**: Framework HTTP minimalista e tipado
  - Prefix `/api` para todas as rotas
  - Sistema de plugins para modularização
  - Tratamento de erros centralizado
  - Validação de tipos em tempo de execução
- **Bun**: Runtime JavaScript/TypeScript de alta performance
  - Execução nativa de TypeScript
  - Hot reload para desenvolvimento
  - Gerenciamento de pacotes integrado

### Persistência
- **PostgreSQL**: Sistema de banco de dados relacional
- **Drizzle ORM**: ORM TypeScript-first
  - Schemas tipados
  - Migrations automatizadas
  - Queries type-safe

## Fluxo de Dados

1. Cliente faz requisição HTTP para `/api/*`
2. Elysia roteia para o handler apropriado
3. Validação de entrada via tipos Elysia
4. Service executa lógica de negócio
5. Drizzle ORM interage com PostgreSQL
6. Resposta é validada e retornada tipada

## Decisões Arquiteturais

### Elysia + Bun
- Type-safety end-to-end com TypeScript
- Performance superior com Bun runtime
- API declarativa e expressiva
- Excelente DX com hot reload
- Sistema de plugins modular

### Drizzle ORM
- Type-safety nativa com TypeScript
- Queries SQL type-safe
- Migrations declarativas
- Performance otimizada
- Sem ORM overhead tradicional

### PostgreSQL
- Confiabilidade e durabilidade
- Transações ACID
- Queries complexas e joins
- Índices avançados
- Extensibilidade

## Segurança

### Proteção de Dados
- Validação de entrada em todas as rotas
- Prepared statements via Drizzle ORM
- Sanitização de dados automática
- Rate limiting (TODO)

### Monitoramento
- Logs estruturados de erros
- Stack traces em ambiente de desenvolvimento
- Métricas de performance (TODO)

## Próximos Passos

1. Autenticação e Autorização
   - Implementar JWT
   - Middleware de autenticação
   - Roles e permissões

2. Performance
   - Implementar caching
   - Otimizar queries
   - Adicionar índices

3. Observabilidade
   - Logging estruturado
   - Métricas de performance
   - Rastreamento de erros

4. Testes
   - Testes unitários
   - Testes de integração
   - Testes E2E 