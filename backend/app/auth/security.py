from datetime import datetime, timedelta

from jose import jwt
from passlib.context import CryptContext

SECRET_KEY = "change-this-secret-key"
ALGORITHM = "HS256"

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(
    password: str,
    hashed: str,
) -> bool:
    return pwd_context.verify(
        password,
        hashed,
    )


def create_access_token(
    user_id: str,
):
    expire = datetime.utcnow() + timedelta(hours=24)

    payload = {
        "sub": user_id,
        "exp": expire,
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )