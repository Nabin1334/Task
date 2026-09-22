from app.models import Task

def for_owner(owner, filters=None):
    filters = filters or {}
    query = Task.objects.filter(owner=owner)
    if filters.get("status"): query = query.filter(status=filters["status"])
    if filters.get("priority"): query = query.filter(priority=filters["priority"])
    if filters.get("search"): query = query.filter(title__icontains=filters["search"])
    return query