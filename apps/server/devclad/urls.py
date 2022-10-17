from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from users.views import VerifyEmailView
from dj_rest_auth.views import PasswordResetView, PasswordResetConfirmView

urlpatterns = [
    path("admin/", admin.site.urls),
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
    path("stream/", include("stream.urls")),
    path("users/", include("users.urls")),
    path("social/", include("social.urls")),
    # path("graphql", (GraphQLView.as_view(graphiql=settings.DEBUG))),
]

# urlpatterns += [
#     path('auth/twitter/', TwitterLogin.as_view(), name='twitter_login')
# ]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# API Endpoints - https://dj-rest-auth.readthedocs.io/en/latest/api_endpoints.html
