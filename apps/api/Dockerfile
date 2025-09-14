# ---- Base ----
FROM node:22-alpine AS base
WORKDIR /app

# Instala pnpm globalmente
RUN npm install -g pnpm

# Copia manifestos e instala dependências de produção
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# ---- Desenvolvimento ----
FROM node:22-alpine AS dev
WORKDIR /app

# Instala pnpm
RUN npm install -g pnpm

# Copia manifestos e instala tudo (dev + prod)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copia código
COPY . .

# Hot reload (ex: tsx ou nodemon)
CMD ["pnpm", "dev"]

# ---- Testes ----
FROM dev AS test
CMD ["pnpm", "test"]

# ---- Produção ----
FROM base AS prod
WORKDIR /app

# Copia código
COPY . .

# Roda em modo produção
CMD ["pnpm", "start"]
