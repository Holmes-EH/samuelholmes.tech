FROM oven/bun:1 AS builder

ARG API_URL
ENV API_URL=${API_URL}

WORKDIR /app

COPY frontend/ ./
RUN bun install --frozen-lockfile

RUN bun run build

FROM nginx:1.27-alpine AS runtime
COPY frontend/frontend.nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
