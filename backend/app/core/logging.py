import logging
import sys
from app.core.config import settings


def setup_logging():
    """
    Configures safe, standardized application logging.
    Ensures secrets, raw documents, and credentials are not accidentally logged.
    """
    log_level = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)

    log_format = (
        "[%(asctime)s] [%(levelname)s] [%(name)s] "
        "[req_id=%(request_id)s] %(message)s"
        if "%(request_id)s" in logging.BASIC_FORMAT
        else "[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s"
    )

    logging.basicConfig(
        level=log_level,
        format="[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s",
        handlers=[logging.StreamHandler(sys.stdout)],
        force=True,
    )

    # Silence noisy third-party loggers
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.error").setLevel(logging.INFO)

    logger = logging.getLogger("synaphex")
    logger.setLevel(log_level)
    return logger


logger = setup_logging()
