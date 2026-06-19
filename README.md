# 🤖 Chatbot-AI

An AI-powered e-commerce chatbot utilizing OpenAI Function Calling to search products from a CSV catalog and perform real-time currency conversions.

### 🌐 Live Demo
The application is running and accessible at: **[http://16.59.127.29:3010](http://16.59.127.29:3010)**

### 🚀 CI/CD & Deployment
This repository is configured with **Automated Deployment (CI/CD)**:
* **CI/CD Pipeline**: Configured with GitHub Actions (located in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)).
* **Hosting**: Deployed automatically to an **AWS EC2 Instance** upon pushing to the `main` branch.
* **Orchestration**: Managed via **Docker & Docker Compose** for zero-downtime, containerized execution.

---

## 📁 Project Structure

```
Chatbot-AI/
├── wizybot-api/          # Backend — NestJS + OpenAI
├── wizybot-frontend/     # Frontend — React + Vite
├── compose.yml           # Docker Compose (full deployment)
└── .env.ejemplo          # Reference environment variables
```

---

## ⚙️ Environment Variables

Before starting any service, configure the required environment variables.

### Backend (`wizybot-api/.env`)

Create the `wizybot-api/.env` file based on `.env.ejemplo`:

```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPEN_EXCHANGE_APP_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

| Variable               | Description                                                                 | Required |
|------------------------|-----------------------------------------------------------------------------|:--------:|
| `OPENAI_API_KEY`       | OpenAI API Key ([get here](https://platform.openai.com/api-keys))           |    ✅    |
| `OPEN_EXCHANGE_APP_ID` | Open Exchange Rates App ID ([get here](https://openexchangerates.org/account/app-ids)) |    ✅    |

### Frontend (`wizybot-frontend/.env.local`)

Create the `wizybot-frontend/.env.local` file for local development:

```env
VITE_API_URL=http://localhost:3100
```

| Variable        | Description                                      | Default                  |
|-----------------|--------------------------------------------------|--------------------------|
| `VITE_API_URL`  | Backend base URL (no trailing slash)             | `http://localhost:3100`  |

> **Note:** For production, use `wizybot-frontend/.env.production` with the real server URL.

---

## 🚀 Quick Start — Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) v20 or higher
- npm v10 or higher
- Configured API keys (see previous section)

### 1. Clone the Repository

```bash
git clone https://github.com/Jhonier131/Chatbot-AI.git
cd Chatbot-AI
```

### 2. Set Up the Backend

```bash
cd wizybot-api

# Install dependencies
npm install

# Create environment file
cp ../.env.ejemplo .env
# ✏️ Edit .env and enter your real keys

# Start in development mode (with hot-reload)
npm run start:dev
```

The backend will be available at: **http://localhost:3100**  
Swagger Documentation: **http://localhost:3100/api**

### 3. Set Up the Frontend

Open a new terminal:

```bash
cd wizybot-frontend

# Install dependencies
npm install

# Create local environment file
echo "VITE_API_URL=http://localhost:3100" > .env.local

# Start in development mode
npm run dev
```

The frontend will be available at: **http://localhost:5173**

---

## 🐳 Docker Deployment

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- A `.env` file in the root directory with backend variables

### Steps

```bash
# 1. Create the environment file in the root
cp .env.ejemplo .env
# ✏️ Edit .env with your real keys

# 2. Build and start all services
docker compose up --build

# To run in the background
docker compose up --build -d
```

| Service    | Local Port | URL                   |
|------------|:----------:|-----------------------|
| Backend    | 3100       | http://localhost:3100 |
| Frontend   | 3010       | http://localhost:3010 |

### Useful Docker Commands

```bash
# View real-time logs
docker compose logs -f

# Stop services
docker compose down

# Rebuild only the backend
docker compose up --build backend
```

---

## 📜 Available Scripts

### Backend (`wizybot-api/`)

| Command               | Description                                |
|-----------------------|--------------------------------------------|
| `npm run start`       | Starts the app in production mode          |
| `npm run start:dev`   | Starts with hot-reload (development)       |
| `npm run start:debug` | Starts in debug mode with hot-reload       |
| `npm run build`       | Compiles TypeScript to JavaScript (`dist/`)|
| `npm run test`        | Runs unit tests                            |
| `npm run test:e2e`    | Runs end-to-end tests                      |

### Frontend (`wizybot-frontend/`)

| Command          | Description                                    |
|------------------|------------------------------------------------|
| `npm run dev`    | Starts the development server with HMR         |
| `npm run build`  | Generates the production bundle in `dist/`      |

---

## 🛠️ Tech Stack

### Backend
- **[NestJS](https://nestjs.com/)** — Scalable and modular Node.js framework
- **[OpenAI SDK](https://github.com/openai/openai-node)** — Function Calling for AI tools
- **[Swagger / OpenAPI](https://swagger.io/)** — Automatic API documentation
- **[csv-parser](https://www.npmjs.com/package/csv-parser)** — Product catalog parser
- **TypeScript** — Static typing

### Frontend
- **[React 19](https://react.dev/)** — User interface
- **[Vite](https://vitejs.dev/)** — Fast build tool and dev server
- **[react-markdown](https://github.com/remarkjs/react-markdown)** — Markdown rendering for responses
- **[Lucide React](https://lucide.dev/)** — Iconography

---

## 📄 License

This project is for private use only.