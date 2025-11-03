# Stage 1 — builder (has rust, build tools)
FROM python:3.12-slim AS builder

ARG DEBIAN_FRONTEND=noninteractive
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install apt build deps for pydantic-core, pillow, psycopg2, etc.
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential gcc g++ curl pkg-config libpq-dev libssl-dev libffi-dev \
    zlib1g-dev libjpeg-dev libfreetype6-dev liblcms2-dev libwebp-dev tcl-dev tk-dev \
    ca-certificates git \
    && rm -rf /var/lib/apt/lists/*

# Install rust toolchain non-interactively (for maturin/cargo builds)
ENV RUSTUP_HOME=/rustup CARGO_HOME=/cargo PATH=/cargo/bin:/root/.cargo/bin:$PATH
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y \
    && rustup default stable

# Upgrade pip and install wheel-building helpers (maturin may be pulled by pip deps)
RUN python -m pip install --upgrade pip setuptools wheel

WORKDIR /wheels
COPY requirements.txt /wheels/requirements.txt

# Build wheels for all requirements (local wheelhouse)
RUN python -m pip wheel --no-deps --wheel-dir /wheels/wheelhouse -r /wheels/requirements.txt

# Stage 2 — runtime
FROM python:3.12-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install only runtime OS deps (smaller)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 libssl1.1 libjpeg62-turbo zlib1g \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
# copy wheelhouse and install from it (no network)
COPY --from=builder /wheels/wheelhouse /wheels/wheelhouse
RUN python -m pip install --no-index --find-links=/wheels/wheelhouse -r /wheels/requirements.txt

COPY . /app

# Non-root user
RUN adduser --disabled-password --gecos "" appuser && chown -R appuser /app
USER appuser

EXPOSE 8000
CMD ["sh", "-c", "python manage.py migrate && gunicorn --bind 0.0.0.0:8000 KUKUCONNECT.wsgi"]
