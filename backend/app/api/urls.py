from django.urls import path
from .auth_views import login, register
from .task_views import task_detail, task_list

urlpatterns = [
    path("auth/register/", register), path("auth/login/", login),
    path("tasks/", task_list), path("tasks/<int:task_id>/", task_detail),
]