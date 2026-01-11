# Title Forge  
**AI‑powered title generation platform**  

![Title Forge Banner](./frontend/public/logo2.png)

[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js)](https://nodejs.org/) [![Express](https://img.shields.io/badge/Express-5.1-000000?logo=express)](https://expressjs.com/) [![React](https://img.shields.io/badge/React-19.1-61DAFB?logo=react)](https://reactjs.org/) [![Docker](https://img.shields.io/badge/Docker-✓-2496ED?logo=docker)](https://www.docker.com/) [![License](https://img.shields.io/badge/License-ISC-lightgrey)](./LICENSE)  

**Live demo:** https://title-forge.vercel.app | **Docs:** https://github.com/kaihere14/Title-Forge/wiki  

---  

## Overview  

Title Forge is a full‑stack application that generates high‑quality, SEO‑friendly titles for YouTube videos, blog posts, and other content using state‑of‑the‑art LLMs (Google Gemini, Perplexity AI) and custom heuristics.  

* **AI‑driven** – Leverages Google Generative AI and Perplexity AI to suggest titles that rank.  
* **Queue‑backed processing** – Heavy LLM calls are off‑loaded to a Redis‑backed BullMQ queue for reliability and scaling.  
* **Payments & subscriptions** – Integrated with Razorpay for paid plans and Resend for transactional emails.  
* **Secure & extensible** – JWT authentication, bcrypt password hashing, and a modular Express API.  

Target audience: content creators, SEO specialists, and developers who need an easy‑to‑integrate title‑generation service.  

Current version: **v1.0.0** (January 2026)  

---  

## Features  

| Feature | Description | Status |
|---------|-------------|--------|
| **AI title generation** | Calls Google Gemini & Perplexity AI to produce 5‑10 candidate titles. | ✅ Stable |
| **YouTube metadata fetch** | Retrieves video details (title, description, tags) via YouTube Data API. | ✅ Stable |
| **User management** | Sign‑up, login, password reset, JWT‑based auth. | ✅ Stable |
| **Payment integration** | Razorpay checkout, webhook verification, subscription handling. | ✅ Stable |
| **Email notifications** | Transactional emails (welcome, receipt) via Resend. | ✅ Stable |
| **Background processing** | BullMQ queue + Redis for async LLM calls and email sending. | ✅ Stable |
| **Rate limiting & usage analytics** | Basic per‑user request caps (future work). | 🟡 Beta |
| **Admin dashboard** | UI for managing users, plans, and queue health (planned). | ⚪ Planned |
| **Docker & Vercel deployment** | Ready‑to‑run containers and Vercel config for the frontend. | ✅ Stable |

---  

## Tech Stack  

| Layer | Technology | Reason |
|-------|------------|--------|
| **Backend** | Node.js 20, Express 5, TypeScript 5, Mongoose 8, BullMQ 5, ioredis 5 | Modern, type‑safe server with MongoDB and Redis support. |
| **AI Services** | `@google/genai`, `@perplexity-ai/perplexity_ai` | Access to Gemini and Perplexity LLMs. |
| **Payments** | Razorpay SDK | Popular payment gateway for Indian markets. |
| **Email** | Resend SDK | Simple transactional email service. |
| **Auth** | jsonwebtoken, bcrypt | JWT + salted password hashing. |
| **Frontend** | React 19, Vite 7, Tailwind 4, Framer Motion, React‑Router 7 | Fast, component‑driven UI with utility‑first styling. |
| **Containerisation** | Docker, Docker‑Compose (implicit) | Consistent dev & prod environments. |
| **CI/CD** | Vercel (frontend), custom Docker build (backend) | Zero‑config deployments. |

---  

## Architecture  

```
+-------------------+          +-------------------+          +-------------------+
|   Frontend (SPA)  |  HTTPS   |   API Gateway     |  HTTP    |   MongoDB Atlas   |
| React + Vite +    | <------> | Express (Node)    | <------> | (users, titles)  |
| TailwindCSS       |          |   /api/* routes   |          +-------------------+
+-------------------+          +-------------------+
                                   |
                                   |   Redis (Docker)
                                   v
                           +-------------------+
                           |  BullMQ Queues    |
                           |  (LLM calls, mail)|
                           +-------------------+
                                   |
                                   |   External APIs
                                   v
        +-------------------+   +-------------------+   +-------------------+
        | Google Gemini API |   | Perplexity AI API|   | YouTube Data API |
        +-------------------+   +-------------------+   +-------------------+
                                   |
                                   v
                           +-------------------+
                           | Razorpay / Resend |
                           +-------------------+
```

### Directory layout  

```
/
├─ backend/                     # Express API (TypeScript)
│  ├─ src/
│  │  ├─ controllers/          # Request handlers
│  │  ├─ db/                    # MongoDB connection (database.ts)
│  │  ├─ middlewares/          # Auth, error handling, etc.
│  │  ├─ models/               # Mongoose schemas (User, Title, Payment)
│  │  ├─ routes/               # Express routers (youtube, user, payment, nityasha, queue)
│  │  ├─ types/                # TypeScript interfaces & enums
│  │  └─ index.ts              # App bootstrap
│  ├─ Dockerfile               # Container image for the API
│  ├─ package.json
│  └─ tsconfig.json
├─ frontend/                    # React SPA (Vite)
│  ├─ src/
│  │  ├─ components/           # UI components
│  │  ├─ context/              # React context (auth, theme)
│  │  ├─ pages/                # Route pages (Home, Dashboard, Checkout)
│  │  └─ main.jsx
│  ├─ public/                  # Static assets (logo, favicon)
│  ├─ vite.config.js
│  ├─ tailwind.config.cjs
│  └─ package.json
├─ .gitignore
└─ README.md (this file)
```

---  

## Getting Started  

### Prerequisites  

| Tool | Minimum version |
|------|-----------------|
| Node.js | **20** (LTS) |
| npm | **10** |
| Docker (optional) | **24** |
| MongoDB Atlas account | – |
| Redis (Docker) | – |
| Razorpay account (for payments) | – |
| Google Cloud project with Gemini API enabled | – |
| Perplexity AI API key | – |
| Vercel account (optional, for frontend) | – |

### Backend Setup  

1. **Clone the repo**  

   ```bash
   git clone https://github.com/kaihere14/Title-Forge.git
   cd Title-Forge/backend
   ```

2. **Install dependencies**  

   ```bash
   npm ci
   ```

3. **Create a `.env` file** (see **Configuration** below).  

4. **Run locally (development mode)**  

   ```bash
   npm run dev
   # Server starts on http://localhost:3000
   ```

5. **Build for production**  

   ```bash
   npm run build
   npm start
   ```

6. **Docker (optional)**  

   ```bash
   docker build -t titleforge-backend .
   docker run -p 3000:3000 --env-file .env titleforge-backend
   ```

### Frontend Setup  

```bash
cd ../frontend
npm ci
npm run dev
# Vite dev server → http://localhost:5173
```

#### Production build  

```bash
npm run build   # outputs to ./dist
npm run preview # preview the static build locally
```

#### Deploy to Vercel  

1. Push the `frontend/` folder to a Vercel project (Vercel auto‑detects Vite).  
2. Set the same environment variables as the backend (API_URL, etc.) in Vercel dashboard.  

---  

## Configuration  

Create a **`.env`** file in `backend/` (the server reads it via `dotenv`).  

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Port the Express server listens on. | `3000` |
| `MONGO_URI` | MongoDB connection string. | `mongodb+srv://user:pass@cluster0.mongodb.net/titleforge` |
| `JWT_SECRET` | Secret for signing JWT tokens. | `supersecretkey123` |
| `REDIS_URL` | Redis connection URL (used by BullMQ). | `redis://localhost:6379` |
| `GOOGLE_GEMINI_API_KEY` | Google Generative AI key. | `AIzaSy...` |
| `PERPLEXITY_API_KEY` | Perplexity AI token. | `pk_live_...` |
| `RAZORPAY_KEY_ID` | Razorpay public key. | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | Razorpay secret. | `your_secret` |
| `RESEND_API_KEY` | Resend email service key. | `re_...` |
| `FRONTEND_URL` | Allowed origin for CORS (frontend URL). | `https://title-forge.vercel.app` |
| `BASE_URL` | Base URL used in email templates (e.g., password reset). | `https://titleforge.me` |

> **Tip:** Keep `.env` out of version control (already in `.gitignore`).  

---  

## Usage  

### Authentication (REST)  

```bash
# Register
curl -X POST http://localhost:3000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"StrongPass!123"}'

# Login – receives JWT in a HttpOnly cookie
curl -X POST http://localhost:3000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"StrongPass!123"}' \
  -c cookies.txt
```

### Generate titles (authenticated)  

```bash
# Example payload – YouTube video ID or raw text
curl -X POST http://localhost:3000/api/youtube/generate \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"videoId":"dQw4w9WgXcQ"}'
```

**Response (simplified)**  

```json
{
  "jobId": "c3f5b9e2-7a1d-4f8b-9c2e-1a2b3c4d5e6f",
  "status": "queued"
}
```

Check job status:  

```bash
curl -X GET http://localhost:3000/api/queue/status/c3f5b9e2-7a1d-4f8b-9c2e-1a2b3c4d5e6f \
  -b cookies.txt
```

When completed, the response contains an array of suggested titles.  

### Payment flow  

```bash
# Create an order (frontend will redirect to Razorpay)
curl -X POST http://localhost:3000/api/payment/create \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"plan":"pro_monthly"}'
```

Webhook verification is handled automatically by the `/api/payment/webhook` route (configure the endpoint URL in Razorpay dashboard).  

---  

## Development  

### Setting up the development environment  

1. **Backend** – run `npm run dev` (uses `tsx watch` for hot‑reloading).  
2. **Frontend** – run `npm run dev` inside `frontend/`.  

Both servers support live reload; changes to TypeScript files are compiled on‑the‑fly.  

### Testing  

The repository currently contains no unit tests. To add tests:  

```bash
# Example with Jest (install dev deps)
npm i -D jest ts-jest @types/jest
npx jest --init
```

Add scripts to `package.json`:

```json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch"
}
```

### Code style  

- **TypeScript** – strict mode (`tsconfig.json` enforces `noImplicitAny`, `strictNullChecks`).  
- **ESLint** – not configured for the backend (you may add `eslint` + `@typescript-eslint`).  
- **Prettier** – optional; run `npx prettier --write .` to format.  

### Debugging  

- Backend: use `node --inspect ./dist/index.js` after building, or attach VS Code debugger to the `tsx watch` process.  
- Frontend: Vite provides source‑map support; open DevTools → Sources.  

---  

## Deployment  

### Backend (Docker)  

```Dockerfile
# backend/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --production
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

Build & push:

```bash
docker build -t yourdockerhub/titleforge-backend:1.0.0 .
docker push yourdockerhub/titleforge-backend:1.0.0
```

Deploy to any container platform (AWS ECS, Railway, Fly.io, etc.) – ensure the environment variables listed above are set.  

### Frontend (Vercel)  

1. Connect the `frontend/` directory to a Vercel project.  
2. Set **Environment Variables** (`VITE_API_URL`, etc.) in Vercel dashboard.  
3. Vercel automatically runs `npm install && npm run build`.  

### Full‑stack Docker‑Compose (optional)  

```yaml
# docker-compose.yml (root)
version: "3.9"
services:
  api:
    build: ./backend
    ports:
      - "3000:3000"
    env_file: ./backend/.env
    depends_on:
      - mongo
      - redis

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://api:3000

  mongo:
    image: mongo:7
    restart: unless-stopped
    volumes:
      - mongo-data:/data/db

  redis:
    image: redis:7-alpine
    restart: unless-stopped

volumes:
  mongo-data:
```

Run with `docker compose up -d`.  

---  

## API Documentation  

> **Note:** The API is versioned under `/api`. All routes require a valid JWT cookie unless otherwise noted.

| Method | Path | Auth | Description | Request Body (JSON) | Success Response |
|--------|------|------|-------------|---------------------|------------------|
| `POST` | `/api/user/register` | ❌ | Register a new user. | `{ "email": "string", "password": "string" }` | `{ "message":"User created" }` |
| `POST` | `/api/user/login` | ❌ | Login, sets HttpOnly `token` cookie. | `{ "email": "string", "password": "string" }` | `{ "message":"Logged in" }` |
| `GET` | `/api/user/me` | ✅ | Get current user profile. | — | `{ "email":"...", "plan":"free", "createdAt":"..." }` |
| `POST` | `/api/youtube/generate` | ✅ | Queue a title‑generation job for a YouTube video. | `{ "videoId": "string" }` | `{ "jobId":"uuid","status":"queued" }` |
| `GET` | `/api/queue/status/:jobId` | ✅ | Poll job status / retrieve results. | — | `{ "status":"completed","titles":["..."] }` |
| `POST` | `/api/payment/create` | ✅ | Create a Razorpay order for a subscription plan. | `{ "plan":"pro_monthly" }` | `{ "orderId":"...", "amount":... }` |
| `POST` | `/api/payment/webhook` | ❌ (Razorpay signature verification) | Handles payment status callbacks. | Razorpay payload | `200 OK` |
| `POST` | `/api/nityasha` | ✅ | Example custom route (placeholder for future features). | — | — |
| `GET` | `/` | ❌ | Health check – returns “Hello World!”. | — | `"Hello World!"` |

**Authentication** – The server expects the JWT token in a **HttpOnly cookie** named `token`. For API clients that cannot store cookies, you can send the token via `Authorization: Bearer <jwt>` (middleware supports both).  

**Rate limits** – Currently a simple per‑IP limit of 60 requests/minute (implemented via `express-rate-limit` – future improvement).  

---  

## Contributing  

1. **Fork** the repository.  
2. **Create a feature branch** (`git checkout -b feat/awesome-feature`).  
3. **Install dependencies** (both backend & frontend).  
4. **Make your changes** – ensure TypeScript compiles (`npm run type-check`).  
5. **Write tests** (if applicable) and run `npm test`.  
6. **Commit** with a clear message (`git commit -m "feat: add awesome feature"`).  
7. **Push** to your fork and open a **Pull Request** against `main`.  

### Development workflow  

| Step | Command (backend) | Command (frontend) |
|------|-------------------|--------------------|
| Install | `npm ci` | `npm ci` |
| Watch / dev | `npm run dev` | `npm run dev` |
| Lint | `npm run lint` (add script) | `npm run lint` |
| Build | `npm run build` | `npm run build` |

**Code review guidelines**  

* Follow existing naming conventions (`camelCase` for variables, `PascalCase` for classes).  
* Keep API routes RESTful and versioned.  
* Add JSDoc comments for new functions.  
* Update the `README` and Swagger/OpenAPI docs (if added) when you change the public API.  

---  

## Troubleshooting  

| Issue | Solution |
|-------|----------|
| **Server fails to start – `ERR_MODULE_NOT_FOUND`** | Ensure you are running Node 20+ and that `type: "module"` is present in `package.json`. Run `npm ci` again. |
| **MongoDB connection error** | Verify `MONGO_URI` is correct and that your IP is whitelisted in Atlas. |
| **Redis connection refused** | If using Docker, make sure the `redis` container is up (`docker ps`). Use `REDIS_URL=redis://redis:6379` when running via compose. |
| **CORS errors in the browser** | Add your frontend URL to the `origin` array in `backend/src/index.ts`. |
| **Razorpay webhook signature invalid** | Ensure the webhook secret set in Razorpay matches `RAZORPAY_WEBHOOK_SECRET` (add to `.env`). |
| **Title generation returns 500** | Check Google/Perplexity API keys and quota limits. Look at server logs for the exact error. |
| **Frontend cannot reach API** | Set `VITE_API_URL` (or `REACT_APP_API_URL`) to the correct backend URL. |
| **Docker image size too large** | Use multi‑stage build (already in Dockerfile) and `node:20-alpine`. Remove dev dependencies after build. |

For more help, open an issue on GitHub or join the **#support** channel in the project’s Discord (link in `CONTRIBUTING.md`).  

---  

## Roadmap  

| Milestone | Target | Details |
|-----------|--------|---------|
| **v1.1** | Q2 2026 | Rate limiting, usage analytics, admin dashboard. |
| **v2.0** | Q4 2026 | Public OpenAPI spec, SDKs for Python & Go, multi‑language title generation. |
| **v2.1** | 2027 | AI model selection UI, A/B testing of title performance. |
| **Community** | Ongoing | Plugin system for custom heuristics, marketplace for prompts. |

---  

## License & Credits  

**License:** ISC – see [LICENSE](./LICENSE) file.  

### Contributors  

| Name | GitHub |
|------|--------|
| Kai Here | [kaihere14](https://github.com/kaihere14) |
| (Add others as they contribute) |

### Acknowledgments  

* **Google Gemini** – for the generative AI model.  
* **Perplexity AI** – for supplemental LLM capabilities.  
* **Razorpay** – for payment processing.  
* **Resend** – for email delivery.  
* **BullMQ** – for robust background job handling.  

---  

*Happy title forging!*  