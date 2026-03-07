from typing import List, Callable
from fastapi import Depends
from app.models import User
from app.auth.dependencies import get_current_user
from app.core.exceptions import api_error

def require_role(required_role: str) -> Callable:
    """
    Dependency injection wrapper enforcing a specific role upon the current user.
    Includes an implicit 'admin' bypass mapping per architectural requirements.
    """
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        user_roles = [role.name for role in current_user.roles]
        
        # Admin override pattern: Admin accounts bypass all role checks implicitly
        if "admin" in user_roles:
            return current_user
            
        if required_role not in user_roles:
            raise api_error(
                "AUTH_INSUFFICIENT_ROLE", 
                f"Your account requires the '{required_role}' role to perform this action.", 
                403
            )
            
        return current_user
    return role_checker

def require_any_role(required_roles: List[str]) -> Callable:
    """
    Dependency injection wrapper enforcing the required list contains at least one of
    the user's provisioned roles. Includes the regular 'admin' bypass.
    """
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        user_roles = [role.name for role in current_user.roles]
        
        if "admin" in user_roles:
            return current_user
            
        if not any(role in user_roles for role in required_roles):
            raise api_error(
                "AUTH_INSUFFICIENT_ROLE", 
                f"You must hold at least one of the following roles: {', '.join(required_roles)}", 
                403
            )
            
        return current_user
    return role_checker
