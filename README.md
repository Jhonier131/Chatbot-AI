# 🤖 Chatbot-AI

Un chatbot de e-commerce impulsado por IA que utiliza OpenAI Function Calling para buscar productos en un catálogo CSV y realizar conversiones de divisas en tiempo real.

---

## 📁 Estructura del Proyecto

```
Chatbot-AI/
├── wizybot-api/          # Backend — NestJS + OpenAI
├── wizybot-frontend/     # Frontend — React + Vite
├── compose.yml           # Docker Compose (despliegue completo)
└── .env.ejemplo          # Variables de entorno de referencia
```

---

## ⚙️ Variables de Entorno

Antes de iniciar cualquier servicio, configura las variables de entorno necesarias.

### Backend (`wizybot-api/.env`)

Crea el archivo `wizybot-api/.env` basándote en `.env.ejemplo`:

```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPEN_EXCHANGE_APP_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

| Variable               | Descripción                                                                 | Obligatoria |
|------------------------|-----------------------------------------------------------------------------|:-----------:|
| `OPENAI_API_KEY`       | API Key de OpenAI ([obtener aquí](https://platform.openai.com/api-keys))    | ✅           |
| `OPEN_EXCHANGE_APP_ID` | App ID de Open Exchange Rates ([obtener aquí](https://openexchangerates.org/account/app-ids)) | ✅ |

### Frontend (`wizybot-frontend/.env.local`)

Crea el archivo `wizybot-frontend/.env.local` para desarrollo local:

```env
VITE_API_URL=http://localhost:3100
```

| Variable        | Descripción                                      | Por defecto              |
|-----------------|--------------------------------------------------|--------------------------|
| `VITE_API_URL`  | URL base del backend (sin barra al final)        | `http://localhost:3100`  |

> **Nota:** Para producción, usa `wizybot-frontend/.env.production` con la URL del servidor real.

---

## 🚀 Inicio Rápido — Desarrollo Local

### Requisitos Previos

- [Node.js](https://nodejs.org/) v20 o superior
- npm v10 o superior
- Claves de API configuradas (ver sección anterior)

### 1. Clonar el repositorio

```bash
git clone https://github.com/Jhonier131/Chatbot-AI.git
cd Chatbot-AI
```

### 2. Configurar el Backend

```bash
cd wizybot-api

# Instalar dependencias
npm install

# Crear archivo de entorno
cp ../.env.ejemplo .env
# ✏️ Edita .env y coloca tus claves reales

# Iniciar en modo desarrollo (con hot-reload)
npm run start:dev
```

El backend estará disponible en: **http://localhost:3100**  
Documentación Swagger: **http://localhost:3100/api**

### 3. Configurar el Frontend

Abre una nueva terminal:

```bash
cd wizybot-frontend

# Instalar dependencias
npm install

# Crear archivo de entorno local
echo "VITE_API_URL=http://localhost:3100" > .env.local

# Iniciar en modo desarrollo
npm run dev
```

El frontend estará disponible en: **http://localhost:5173**

---

## 🐳 Despliegue con Docker

### Requisitos

- [Docker](https://docs.docker.com/get-docker/) y [Docker Compose](https://docs.docker.com/compose/install/)
- Archivo `.env` en la raíz del proyecto con las variables del backend

### Pasos

```bash
# 1. Crea el archivo de entorno en la raíz
cp .env.ejemplo .env
# ✏️ Edita .env con tus claves reales

# 2. Construir y levantar todos los servicios
docker compose up --build

# Para ejecutar en segundo plano
docker compose up --build -d
```

| Servicio   | Puerto local | URL                   |
|------------|:------------:|-----------------------|
| Backend    | 3100         | http://localhost:3100 |
| Frontend   | 3010         | http://localhost:3010 |

### Comandos útiles de Docker

```bash
# Ver logs en tiempo real
docker compose logs -f

# Detener los servicios
docker compose down

# Reconstruir solo el backend
docker compose up --build backend
```

---

## 📜 Scripts Disponibles

### Backend (`wizybot-api/`)

| Comando               | Descripción                              |
|-----------------------|------------------------------------------|
| `npm run start`       | Inicia la app en modo producción         |
| `npm run start:dev`   | Inicia con hot-reload (desarrollo)       |
| `npm run start:debug` | Inicia en modo debug con hot-reload      |
| `npm run build`       | Compila TypeScript a JavaScript (`dist/`)|
| `npm run test`        | Ejecuta las pruebas unitarias            |
| `npm run test:e2e`    | Ejecuta las pruebas end-to-end           |

### Frontend (`wizybot-frontend/`)

| Comando          | Descripción                                    |
|------------------|------------------------------------------------|
| `npm run dev`    | Inicia el servidor de desarrollo con HMR       |
| `npm run build`  | Genera el bundle de producción en `dist/`      |

---

## 🛠️ Stack Tecnológico

### Backend
- **[NestJS](https://nestjs.com/)** — Framework Node.js escalable y modular
- **[OpenAI SDK](https://github.com/openai/openai-node)** — Function Calling para herramientas de IA
- **[Swagger / OpenAPI](https://swagger.io/)** — Documentación automática de la API
- **[csv-parser](https://www.npmjs.com/package/csv-parser)** — Lectura del catálogo de productos
- **TypeScript** — Tipado estático

### Frontend
- **[React 19](https://react.dev/)** — Interfaz de usuario
- **[Vite](https://vitejs.dev/)** — Bundler y servidor de desarrollo ultrarrápido
- **[react-markdown](https://github.com/remarkjs/react-markdown)** — Renderizado de respuestas en Markdown
- **[Lucide React](https://lucide.dev/)** — Iconografía

---

## 🤝 Contribuir

1. Haz un fork del repositorio
2. Crea tu rama de feature: `git checkout -b feature/nueva-funcionalidad`
3. Realiza tus cambios y haz commit: `git commit -m 'feat: agregar nueva funcionalidad'`
4. Sube tu rama: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es de uso privado.