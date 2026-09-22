import pytest
from app.models import User

@pytest.fixture
def user(db):
    return User.objects.create_user(username="test@example.com", email="test@example.com", password="secret123")