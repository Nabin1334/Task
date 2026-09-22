import json
import pytest
from django.test import Client
from app.auth.jwt import issue_token

@pytest.mark.django_db
def test_authenticated_user_can_create_and_list_tasks(user):
    client = Client()
    headers = {"HTTP_AUTHORIZATION": f"Bearer {issue_token(user)}"}
    created = client.post("/api/tasks/", data=json.dumps({"title": "Ship the feature", "priority": "high"}), content_type="application/json", **headers)
    assert created.status_code == 201
    listed = client.get("/api/tasks/", **headers)
    assert listed.status_code == 200
    assert listed.json()["tasks"][0]["title"] == "Ship the feature"