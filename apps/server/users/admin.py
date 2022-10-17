from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from users.models import Profile, UserStatus

# Register your models here.

User = get_user_model()


@admin.register(User)
class CustomUserAdmin(BaseUserAdmin):
    pass


admin.site.register(Profile)
admin.site.register(UserStatus)
