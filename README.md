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

- Node.js >= 20
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

### Desarrollo

```bash
# Todo los servicios
docker-compose up

# Solo base de datos
docker-compose up postgres
```

### Producción

```bash
docker-compose up --build
```

## Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev:api` | Iniciar backend en desarrollo |
| `npm run dev:web` | Iniciar frontend en desarrollo |
| `npm run build` | Build de todas las apps |
| `npm run lint` | Lint de todos los paquetes |
| `npm run typecheck` | Verificación de tipos |

## Tecnologías

- **Backend**: Fastify, TypeScript, Kysely, Zod
- **Frontend**: Nuxt 3, Vue 3
- **Base de datos**: PostgreSQL 16
- **ORM**: Kysely
