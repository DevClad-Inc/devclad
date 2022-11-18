from django.urls import path


from users.views import (
    profile,
    user_status,
    user_subscriptions,
    change_email,
    profile_is_complete,
    user_profile,
)

app_name = "users"

urlpatterns = [
    path("profile/", profile, name="profile"),
    path("profile/<str:username>/", user_profile, name="profile"),
    path("is-complete/", profile_is_complete, name="profile_is_complete"),
    path("status/", user_status, name="user_status"),
    path("subscription/", user_subscriptions, name="user_subscriptions"),
    path("change-email/", change_email, name="change_email"),
]
