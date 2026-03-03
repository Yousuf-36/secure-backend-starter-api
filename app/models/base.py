from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    """
    Base class for all SQLAlchemy ORM models.
    All models must inherit from this to enable correct relationship mapping
    and async session functionality.
    """
    pass
