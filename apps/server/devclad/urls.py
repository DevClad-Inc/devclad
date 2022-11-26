from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from decouple import config
from users.views import (
    VerifyEmailView,
    Login,
    RefreshToken,
)
from dj_rest_auth.views import PasswordResetView, PasswordResetConfirmView

from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
from rest_framework.response import Response
from rest_framework.permissions import AllowAny


@api_view(["GET"])
@permission_classes([AllowAny])
@authentication_classes([AllowAny])
def health_check(request):
    return Response({"status": "ok"})


urlpatterns = [
    path(config("ADMIN_URL", default="admin/"), admin.site.urls),
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
    path("health/", health_check),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
