from .config import REDIS_URL

try:
    import redis
    client = redis.from_url(REDIS_URL, decode_responses=True)
except ImportError:
    client = None