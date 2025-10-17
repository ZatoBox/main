# Usa la imagen Node.js 20 alpine
FROM node:20-alpine AS base

# Instala dependencias solo cuando sea necesario
FROM base AS deps
WORKDIR /app

# Instala pnpm
RUN npm install -g pnpm@10.18.3

# Copia archivos de paquete
COPY package.json pnpm-lock.yaml ./

# Instala las dependencias
RUN pnpm install --frozen-lockfile

# Reconstruye el código fuente solo cuando sea necesario
FROM base AS builder
WORKDIR /app

# Instala pnpm en la etapa builder
RUN npm install -g pnpm@10.18.3
# Copia dependencias desde la etapa deps
COPY --from=deps /app/node_modules ./node_modules

# Copia toda la estructura del proyecto
COPY .env .env

COPY . .

# Compila la aplicación
RUN pnpm build

# Imagen de producción, copia todos los archivos y ejecuta next
FROM base AS runner
WORKDIR /app

# Instala pnpm en la etapa runner
RUN npm install -g pnpm@10.18.3

# Copia todos los archivos compilados y necesarios desde builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/.env ./.env

# Instala solo las dependencias de producción
RUN pnpm install --prod --frozen-lockfile

EXPOSE 3000

CMD ["pnpm", "start"]
