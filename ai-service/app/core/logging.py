import logging
import sys

from app.core.config import settings


def setup_logging() -> None:
    """Call once at startup. Keeps log format consistent across the service."""
    logging.basicConfig(
        level=settings.LOG_LEVEL,
        format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        stream=sys.stdout,
    )


def get_logger(name: str) -> logging.Logger:
    return logging.getLogger(name)
