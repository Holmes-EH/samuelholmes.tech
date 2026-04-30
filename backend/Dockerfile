# ---- planner: compute dep recipe ----
FROM rust:1-bookworm AS chef
RUN cargo install cargo-chef --locked
WORKDIR /app

FROM chef AS planner
COPY backend/Cargo.toml backend/Cargo.lock ./
COPY backend/src ./src
RUN cargo chef prepare --recipe-path recipe.json

# ---- builder: build deps then app ----
FROM chef AS builder
COPY --from=planner /app/recipe.json recipe.json
# Compile dependencies — cached as long as Cargo.toml/lock don't change.
RUN cargo chef cook --release --recipe-path recipe.json

# Now bring in the actual source and build.
COPY backend/Cargo.toml backend/Cargo.lock ./
COPY backend/src ./src
COPY backend/.sqlx ./.sqlx
ENV SQLX_OFFLINE=true
RUN cargo build --release --bin backend

# ---- runtime: slim image with just the binary ----
FROM debian:bookworm-slim AS runtime
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates libssl3 \
  && rm -rf /var/lib/apt/lists/* \
  && useradd -r -u 1001 -m app

WORKDIR /app
COPY --from=builder /app/target/release/backend /usr/local/bin/backend

# Uploads dir — mounted as a volume in compose.
RUN mkdir -p /app/uploads/images && chown -R app:app /app

USER app
ENV BIND_ADDR=0.0.0.0:8000 \
  UPLOAD_DIR=/app/uploads/images
EXPOSE 8000
CMD ["backend"]
