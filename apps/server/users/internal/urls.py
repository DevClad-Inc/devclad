from django.urls import path
from users.internal.views import manage_users, check_admin

urlpatterns = [
    path("users", manage_users, name="users"),
    path("check-admin/", check_admin, name="check-admin"),
]
