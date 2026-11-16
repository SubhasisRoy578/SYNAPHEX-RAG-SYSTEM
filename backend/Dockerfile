FROM python:3.13-slim AS base

# OS-level dependencies required for building extensions and PostgreSQL client
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Create non‑root user for security
ARG USERNAME=appuser
ARG UID=1000
RUN adduser --disabled-password --gecos "" --uid $UID $USERNAME

WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the FastAPI source code
COPY backend/app ./app
COPY backend/main.py ./

ENV PYTHONUNBUFFERED=1
ENV PATH="/home/$USERNAME/.local/bin:$PATH"

USER $USERNAME
EXPOSE 8000

# Health check endpoint is /health/ready
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s \
  CMD curl -f http://localhost:8000/health/ready || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]