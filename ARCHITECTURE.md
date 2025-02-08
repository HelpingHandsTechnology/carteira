# Carteira - System Architecture

## Overview

This document describes the architecture of the Carteira system, a modern financial management system built with cutting-edge technologies focusing on type-safety and performance.

## Technology Stack

### Frontend
- **Next.js**: React framework for hybrid rendering (SSR/CSR)
  - Strongly typed pages and components
  - File-based routing
  - Reusable React components

### Backend (API)
- **Elysia**: Minimalist and typed HTTP framework
  - `/api` prefix for all routes
  - Plugin system for modularization
  - Centralized error handling
  - Runtime type validation
- **Bun**: High-performance JavaScript/TypeScript runtime
  - Native TypeScript execution
  - Hot reload for development
  - Integrated package management
- **Signale**: Advanced logging system
  - Colored and formatted logs
  - Automatic timestamps
  - Custom log types
  - Performance metrics

### Persistence
- **PostgreSQL**: Relational database system
- **Drizzle ORM**: TypeScript-first ORM
  - Typed schemas
  - Automated migrations
  - Type-safe queries

## Project Structure

```
src/
├── app/           # Next.js Frontend
│   ├── components/  # Shared React components
│   └── pages/      # Application pages
├── lib/           # Utilities and configurations
│   ├── env.ts     # Environment configurations
│   ├── client.ts  # Typed API client
│   └── utils.ts   # Utility functions
├── server/        # Elysia Backend
│   ├── db/        # Database configuration and schemas
│   ├── routers/   # Modularized API routes
│   └── services/  # Business services
└── scripts/       # Automation scripts
```

## API Patterns

### Route Design
- RESTful routes with `/api` prefix
- Plural resources (e.g., `/api/posts`, `/api/users`)
- Standardized CRUD operations:
  - GET /{resources} - List
  - GET /{resources}/:id - Details
  - POST /{resources} - Create
  - PUT /{resources}/:id - Update
  - DELETE /{resources}/:id - Remove

### Validation and Types
- Validation schemas using Elysia's type system
- Shared types between frontend and backend via Eden Treaty
- Input validation on all routes
- Typed responses for type-safety

### Responses
- Consistent JSON format
```typescript
// Success
{
  data: T
}

// Error
{
  error: {
    message: string
  }
}
```
- Appropriate HTTP codes:
  - 200: Success
  - 201: Created
  - 400: Validation Error
  - 404: Not Found
  - 500: Internal Error

## Data Flow

1. Client makes HTTP request to `/api/*`
2. Logger records request details (method, path, user-agent)
3. Elysia routes to appropriate handler
4. Input validation via Elysia types
5. Service executes business logic
6. Drizzle ORM interacts with PostgreSQL
7. Logger records response with performance metrics
8. Response is validated and returned typed

## Architectural Decisions

### Elysia + Bun
- End-to-end type-safety with TypeScript
- Superior performance with Bun runtime
- Declarative API
- Excellent DX with hot reload
- Modular plugin system

### Drizzle ORM
- Native TypeScript type-safety
- Type-safe SQL queries
- Declarative migrations
- Optimized performance
- No traditional ORM overhead

### PostgreSQL
- Reliability and durability
- ACID transactions
- Complex queries and joins
- Advanced indexing
- Extensibility

### Signale Logger
- Visually organized and colored logs
- Integrated performance metrics
- Custom log types
- Automatic timestamps
- Easy problem identification

## Security

### Data Protection
- Input validation on all routes
- Prepared statements via Drizzle ORM
- Automatic data sanitization
- Rate limiting (TODO)

### Monitoring
- Structured logs via Signale
- Per-request performance metrics
- Stack traces in development environment
- Error tracking with context

## Next Steps

1. Authentication and Authorization
   - Implement JWT
   - Authentication middleware
   - Roles and permissions

2. Performance
   - Implement caching
   - Optimize queries
   - Add indexes

3. Observability
   - Expand structured logging
   - Performance metrics
   - Error tracking

4. Testing
   - Unit tests
   - Integration tests
   - E2E tests 