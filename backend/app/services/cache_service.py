from app.core.redis_client import client

def clear_task_cache(user_id):
    if client:
        client.delete(f"tasks:{user_id}")