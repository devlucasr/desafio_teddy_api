# 📜 Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato segue as recomendações do [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).  
Este projeto adota versionamento [SemVer](https://semver.org/lang/pt-BR/).

---

## [0.1.0] - 2025-09-07
### Adicionado
- Estrutura inicial do projeto com **NestJS** + **Prisma** + **PostgreSQL** + **Redis**.
- Módulo **Users**: cadastro de usuários (`POST /users/register`).
- Módulo **Auth**: login com JWT (`POST /auth/login`).
- Módulo **URLs**:
  - Criar URL encurtada (`POST /urls`) com/sem autenticação.
  - Listar URLs do usuário autenticado (`GET /urls`).
  - Buscar uma URL específica (`GET /urls/:id`).
  - Atualizar destino da URL (`PATCH /urls/:id`).
  - Soft delete de URL (`DELETE /urls/:id`).
- Redirecionamento público (`GET /:code`) com contabilização de cliques.
- Contabilização de acessos apenas para URLs autenticadas.
- Cache de URLs anônimas em **Redis** com TTL configurável.
- Documentação com **Swagger/OpenAPI** em `/docs` e `/openapi.json`.
- Estrutura modular separada em `domain`, `application`, `infrastructure`, `presentation`.
- Configuração de variáveis de ambiente no `.env`.
- Lint configurado com **ESLint** e **Prettier**.
- Testes unitários configurados com **Jest**.