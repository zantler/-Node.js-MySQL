# ---------- BUILDER ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Copiamos archivos de dependencias primero (para aprovechar cache)
COPY package*.json ./

# Instalamos TODAS las dependencias (incluye devDeps para compilar TS)
RUN npm ci

# Copiamos el resto del proyecto
COPY tsconfig.json ./
COPY src ./src

# Compilamos TypeScript -> dist
RUN npm run build


# ---------- RUNNER ----------
FROM node:20-alpine AS runner
WORKDIR /app

# Solo dependencias necesarias para producción
COPY package*.json ./
RUN npm ci --omit=dev

# Copiamos el build compilado desde la imagen anterior
COPY --from=builder /app/dist ./dist

# Usuario no root (por seguridad)
RUN addgroup -S app && adduser -S app -G app
USER app

# Exponemos el puerto de la app
EXPOSE 3000

# Comando por defecto
CMD ["node", "dist/app.js"]
