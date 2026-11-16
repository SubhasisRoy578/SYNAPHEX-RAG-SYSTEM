import logging
from typing import Generator
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings

logger = logging.getLogger(__name__)


def normalize_database_url(url: str) -> str:
    """
    Normalizes database connection URLs for SQLAlchemy sync engine.
    Converts legacy 'postgres://' or async 'postgresql+asyncpg://' prefixes.
    """
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql://", 1)
    if url.startswith("postgresql+asyncpg://"):
        return url.replace("postgresql+asyncpg://", "postgresql://", 1)
    return url


def get_engine(url: str = None):
    db_url = normalize_database_url(url or settings.DATABASE_URL)
    connect_args = {}
    if db_url.startswith("sqlite"):
        connect_args["check_same_thread"] = False
    elif db_url.startswith("postgresql"):
        connect_args["connect_timeout"] = 2
    return create_engine(
        db_url,
        pool_pre_ping=True,
        connect_args=connect_args,
        future=True,
    )


engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency that yields a database session and safely closes it."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def check_db_connection(timeout_seconds: float = 2.0) -> bool:
    """
    Executes a lightweight ping to verify database connectivity.
    Returns True if healthy, False if unreachable or unconfigured.
    """
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception as exc:
        logger.debug(f"Database readiness check failed: {exc}")
        return False
