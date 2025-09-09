# 🚀 Encurtador de URL API

API REST para encurtamento de URLs com autenticação de usuários e gestão de links.  
Permite criar links curtos, autenticar usuários, gerenciar os links cadastrados, contabilizar cliques e realizar operações de atualização e exclusão lógica.

---

## 🌐 Ambiente em Produção (Deploy)

- **Base URL:** https://desafioteddyapi-production.up.railway.app
- **Swagger UI:** https://desafioteddyapi-production.up.railway.app/docs
- **OpenAPI JSON:** https://desafioteddyapi-production.up.railway.app/openapi.json

---

## 🛠️ Stack
- NestJS (Node.js 22 LTS)
- Prisma + PostgreSQL
- Passport JWT
- Redis (cache de URLs anônimas)
- Docker Compose
- Swagger / OpenAPI

---

## 📦 Pré-requisitos
- Docker + Docker Compose
- (opcional) Node.js 20.x LTS se quiser rodar localmente
- (para rodar localmente) PostgreSQL e Redis instalados e em execução

---

## ⚙️ Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes chaves:

| Variável                | Descrição                                                                 | Exemplo                                      |
|--------------------------|---------------------------------------------------------------------------|----------------------------------------------|
| `DATABASE_URL`           | URL de conexão com o banco PostgreSQL                                     | `postgresql://postgres:postgres@db:5432/desafio_teddy` |
| `JWT_SECRET`             | Segredo usado para assinar os tokens JWT                                 | `super-secret-key`                           |
| `APP_ORIGIN`             | Origem/base URL usada para compor os links encurtados                    | `http://localhost:3000`                      |
| `REDIS_URL`              | Conexão do Redis (armazenamento de URLs anônimas com TTL)                | `redis://redis:6379`                         |
| `ANON_URL_TTL_SECONDS`   | Tempo de vida (em segundos) de uma URL anônima no Redis                  | `86400` (24h)                                |
| `PORT`                   | Porta em que a API vai rodar                                             | `3000`                                       |
| `POSTGRES_USER`          | Usuário do banco PostgreSQL (usado no container)                         | `postgres`                                   |
| `POSTGRES_DB`            | Nome do banco de dados                                                   | `desafio_teddy`                              |
| `POSTGRES_PASSWORD`      | Senha do usuário do banco PostgreSQL                                     | `postgres`                                   |

### Exemplo `.env`

```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/desafio_teddy
JWT_SECRET=super-secret-key
APP_ORIGIN=http://localhost:3000
REDIS_URL=redis://redis:6379
ANON_URL_TTL_SECONDS=86400
PORT=3000
POSTGRES_USER=postgres
POSTGRES_DB=desafio_teddy
POSTGRES_PASSWORD=postgres
```

---

## ▶️ Como rodar

### Usando Docker (recomendado)
Na raiz do projeto:
```bash
docker compose up -d --build
```

Acesse em: [http://localhost:3000](http://localhost:3000)

---

### Localmente (sem Docker)
⚠️ Necessário ter **PostgreSQL** e **Redis** instalados e rodando.

1. Instale as dependências:
```bash
npm install
```

2. Configure o arquivo `.env` com URLs de conexão locais, por exemplo:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/desafio_teddy
REDIS_URL=redis://localhost:6379
JWT_SECRET=super-secret-key
APP_ORIGIN=http://localhost:3000
PORT=3000
```

3. Rode as migrações do Prisma:
```bash
npx prisma migrate dev
```

4. Inicie a aplicação em modo desenvolvimento:
```bash
npm run start:dev
```

A API estará disponível em [http://localhost:3000](http://localhost:3000)

---

## 🧪 Testes Unitários

O projeto possui **testes unitários implementados com Jest** cobrindo os principais módulos da aplicação:

- **Auth**
  - `AuthService`: valida login com bcrypt e geração de JWT.
  - `AuthController`: garante delegação correta para o service.
  - `JwtAuthGuard`: simula contexto de requisição e valida autenticação.

- **Users**
  - `UsersService`: garante criação de usuários.
  - `UsersController`: garante que o endpoint delega corretamente para o service.

- **URLs**
  - `UrlsService`: cobre criação de URLs encurtadas e verificação de unicidade.
  - `UrlsController`: cobre delegação do controller para o service.

Para rodar os testes localmente:

```bash
npm run test
```

---

## 📖 Documentação da API

- Ambiente de **produção**:  
  - Swagger UI → https://desafioteddyapi-production.up.railway.app/docs  
  - OpenAPI JSON → https://desafioteddyapi-production.up.railway.app/openapi.json
- Ambiente **local**:  
  - Swagger UI → http://localhost:3000/docs  
  - OpenAPI JSON → http://localhost:3000/openapi.json

---

## 📜 Changelog
Veja o histórico detalhado em [`CHANGELOG.md`](CHANGELOG.md).

---

## 🚀 Possíveis Melhorias para Escalabilidade Horizontal

Para suportar um aumento de usuários e acessos, algumas melhorias podem ser feitas:

- **Banco de dados**
  - Criar réplicas de leitura (read replicas) e usar *pooling* de conexões.
  - Indexar campos mais consultados e revisar planos de execução.
  - Aplicar *partitioning* em tabelas de métricas/cliques se necessário.

- **Cache**
  - Redis com *Cluster Mode* ou *sharding* para distribuir carga.
  - Políticas de invalidação/expiração bem definidas para URLs.
  - Usar *rate limiting* e *circuit breaker* na borda.

- **Aplicação**
  - Escalar horizontalmente múltiplas instâncias atrás de um balanceador.
  - *Stateless*: sessões e rate limit em Redis (ou outro store) para não depender de estado local.
  - Observabilidade: métricas (Prometheus/Grafana), logs centralizados e *tracing* distribuído.

- **Desafios principais**
  - Contagem de cliques **consistente** em múltiplas instâncias (usar incremento atômico no Redis/DB e workers de agregação).
  - Sincronização entre cache e banco (estratégias *write-through* / *cache-aside*).

---

## 📬 Postman Collection

Para facilitar os testes da API, você pode importar a Collection do Postman pronta:
- Link para a Collection → https://l1nk.dev/9gAiN

---

## 🧑‍💻 Desenvolvedor
Lucas Ribeiro Fernandes
