from django.contrib.auth import get_user_model

def create_user(email, password, name=""):
    User = get_user_model()
    user = User.objects.create_user(username=email, email=email, password=password)
    user.first_name = name
    user.save(update_fields=["first_name"])
    return user