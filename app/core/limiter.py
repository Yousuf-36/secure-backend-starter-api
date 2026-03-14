"""
Shared rate limiter instance.

Defined in its own module to avoid circular imports:
  main.py → auth/router.py → main.limiter  (circular)
  main.py → auth/router.py → core/limiter.limiter  (clean)
"""
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
