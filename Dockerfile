# ---------- deps: instala todas deps (inclui dev) ----------
    FROM node:22-alpine AS deps
    WORKDIR /app
    # 1) copie package.json + lock
    COPY package.json package-lock.json* ./
    # 2) copie o schema PRISMA antes do npm ci (por causa do postinstall)
    COPY prisma ./prisma
    # 3) agora sim: instala deps (postinstall -> prisma generate vai funcionar)
    RUN npm ci
    
    # ---------- build: gera client e compila NestJS ----------
    FROM node:22-alpine AS build
    WORKDIR /app
    COPY --from=deps /app/node_modules ./node_modules
    COPY . .
    # garantir client prisma (idempotente)
    RUN npx prisma generate
    # compila para dist/
    RUN npm run build
    
    # ---------- runner: imagem final ----------
    FROM node:22-alpine AS runner
    WORKDIR /app
    ENV NODE_ENV=production
    # libs necessárias para @prisma/client no alpine
    RUN apk add --no-cache openssl libstdc++
    
    # copie apenas o necessário
    COPY --from=deps /app/node_modules ./node_modules
    COPY --from=build /app/dist ./dist
    COPY prisma ./prisma
    COPY package.json ./
    
    EXPOSE 3000
    # aplique migrações e inicie
    CMD ["sh", "-lc", "npx prisma migrate deploy && node dist/main.js"]
    