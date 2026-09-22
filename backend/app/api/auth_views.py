from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

from app.core.exceptions import ApiError
from app.core.request_utils import parse_json_body
from app.services.auth_service import login_user, register_user


@require_http_methods(["POST"])
def register(request):
    data = parse_json_body(request)
    errors = {}
    if not data.get("email"):
        errors["email"] = "Email is required"
    if not data.get("password"):
        errors["password"] = "Password is required"
    if errors:
        raise ApiError("Validation failed", status=400, errors=errors)
    payload = register_user(data["email"], data["password"], data.get("name", ""))
    return JsonResponse(payload, status=201)


@require_http_methods(["POST"])
def login(request):
    data = parse_json_body(request)
    email = (data.get("email") or "").strip()
    password = data.get("password") or ""
    if not email or not password:
        raise ApiError("Email and password are required", status=400)
    result = login_user(email, password)
    if not result:
        raise ApiError("Invalid credentials", status=401)
    return JsonResponse(result)
