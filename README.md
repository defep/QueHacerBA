# QueHacerBA

Monorepo con backend Fastify/TypeScript y frontend Nuxt 3, usando PostgreSQL como base de datos.

## Estructura

```
quehacerba/
├── apps/
│   ├── api/         # Backend Fastify (puerto 3001)
│   └── web/        # Frontend Nuxt (puerto 3000)
├── packages/
│   ├── shared/     # Tipos y utilidades compartidas
│   └── database/   # Kysely + PostgreSQL
├── docker-compose.yml
└── package.json
```

## Requisitos

- Node.js >= 24
- Docker y Docker Compose (opcional)

## Desarrollo Local

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

### 3. Iniciar PostgreSQL (Docker)

```bash
docker-compose up postgres
```

### 4. Ejecutar desarrollo

```bash
# Backend
npm run dev:api

# Frontend
npm run dev:web
```

## Docker

### Desarrollo (con hot reload)

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

Esto monta los fuentes localmente y reinicia automáticamente:
- **API**: http://localhost:3001 (tsx watch)
- **Web**: http://localhost:3000 (nuxt dev)
- **DB**: http://localhost:5432

### Producción

```bash
docker compose up --build
```

### Otros comandos

```bash
# Solo base de datos
docker compose up postgres

# Rebuild sin cache
docker compose build --no-cache <service>
```

## API Endpoints

| Endpoint | Descripción |
|----------|-------------|
| `GET /api/agenda` | Agenda de eventos del fin de semana |
| `GET /api/events` | Lista de eventos (placeholder) |
| `GET /health` | Health check |

## Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev:api` | Iniciar backend en desarrollo |
| `npm run dev:web` | Iniciar frontend en desarrollo |
| `npm run build` | Build de todas las apps |
| `npm run lint` | Lint de todos los paquetes |
| `npm run typecheck` | Verificación de tipos |

## Tecnologías

- **Backend**: Fastify 5, TypeScript, Kysely, Zod
- **Frontend**: Nuxt 4, Vue 3
- **Base de datos**: PostgreSQL 16
- **ORM**: Kysely
