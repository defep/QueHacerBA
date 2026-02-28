FROM node:22-alpine

WORKDIR /app

COPY package.json apps/web/package.json packages/*/package.json ./
COPY apps/web/package-lock.json* ./
COPY packages/*/package-lock.json* ./ 2>/dev/null || true

RUN npm install --workspaces

COPY apps/web/ ./apps/web/
COPY packages/ ./packages/
COPY tsconfig.json ./
COPY apps/web/nuxt.config.ts ./

RUN npm run build --workspace=apps/web

EXPOSE 3000

CMD ["npm", "run", "preview", "--workspace=apps/web"]
