from functools import wraps
from django.http import JsonResponse
from .jwt import user_from_request

def authenticated(view):
    @wraps(view)
    def wrapper(request, *args, **kwargs):
        user = user_from_request(request)
        if not user:
            return JsonResponse({"detail": "Authentication required"}, status=401)
        request.user = user
        return view(request, *args, **kwargs)
    return wrapper