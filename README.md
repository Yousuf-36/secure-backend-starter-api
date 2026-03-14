![Python](https://img.shields.io/badge/Python-3.13+-blue?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-brightgreen?logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-blue?logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)
![Tests](https://img.shields.io/badge/Tests-8%2F8%20passing-brightgreen)

# Launchstack API

Production-ready FastAPI boilerplate with JWT authentication, role-based access control, and provider-agnostic AI — deployable in minutes.

---

## Features

**Authentication & Security**
- JWT access + refresh token flow with HttpOnly cookie storage — access tokens in memory, refresh tokens never exposed to JavaScript
- bcrypt password hashing with configurable salt rounds
- Email format validation and password strength enforcement (8+ chars, uppercase, lowercase, digit) at the schema layer
- `SECRET_KEY` minimum length of 32 characters enforced at startup — the app refuses to boot with a weak secret
- Rate limiting on all auth endpoints via slowapi — configurable count and window per environment
- CORS headers are origin-aware per environment — no wildcards, ever, including on error responses

**Authorization**
- Role-Based Access Control enforced via FastAPI dependency injection — zero boilerplate on protected routes
- Admin role implicitly bypasses all role checks — no special casing required in individual endpoints
- Extensible role system — add new roles via a single migration and seeder entry

**AI Module**
- Provider-agnostic completion endpoint — one API, multiple backends
- Supported out of the box: Groq, Gemini, Cohere, HuggingFace, Ollama (local)
- Switch providers via a single `AI_PROVIDER` env variable — zero code changes required
- Prompt length capped at 4000 characters — prevents abuse and cost overruns
- All upstream AI errors are caught and sanitized — provider-specific stack traces never reach the client

**Developer Experience**
- Standardized error contract across all endpoints — every error has `code`, `message`, and `detail`
- Async SQLAlchemy with per-request session scoping, automatic rollback on exceptions
- Alembic migrations with full async engine support and SQLite batch mode for local dev
- Docker Compose provides a one-command local PostgreSQL environment
- Health check endpoint runs a live `SELECT 1` probe — accurate liveness signal for load balancers
- Swagger UI and ReDoc are automatically hidden when `DEBUG=false` — safe by default in production
- 8 passing tests covering auth flows, RBAC enforcement, AI error boundaries, and migration configuration

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | FastAPI | 0.115+ |
| Language | Python | 3.13+ |
| Database | PostgreSQL | 15+ |
| ORM | SQLAlchemy (async) | 2.0+ |
| Migrations | Alembic | latest |
| Validation | Pydantic | v2 |
| Auth | PyJWT + bcrypt | latest |
| Rate Limiting | slowapi | latest |
| AI Clients | httpx | latest |
| Testing | pytest + pytest-asyncio | latest |
| Containerization | Docker + Compose | latest |
| Deployment | Railway / Docker | — |

---

## Quick Start

### Prerequisites
- Python 3.13+
- Docker + Docker Compose
- PostgreSQL (or use the provided Docker Compose)

### 1. Clone the repository

```bash
git clone https://github.com/Yousuf-36/secure-backend-starter-api.git
cd secure-backend-starter-api
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env — minimum required fields:
#   SECRET_KEY  (32+ characters — generate with: python -c "import secrets; print(secrets.token_hex(32))")
#   DATABASE_URL (postgresql+asyncpg://user:password@localhost:5432/launchstack)
```

### 3. Start PostgreSQL

```bash
docker-compose up -d
```

### 4. Run migrations and seed

```bash
alembic upgrade head
python -m app.core.seeder
```

This creates:
- Database schema (users, roles, user_roles)
- Default roles: `admin`, `user`, `ai_user`
- Default admin account

### 5. Start the server

```bash
uvicorn app.main:app --reload
```

### Verify

```
GET http://localhost:8000/health
→ {"status":"ok","app":"Secure Backend Starter","version":"1.0.0","database":"ok"}

GET http://localhost:8000/docs
→ Swagger UI (development mode only — hidden when DEBUG=false)
```

> **Default admin credentials — change immediately after first login:**
> - Email: `admin@example.com`
> - Password: `SecurePassword123!`

---

## API Reference

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | None | Register a new user account |
| `POST` | `/api/v1/auth/login` | None | Login — returns access token, sets HttpOnly refresh cookie |
| `GET` | `/api/v1/auth/me` | Bearer | Return current user profile and roles |
| `POST` | `/api/v1/auth/refresh` | Cookie | Silent refresh — rotate access + refresh tokens |
| `POST` | `/api/v1/auth/logout` | None | Clear refresh token cookie |

### AI

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/v1/ai/completion` | Bearer + `ai_user` role | Generate AI text completion |

### System

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | None | Application and database liveness probe |

### Error Response Contract

Every error — validation, auth, rate limit, server — returns this exact shape:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable description",
    "detail": null
  }
}
```

### Error Code Registry

| Code | HTTP | Description |
|---|---|---|
| `AUTH_INVALID_CREDENTIALS` | 401 | Wrong email or password |
| `AUTH_TOKEN_EXPIRED` | 401 | Access token has expired |
| `AUTH_TOKEN_INVALID` | 401 | Token is malformed or signature is invalid |
| `AUTH_REFRESH_INVALID` | 401 | Refresh token type mismatch |
| `AUTH_INSUFFICIENT_ROLE` | 403 | User does not hold the required role |
| `AUTH_REQUIRED` | 401 | No authentication token provided |
| `VALIDATION_ERROR` | 422 | Request body failed input validation |
| `NOT_FOUND` | 404 | Requested resource does not exist |
| `CONFLICT` | 409 | Resource already exists (e.g. duplicate email) |
| `RATE_LIMITED` | 429 | Too many requests — back off and retry |
| `SERVER_ERROR` | 500 | Internal error — sanitized, no stack traces exposed |
| `AI_UPSTREAM_ERROR` | 502 | AI provider returned an error or timed out |

---

## Project Structure

```
launchstack-api/
├── app/
│   ├── main.py                 # FastAPI app factory, middleware, lifespan
│   ├── core/
│   │   ├── config.py           # Pydantic settings with startup validation
│   │   ├── database.py         # Async engine + per-request session dependency
│   │   ├── exceptions.py       # Global exception handlers — standardized contract
│   │   ├── middleware.py       # Request logging middleware
│   │   ├── limiter.py          # Shared slowapi rate limiter instance
│   │   └── seeder.py           # Default role and admin account seeder
│   ├── models/
│   │   ├── base.py             # SQLAlchemy declarative base
│   │   ├── user.py             # User ORM model with timestamps
│   │   └── role.py             # Role ORM model
│   ├── auth/
│   │   ├── router.py           # Auth endpoints — rate limited
│   │   ├── service.py          # Auth business logic
│   │   ├── security.py         # JWT encode/decode, bcrypt hashing
│   │   └── dependencies.py     # get_current_user FastAPI dependency
│   ├── roles/
│   │   └── dependencies.py     # require_role / require_any_role RBAC dependencies
│   ├── ai/
│   │   ├── router.py           # AI completion endpoint — rate limited
│   │   ├── service.py          # Provider routing + error boundaries
│   │   └── schemas.py          # CompletionRequest / CompletionResponse
│   └── schemas/
│       ├── auth.py             # Login, Register, Token schemas
│       └── user.py             # UserResponse schema
├── alembic/
│   ├── env.py                  # Async migration environment
│   └── versions/               # Migration scripts
├── tests/
│   ├── conftest.py             # Async client + mock DB fixtures
│   ├── test_auth.py            # Auth endpoint tests
│   ├── test_rbac.py            # Role enforcement tests
│   ├── test_ai.py              # AI service tests
│   └── test_alembic.py        # Migration configuration test
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── .env.example
├── railway.toml
└── Procfile
```

---

## Configuration

Copy `.env.example` to `.env` and fill in the required values.

| Variable | Default | Required | Description |
|---|---|---|---|
| `APP_ENV` | `development` | No | Set to `production` for production deployments |
| `DEBUG` | `true` | No | Enables `/docs`, `/redoc`. Set to `false` in production |
| `SECRET_KEY` | — | **Yes** | JWT signing secret — minimum 32 characters |
| `DATABASE_URL` | — | **Yes** | Async PostgreSQL URL: `postgresql+asyncpg://user:pass@host/db` |
| `ALGORITHM` | `HS256` | No | JWT signing algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` | No | Access token lifetime in minutes |
| `REFRESH_TOKEN_EXPIRE_DAYS` | `7` | No | Refresh token lifetime in days |
| `ALLOWED_ORIGINS` | `http://localhost:3000` | No | Comma-separated list of allowed CORS origins |
| `AI_PROVIDER` | `groq` | No | Active AI provider: `groq`, `gemini`, `cohere`, `huggingface`, `ollama` |
| `GROQ_API_KEY` | — | If `groq` | Groq Cloud API key |
| `GEMINI_API_KEY` | — | If `gemini` | Google Gemini API key |
| `COHERE_API_KEY` | — | If `cohere` | Cohere API key |
| `HUGGINGFACE_API_KEY` | — | If `huggingface` | HuggingFace access token |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | If `ollama` | Local Ollama server URL |
| `RATE_LIMIT_AUTH_REQUESTS` | `10` | No | Max auth requests per window |
| `RATE_LIMIT_AUTH_WINDOW_SECONDS` | `60` | No | Rate limit window in seconds |
| `RATE_LIMIT_AI_REQUESTS_PER_MINUTE` | `30` | No | AI completion requests per minute |

---

## Testing

```bash
pytest -v --tb=short
```

| Module | Tests | Coverage |
|---|---|---|
| `test_auth.py` | 3 | Register, login, token refresh flows |
| `test_rbac.py` | 2 | Admin bypass, role denial enforcement |
| `test_ai.py` | 2 | Successful completion, timeout error handling |
| `test_alembic.py` | 1 | Migration configuration and head revision |
| **Total** | **8** | **8 / 8 passing** |

Tests use `httpx.AsyncClient` against the live ASGI app with a fully mocked database session — no external services required.

---

## Deployment

### Railway (Recommended)

1. Create a new project on [railway.app](https://railway.app)
2. Connect this GitHub repository
3. Add the PostgreSQL plugin — `DATABASE_URL` is auto-injected into the environment
4. Set all required environment variables in the Railway dashboard (see [Configuration](#configuration))
5. Deploy — Railway reads `railway.toml` and `Procfile` automatically
6. Open the Railway shell and run the one-time setup:

```bash
alembic upgrade head
python -m app.core.seeder
```

### Docker

```bash
docker build -t launchstack-api .
docker run -p 8000:8000 --env-file .env launchstack-api
```

For a full local stack including PostgreSQL:

```bash
docker-compose up --build
```

---

## Extending Launchstack

### Adding a new endpoint

Create a router in `app/your_module/router.py` following the existing pattern, then register it in `app/main.py`:

```python
from app.your_module.router import router as your_router
app.include_router(your_router, prefix=config.API_V1_STR + "/your-module", tags=["your-module"])
```

### Adding a new role

Add the role name to `app/core/seeder.py`, then re-run:

```bash
python -m app.core.seeder
```

Assign the role to a route using the existing RBAC dependency:

```python
from app.roles.dependencies import require_role

@router.get("/admin-only", dependencies=[Depends(require_role("your_role"))])
async def admin_only_endpoint():
    ...
```

### Adding a new AI provider

Add the provider API key to `.env`, then add a new case to `app/ai/service.py`. Switch the active provider:

```bash
# .env
AI_PROVIDER=your_provider
YOUR_PROVIDER_API_KEY=sk-...
```

No other code changes required.

### Creating a database migration

```bash
alembic revision --autogenerate -m "describe your change"
alembic upgrade head
```

---

## License

MIT — see [LICENSE](LICENSE)
