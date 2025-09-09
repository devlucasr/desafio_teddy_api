# ---------- deps: instala TODAS as deps (inclui dev) ----------
    FROM node:22-alpine AS deps
    WORKDIR /app
    COPY package.json package-lock.json* ./
    RUN npm ci
    
    # ---------- build: compila o Nest e gera Prisma Client ----------
    FROM node:22-alpine AS build
    WORKDIR /app
    COPY --from=deps /app/node_modules ./node_modules
    COPY . .
    # Gera o Prisma Client (necessário pro build e runtime)
    RUN npx prisma generate
    # Compila para dist/
    RUN npm run build
    
    # ---------- runner: imagem final de produção ----------
    FROM node:22-alpine AS runner
    WORKDIR /app
    ENV NODE_ENV=production
    # libs necessárias para prisma em alpine (linux-musl)
    RUN apk add --no-cache openssl libstdc++
    
    # Copia somente o necessário
    COPY --from=deps /app/node_modules ./node_modules
    COPY --from=build /app/dist ./dist
    COPY prisma ./prisma
    COPY package.json ./
    
    EXPOSE 3000
    # Garanta que sua app escuta em 0.0.0.0 no main.ts
    # Aplica migrações e inicia a API
    CMD ["sh", "-lc", "npx prisma migrate deploy && node dist/main.js"]
    