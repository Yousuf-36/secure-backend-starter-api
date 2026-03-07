# Import all models here so SQLAlchemy's mapper registry has
# both User and Role registered before any relationship resolution occurs.
# This prevents "failed to locate name 'Role'" errors from deferred resolution.
from app.models.base import Base
from app.models.role import Role
from app.models.user import User

__all__ = ["Base", "Role", "User"]
