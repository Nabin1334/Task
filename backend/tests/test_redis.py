from app.core import redis_client

def test_redis_client_is_optional():
    assert hasattr(redis_client, "client")