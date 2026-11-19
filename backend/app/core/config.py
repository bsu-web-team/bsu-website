"""Application settings, read from environment variables (see .env.example)."""

from functools import lru_cache
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    environment: Literal["local", "test", "staging", "production"] = "local"
    app_name: str = "BSU API"
    log_level: str = "INFO"

    database_url: str = "postgresql+asyncpg://bsu:bsu@localhost:5432/bsu"
    db_pool_size: int = Field(default=10, ge=1)
    db_max_overflow: int = Field(default=10, ge=0)

    # Comma-separated list of allowed browser origins, e.g. "http://localhost:3000,https://bsu.kg"
    cors_origins: str = "http://localhost:3000"

    # Swagger UI / OpenAPI. Can be disabled in production if the university requires it.
    docs_enabled: bool = True

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def is_production(self) -> bool:
        return self.environment == "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()
