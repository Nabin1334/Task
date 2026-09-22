from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    email = __import__("django.db.models", fromlist=["EmailField"]).EmailField(unique=True)

    def __str__(self):
        return self.email