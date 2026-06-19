# Etapa 1: Construcción
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etapa 2: Producción
FROM node:20-alpine 
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
COPY products_list.csv ./

EXPOSE 3100
CMD ["node", "dist/main"]