# AGENTS.md - Ecommerce Products Service

## Visão Geral

Microserviço de gerenciamento de produtos do sistema ecommerce. Responsável por:
- CRUD de produtos
- Busca de produtos
- Gerenciamento de estoque

## Tecnologias

- Node.js 20 + TypeScript
- Express.js
- MongoDB + Mongoose
- Redis (cache)
- RabbitMQ (consumo de eventos)
- JWT (validação de autenticação)

## Estrutura Principal

```
src/
├── application/controllers/  # ProductController
├── domain/entities/          # Product entity
├── infrastructure/
│   ├── messaging/            # RabbitMQ connection
│   ├── persistence/          # MongoDB repositories
│   └── swagger/              # OpenAPI docs
└── presentation/
    ├── middleware/           # authMiddleware (JWT validation)
    └── routes/               # product.routes
```

## Endpoints Principais

- `GET /products` - Lista produtos (requer JWT)
- `GET /products/:id` - Detalhe produto (requer JWT)
- `POST /products` - Cria produto (requer JWT)
- `PUT /products/:id` - Atualiza produto (requer JWT)
- `DELETE /products/:id` - Remove produto (requer JWT)

## Autenticação

Este serviço **valida** tokens JWT emitidos pelo Auth Service.
- Usa `jwt.verify()` com `JWT_SECRET`
- Retorna 401 se token inválido/expirado
- Adiciona `req.user` com `{ userId, email }`

## Eventos Consumidos

| Evento | Exchange | Ação |
|--------|----------|------|
| `user.created` | `user.events` | Log do novo usuário |

## Validação de Autenticação

```typescript
// Middleware em src/presentation/middleware/auth.middleware.ts
// Valida Bearer token e adiciona req.user
```

## Variáveis de Ambiente Obrigatórias

```env
JWT_SECRET=deve ser igual ao Auth Service
MONGODB_URI=mongodb://...
REDIS_URL=redis://...
RABBITMQ_URI=amqp://...
```

## Padrões de Código

- Usar Biome para lint/format
- Todos os endpoints requerem JWT (exceto `/health`)
- Erros retornam `{ error: "mensagem" }`
- UUIDs para IDs

## Build

```bash
npm run build
```

## Docker

```bash
docker build -t ecommerce-products .
docker run -p 3002:3002 ecommerce-products
```
