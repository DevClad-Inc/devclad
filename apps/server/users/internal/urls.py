from django.urls import path
from users.internal.views import manage_users

urlpatterns = [
    path("users", manage_users, name="users"),
]
