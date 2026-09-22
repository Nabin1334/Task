import json
import pytest
from django.test import Client

@pytest.mark.django_db
def test_register_returns_token():
    response = Client().post("/api/auth/register/", data=json.dumps({"email": "new@example.com", "password": "secret123"}), content_type="application/json")
    assert response.status_code == 201
    assert "token" in response.json()