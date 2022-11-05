from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from users.views import (
    VerifyEmailView,
    Login,
    RefreshToken,
)
from dj_rest_auth.views import PasswordResetView, PasswordResetConfirmView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("auth/token/refresh/", RefreshToken.as_view(), name="refresh_token"),
    path("auth/login/", Login.as_view(), name="login"),
    path("auth/", include("dj_rest_auth.urls")),
    path("auth/registration/", include("dj_rest_auth.registration.urls")),
    path(
        "auth/account-confirm-email/",
        VerifyEmailView.as_view(),
        name="account_email_verification_sent",
    ),
    path("auth/password/reset/", PasswordResetView.as_view(), name="password_reset"),
    path(
        "auth/password/reset/confirm/<uidb64>/<token>/",
        PasswordResetConfirmView.as_view(),
        name="password_reset_confirm",
    ),
    path("oauth/", include("users.oauth.urls")),
    path("stream/", include("stream.urls")),
    path("users/", include("users.urls")),
    path("social/", include("social.urls")),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
