FROM node:22-alpine

WORKDIR /app

COPY package.json apps/api/package.json packages/*/package.json ./
COPY apps/api/package-lock.json* ./
COPY packages/*/package-lock.json* ./ 2>/dev/null || true

RUN npm install --workspaces

COPY apps/api/ ./apps/api/
COPY packages/ ./packages/
COPY tsconfig.json ./

RUN npm run build --workspace=apps/api

EXPOSE 3001

CMD ["node", "apps/api/dist/index.js"]
