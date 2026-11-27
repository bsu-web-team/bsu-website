# BSU Next.js self-hosted runtime. Keep dependencies pinned by package-lock.json.
FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-bookworm-slim AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
# Optional build-time data source (defaults keep local data, no API needed).
# Backend mode needs a reachable, seeded API during `npm run build` because pages
# are prerendered; see deploy/staging/. ARG values are visible to RUN as env vars.
ARG BSU_DATA_SOURCE=local
ARG BSU_CONTENT_SOURCE=local
ARG BSU_API_BASE_URL=
ARG BSU_API_REVALIDATE_SECONDS=0
ARG BSU_UNIT_PUBLICATION_BASE_URL=
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN groupadd --system bsu && useradd --system --gid bsu --home-dir /app bsu
COPY --from=builder --chown=bsu:bsu /app/public ./public
COPY --from=builder --chown=bsu:bsu /app/.next ./.next
COPY --from=builder --chown=bsu:bsu /app/node_modules ./node_modules
COPY --from=builder --chown=bsu:bsu /app/package.json ./package.json
USER bsu
EXPOSE 3000
CMD ["./node_modules/.bin/next", "start", "-H", "0.0.0.0", "-p", "3000"]
