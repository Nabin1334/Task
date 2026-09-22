from datetime import datetime, timedelta, timezone
import jwt
from django.contrib.auth import get_user_model
from app.core.config import JWT_EXPIRY_HOURS, JWT_SECRET

def issue_token(user):
    payload = {"user_id": user.id, "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRY_HOURS)}
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def user_from_request(request):
    header = request.headers.get("Authorization", "")
    if not header.startswith("Bearer "):
        return None
    try:
        payload = jwt.decode(header[7:], JWT_SECRET, algorithms=["HS256"])
        return get_user_model().objects.filter(id=payload["user_id"]).first()
    except (jwt.PyJWTError, KeyError):
        return None