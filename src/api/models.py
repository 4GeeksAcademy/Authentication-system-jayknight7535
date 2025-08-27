
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase
from sqlalchemy.ext.hybrid import hybrid_property
from werkzeug.security import generate_password_hash, check_password_hash

# Base class for declarative mapping
class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

class User(Base):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(256), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(256), unique=True, nullable=False)
    _password: Mapped[str] = mapped_column(String(256), nullable=False)

    @hybrid_property
    def password(self):
        return self._password

    @password.setter
    def password(self, raw_password: str):
        self._password = generate_password_hash(raw_password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self._password, password)

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email
        }

    def __repr__(self):
        return f"<User {self.username}>"
