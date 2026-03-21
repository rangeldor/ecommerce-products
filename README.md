# Ecommerce Products Service

Microserviço de gerenciamento de produtos do sistema ecommerce.

## Tecnologias

- Node.js 20
- Express.js
- MongoDB (Mongoose)
- Redis
- RabbitMQ
- JWT Authentication
- Swagger/OpenAPI

## Pré-requisitos

- Node.js 20+
- Docker e Docker Compose
- Auth Service (para autenticação JWT)

## Variáveis de Ambiente

```env
PORT=3002
MONGODB_URI=mongodb://localhost:27017/products_db
REDIS_URL=redis://localhost:6379
RABBITMQ_URI=amqp://guest:guest@localhost:5672
JWT_SECRET=sua-chave-secreta-aqui
ALLOWED_ORIGINS=http://localhost:3005,http://localhost:80
NODE_ENV=development
RUN_SEEDS=true
```

## Instalação Local

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev

# Build para produção
npm run build
```

## Rodar com Docker

```bash
docker-compose up -d
```

O serviço estará disponível em `http://localhost:3002`

## Autenticação

Todos os endpoints (exceto `/health`) requerem JWT token no header:

```
Authorization: Bearer <token>
```

Para obter um token, use o Auth Service.

## Endpoints

### Produtos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/products` | Listar todos os produtos |
| GET | `/products/:id` | Obter produto por ID |
| POST | `/products` | Criar novo produto |
| PUT | `/products/:id` | Atualizar produto |
| DELETE | `/products/:id` | Deletar produto |

### Documentação

| Endpoint | Descrição |
|----------|-----------|
| `/api-docs` | Swagger UI |
| `/api-docs/spec.json` | OpenAPI spec |

### Saúde

| Endpoint | Descrição |
|----------|-----------|
| `/health` | Health check |

## Eventos Consumidos

Este serviço consome eventos do RabbitMQ:

| Evento | Exchange | Descrição |
|--------|----------|-----------|
| `user.created` | `user.events` | Recebido quando novo usuário é registrado |

## Estrutura do Projeto

```
src/
├── application/
│   ├── controllers/        # Lógica de controllers
│   ├── events/             # Consumers de eventos
│   └── repositories/       # Repositórios de aplicação
├── domain/
│   ├── entities/           # Entidades de domínio
│   └── services/           # Serviços de domínio
├── infrastructure/
│   ├── cache/              # Redis
│   ├── messaging/          # RabbitMQ
│   ├── persistence/        # MongoDB
│   ├── seeds/              # Dados iniciais
│   └── swagger/            # Documentação API
├── presentation/
│   ├── controllers/        # Controladores HTTP
│   ├── middleware/         # Middlewares (auth, etc)
│   └── routes/            # Rotas da API
├── app.ts                  # Configuração do Express
└── main.ts                 # Entry point
```

## API Examples

### Listar Produtos
```bash
curl http://localhost:3002/products \
  -H "Authorization: Bearer <token>"
```

### Criar Produto
```bash
curl -X POST http://localhost:3002/products \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Notebook","description":"Gaming laptop","price":5000,"stock":10,"categoryId":"cat-1"}'
```

### Obter Produto
```bash
curl http://localhost:3002/products/{id} \
  -H "Authorization: Bearer <token>"
```

## Licença

MIT
