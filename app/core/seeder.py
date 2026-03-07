import asyncio
import logging
import os
import sys

# Ensure app is in path if running from root
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from sqlalchemy.future import select
from app.core.database import AsyncSessionLocal
from app.models import User, Role
from app.auth.security import get_password_hash

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("seeder")

async def seed_admin():
    async with AsyncSessionLocal() as session:
        try:
            # Check if admin role exists
            result = await session.execute(select(Role).filter(Role.name == "admin"))
            admin_role = result.scalars().first()
            if not admin_role:
                logger.info("Creating 'admin' role...")
                admin_role = Role(name="admin")
                session.add(admin_role)
                await session.flush()

            # Check if user role exists
            result = await session.execute(select(Role).filter(Role.name == "user"))
            user_role = result.scalars().first()
            if not user_role:
                logger.info("Creating 'user' role...")
                user_role = Role(name="user")
                session.add(user_role)
                await session.flush()

            # Create default admin user
            admin_email = "admin@example.com"
            admin_password = "SecurePassword123!"

            result = await session.execute(select(User).filter(User.email == admin_email))
            existing_admin = result.scalars().first()

            if not existing_admin:
                logger.info(f"Creating default admin user ({admin_email})...")
                hashed_password = get_password_hash(admin_password)
                new_admin = User(
                    email=admin_email,
                    hashed_password=hashed_password,
                    is_active=True
                )
                new_admin.roles.append(admin_role)
                session.add(new_admin)
                await session.commit()
                logger.info("Admin user created successfully.")
            else:
                logger.info("Admin user already exists.")

        except Exception as e:
            logger.error(f"Error seeding database: {e}")
            await session.rollback()

if __name__ == "__main__":
    logger.info("Starting database seeder...")
    asyncio.run(seed_admin())
    logger.info("Seeding complete.")
