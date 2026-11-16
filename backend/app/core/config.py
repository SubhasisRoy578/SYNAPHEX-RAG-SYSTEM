import os
from typing import List, Union
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables or .env file.
    Follows 12-factor configuration principles.
    """
    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(__file__), "../../../.env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Core Application
    APP_NAME: str = "SYNAPHEX"
    APP_ENV: str = Field(default="development", description="development, staging, or production")
    APP_VERSION: str = "1.0.0"
    LOG_LEVEL: str = Field(default="INFO", description="DEBUG, INFO, WARNING, ERROR, CRITICAL")

    # API Server
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    API_V1_PREFIX: str = "/api/v1"

    # Security & CORS
    CORS_ORIGINS: Union[str, List[str]] = "http://localhost:5173,http://127.0.0.1:5173"
    SECRET_KEY: str = "insecure-secret-key-for-development-only"
    JWT_SECRET_KEY: str = "synaphex-phase3-jwt-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    PROJECT_ROOT: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../"))
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/synaphex"
    TEST_DATABASE_URL: str = "sqlite:///:memory:"
    QDRANT_URL: str = "http://localhost:6333"
    QDRANT_API_KEY: str = ""
    QDRANT_COLLECTION_NAME: str = "synaphex_chunks_v1"
    STORAGE_ROOT: str = Field(
        default_factory=lambda: os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../storage"))
    )
    MAX_UPLOAD_MB: int = 25
    # Chunking defaults
    CHUNK_SIZE: int = 500
    CHUNK_OVERLAP: int = 100

    # AI & Embeddings
    LLM_PROVIDER: str = "openai"
    LLM_API_KEY: str = ""
    LLM_MODEL: str = "gpt-4o-mini"
    EMBEDDING_PROVIDER: str = "openai"
    EMBEDDING_API_KEY: str = ""
    EMBEDDING_MODEL: str = "text-embedding-3-small"
    EMBEDDING_DIMENSION: int = 1536

    # Rate limiting
    RATE_LIMIT: str = "100/min"
    # Logging
    LOG_FORMAT: str = "%(asctime)s %(levelname)s %(name)s %(message)s"
    LOG_LEVEL: str = Field(default="INFO", description="DEBUG, INFO, WARNING, ERROR, CRITICAL")

    @property
    def cors_origins_list(self) -> List[str]:
        if isinstance(self.CORS_ORIGINS, list):
            return self.CORS_ORIGINS
        if isinstance(self.CORS_ORIGINS, str):
            return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]
        return ["*"]


settings = Settings()
