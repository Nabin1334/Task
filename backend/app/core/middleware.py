import logging

from django.conf import settings
from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin

from app.core.exceptions import ApiError

logger = logging.getLogger(__name__)


def api_error_response(message, status=400, errors=None):
    body = {"detail": message}
    if errors:
        body["errors"] = errors
    return JsonResponse(body, status=status)


class ApiExceptionMiddleware(MiddlewareMixin):
    def process_exception(self, request, exception):
        if not request.path.startswith("/api/"):
            return None
        if isinstance(exception, ApiError):
            return api_error_response(exception.message, exception.status, exception.errors)
        logger.exception("Unhandled API error on %s", request.path)
        if settings.DEBUG:
            return api_error_response(str(exception), status=500)
        return api_error_response("Internal server error", status=500)
