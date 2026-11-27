"""Models and Alembic migrations must describe the same schema.

If this fails, a model changed without a migration, or a module with tables is
not imported in alembic/env.py (then autogenerate would emit DROP TABLE).
"""
import importlib.util
from pathlib import Path

from alembic.autogenerate import compare_metadata
from alembic.migration import MigrationContext

from app.db import engine


def test_models_match_migrations():
    env_path = Path(__file__).resolve().parents[1] / "alembic" / "env.py"
    source = env_path.read_text(encoding="utf-8")
    # Import the same model modules env.py imports, without running migrations.
    imports = "\n".join(line for line in source.splitlines() if line.startswith(("from app", "import app")))
    namespace: dict = {}
    exec(compile(imports, str(env_path), "exec"), namespace)
    metadata = namespace["Base"].metadata

    with engine.connect() as connection:
        diff = compare_metadata(MigrationContext.configure(connection), metadata)
    assert diff == [], f"Schema drift between models and migrations: {diff}"


def test_every_model_module_is_registered_in_alembic_env():
    app_dir = Path(__file__).resolve().parents[1] / "app"
    env_source = (app_dir.parent / "alembic" / "env.py").read_text(encoding="utf-8")
    for path in app_dir.glob("*.py"):
        if path.name.startswith("test_") or path.name == "models.py":
            continue
        if "__tablename__" in path.read_text(encoding="utf-8"):
            assert f"from app import {path.stem}" in env_source, f"{path.name} is not imported in alembic/env.py"
