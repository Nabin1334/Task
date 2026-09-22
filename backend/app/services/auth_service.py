from django.contrib.auth import authenticate
from django.db import IntegrityError

from app.auth.jwt import issue_token
from app.core.exceptions import ApiError
from app.repositories.user_repo import create_user
from app.schemas.user import user_data


def register_user(email, password, name=""):
    try:
        user = create_user(email, password, name)
    except IntegrityError as error:
        raise ApiError("An account with this email already exists", status=409) from error
    return {"token": issue_token(user), "user": user_data(user)}


def login_user(email, password):
    user = authenticate(username=email, password=password)
    if not user:
        return None
    return {"token": issue_token(user), "user": user_data(user)}
