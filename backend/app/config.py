"""Settings read from environment variables or backend/.env (never commit .env)."""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # postgresql://user:password@host:5432/dbname
    database_url: str = "postgresql://bsu:bsu_local_password@127.0.0.1:5432/bsu"
    # Swagger UI at /docs and schema at /openapi.json.
    enable_docs: bool = True

    @property
    def sqlalchemy_url(self) -> str:
        """SQLAlchemy needs the driver name: postgresql:// -> postgresql+psycopg://"""
        url = self.database_url
        if url.startswith("postgres://"):
            url = "postgresql://" + url.removeprefix("postgres://")
        if url.startswith("postgresql://"):
            url = "postgresql+psycopg://" + url.removeprefix("postgresql://")
        return url


settings = Settings()
