import json

from app.core.exceptions import ApiError


def parse_json_body(request):
    if not request.body:
        return {}
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError as error:
        raise ApiError("Invalid JSON body", status=400) from error
    if not isinstance(data, dict):
        raise ApiError("JSON body must be an object", status=400)
    return data
