FROM oven/bun:1 AS builder
WORKDIR /app

# Build-time backend URL — Vite inlines it into the bundle.
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

COPY admin/ ./
RUN bun install --frozen-lockfile

RUN bun run build

FROM nginx:1.27-alpine AS runtime
COPY admin/admin.nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
