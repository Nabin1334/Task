from django.db import DatabaseError
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

from app.auth.permissions import authenticated
from app.core.exceptions import ApiError
from app.core.request_utils import parse_json_body
from app.models import Task
from app.repositories.task_repo import for_owner
from app.schemas.task import task_data
from app.services.cache_service import clear_task_cache
from app.services.task_service import update_task, validate_task_fields


@authenticated
@require_http_methods(["GET", "POST"])
def task_list(request):
    if request.method == "GET":
        try:
            filters = {
                key: request.GET.get(key)
                for key in ("status", "priority", "search")
            }
            tasks = [task_data(task) for task in for_owner(request.user, filters)]
        except DatabaseError as error:
            raise ApiError("Could not load tasks", status=503) from error
        return JsonResponse({"tasks": tasks})

    data = parse_json_body(request)
    validate_task_fields(data)
    try:
        task = Task.objects.create(
            owner=request.user,
            title=data["title"].strip(),
            description=data.get("description", ""),
            status=data.get("status", Task.Status.TODO),
            priority=data.get("priority", Task.Priority.MEDIUM),
            due_date=data.get("due_date") or None,
        )
    except DatabaseError as error:
        raise ApiError("Could not create task", status=503) from error
    return JsonResponse(task_data(task), status=201)


@authenticated
@require_http_methods(["PATCH", "DELETE"])
def task_detail(request, task_id):
    try:
        task = Task.objects.filter(id=task_id, owner=request.user).first()
    except DatabaseError as error:
        raise ApiError("Could not load task", status=503) from error

    if not task:
        raise ApiError("Task not found", status=404)

    if request.method == "DELETE":
        try:
            task.delete()
            clear_task_cache(request.user.id)
        except DatabaseError as error:
            raise ApiError("Could not delete task", status=503) from error
        return JsonResponse({}, status=204)

    data = parse_json_body(request)
    try:
        task = update_task(task, data)
        clear_task_cache(request.user.id)
    except DatabaseError as error:
        raise ApiError("Could not update task", status=503) from error
    return JsonResponse(task_data(task))
