FROM node:24-alpine

WORKDIR /app

RUN mkdir -p apps/web apps/api packages/database packages/shared

COPY package.json ./
COPY apps/web/package.json apps/web/package-lock.json* ./apps/web/
COPY apps/api/package.json apps/api/package-lock.json* ./apps/api/
COPY packages/database/package.json packages/database/package-lock.json* ./packages/database/
COPY packages/shared/package.json packages/shared/package-lock.json* ./packages/shared/
COPY tsconfig.json ./

RUN npm install --workspaces

COPY apps/web/ ./apps/web/
COPY packages/ ./packages/
COPY apps/web/nuxt.config.ts ./

RUN npm run build --workspace=apps/web

EXPOSE 3000

CMD ["npm", "run", "preview", "--workspace=apps/web"]
