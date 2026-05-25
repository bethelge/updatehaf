# HAF frontend (TanStack Start) — Render / Docker
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Baked into the client bundle at build time
ARG VITE_API_BASE_URL=
ARG VITE_API_SSR_URL=
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_API_SSR_URL=$VITE_API_SSR_URL

RUN npm run build

# --- runtime ---
FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache wget

ENV NODE_ENV=production

COPY --from=build /app/dist ./dist
COPY --from=build /app/scripts/render-server.mjs ./scripts/render-server.mjs
COPY --from=build /app/package.json ./package.json

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT:-3000}/ || exit 1

CMD ["node", "scripts/render-server.mjs"]
