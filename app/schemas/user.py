from pydantic import BaseModel, EmailStr
from typing import List

class RoleResponse(BaseModel):
    name: str
    
    model_config = {"from_attributes": True}

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    is_active: bool
    roles: List[RoleResponse] = []

    model_config = {"from_attributes": True}
