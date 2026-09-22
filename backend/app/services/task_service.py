from app.core.exceptions import ApiError
from app.models import Task
from datetime import date


def validate_task_fields(data, partial=False):
    errors = {}
    title = data.get("title")
    if not partial and not title:
        errors["title"] = "Title is required"
    elif title is not None:
        if not isinstance(title, str) or not title.strip():
            errors["title"] = "Title cannot be empty"
        elif len(title.strip()) > 160:
            errors["title"] = "Title must be 160 characters or fewer"

    description = data.get("description")
    if description is not None and not isinstance(description, str):
        errors["description"] = "Description must be text"

    status = data.get("status")
    if status is not None and status not in Task.Status.values:
        errors["status"] = "Invalid status"

    priority = data.get("priority")
    if priority is not None and priority not in Task.Priority.values:
        errors["priority"] = "Invalid priority"

    due_date = data.get("due_date")
    if due_date not in (None, ""):
        try:
            date.fromisoformat(due_date)
        except (TypeError, ValueError):
            errors["due_date"] = "Due date must be a valid date"

    if errors:
        raise ApiError("Validation failed", status=400, errors=errors)


def update_task(task, data):
    validate_task_fields(data, partial=True)
    for field in ("title", "description", "status", "priority", "due_date"):
        if field in data:
            value = data[field]
            if field == "title":
                value = value.strip()
            elif field == "due_date" and value == "":
                value = None
            setattr(task, field, value)
    task.save()
    return task
