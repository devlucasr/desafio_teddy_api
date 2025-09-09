FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build
RUN test -f dist/main.js -o -f dist/src/main.js || (echo "ERRO: artefato de build não encontrado"; ls -la dist; ls -la dist/src || true; exit 1)

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache openssl libstdc++
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY prisma ./prisma
COPY package.json ./
EXPOSE 3000
CMD ["sh", "-lc", "npx prisma migrate deploy && node $( [ -f dist/main.js ] && echo dist/main.js || echo dist/src/main.js )"]
