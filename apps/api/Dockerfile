FROM node:24-alpine

WORKDIR /app

RUN mkdir -p apps/api apps/web packages/database packages/shared

COPY package.json ./
COPY apps/web/package.json apps/web/package-lock.json* ./apps/web/
COPY apps/api/package.json apps/api/package-lock.json* ./apps/api/
COPY packages/database/package.json packages/database/package-lock.json* ./packages/database/
COPY packages/shared/package.json packages/shared/package-lock.json* ./packages/shared/
COPY tsconfig.json ./

RUN npm install --workspaces

COPY apps/api/src/ ./apps/api/src/
COPY apps/api/tsconfig.json ./apps/api/
COPY packages/ ./packages/

RUN rm -rf apps/api/dist && npm run build --workspace=apps/api

EXPOSE 3001

CMD ["node", "apps/api/dist/apps/api/src/index.js"]
