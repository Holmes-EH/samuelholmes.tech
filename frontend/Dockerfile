FROM oven/bun:1 AS builder
WORKDIR /app

# Build-time API URL — passed via compose build.args.
ARG API_URL
ENV API_URL=${API_URL}

COPY frontend/package.json frontend/bun.lock ./
RUN bun install --frozen-lockfile

COPY frontend/ ./
RUN bun run build

FROM nginx:1.27-alpine AS runtime
COPY frontend/frontend.nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
