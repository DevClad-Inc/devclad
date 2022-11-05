from allauth.account.models import EmailAddress
from allauth.account.utils import has_verified_email, send_email_confirmation
from allauth.account.views import ConfirmEmailView
from dj_rest_auth.registration.serializers import VerifyEmailSerializer
from rest_framework.views import APIView
from rest_framework.decorators import (
    api_view,
    permission_classes,
)
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import MethodNotAllowed
from users.serializers import (
    DisplayProfileSerializer,
    ProfileSerializer,
    UserStatusSerializer,
    UserEmailSerializer,
)
from users.models import Profile, UserStatus, User
from django.utils.translation import gettext_lazy as _

from dj_rest_auth.views import LoginView
from django.conf import settings
from django.utils import timezone
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.settings import api_settings as jwt_settings


class Login(LoginView):
    def get_response(self):
        serializer_class = self.get_response_serializer()

        if getattr(settings, "REST_USE_JWT", False):

            access_token_expiration = (
                timezone.now() + jwt_settings.ACCESS_TOKEN_LIFETIME
            )
            refresh_token_expiration = (
                timezone.now() + jwt_settings.REFRESH_TOKEN_LIFETIME
            )
            return_expiration_times = getattr(
                settings, "JWT_AUTH_RETURN_EXPIRATION", False
            )
            auth_httponly = getattr(settings, "JWT_AUTH_HTTPONLY", False)

            data = {
                "user": self.user,
                "access_token": self.access_token,
                "refresh_token": "" if auth_httponly else self.refresh_token,
            }

            if return_expiration_times:
                data["access_token_expiration"] = access_token_expiration
                data["refresh_token_expiration"] = refresh_token_expiration

            serializer = serializer_class(
                instance=data,
                context=self.get_serializer_context(),
            )
        elif self.token:
            serializer = serializer_class(
                instance=self.token,
                context=self.get_serializer_context(),
            )
        else:
            return Response(status=status.HTTP_204_NO_CONTENT)

        response = Response(serializer.data, status=status.HTTP_200_OK)
        if getattr(settings, "REST_USE_JWT", False):
            cookie_name = getattr(settings, "JWT_AUTH_COOKIE", None)
            access_token_expiration = (
                timezone.now() + jwt_settings.ACCESS_TOKEN_LIFETIME
            )
            cookie_secure = getattr(settings, "JWT_AUTH_SECURE", False)
            cookie_httponly = getattr(settings, "JWT_AUTH_HTTPONLY", True)
            cookie_samesite = getattr(settings, "JWT_AUTH_SAMESITE", "Lax")
            refresh_cookie_name = getattr(settings, "JWT_AUTH_REFRESH_COOKIE", None)
            refresh_cookie_path = getattr(settings, "JWT_AUTH_REFRESH_COOKIE_PATH", "/")
            cookie_domain = getattr(settings, "SESSION_COOKIE_DOMAIN", None)
            if cookie_name:
                response.set_cookie(
                    cookie_name,
                    self.access_token,
                    expires=access_token_expiration,
                    secure=cookie_secure,
                    domain=cookie_domain,
                    httponly=cookie_httponly,
                    samesite=cookie_samesite,
                )

            if refresh_cookie_name:
                response.set_cookie(
                    refresh_cookie_name,
                    self.refresh_token,
                    expires=refresh_token_expiration,
                    secure=cookie_secure,
                    domain=cookie_domain,
                    httponly=cookie_httponly,
                    samesite=cookie_samesite,
                    path=refresh_cookie_path,
                )
        return response


class RefreshToken(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        cookie_name = getattr(settings, "JWT_AUTH_COOKIE", None)
        if cookie_name and response.status_code == 200 and "access" in response.data:
            cookie_secure = getattr(settings, "JWT_AUTH_SECURE", False)
            cookie_httponly = getattr(settings, "JWT_AUTH_HTTPONLY", True)
            cookie_samesite = getattr(settings, "JWT_AUTH_SAMESITE", "Lax")

            # read domain from django settings
            cookie_domain = getattr(settings, "SESSION_COOKIE_DOMAIN", None)

            token_expiration = timezone.now() + jwt_settings.ACCESS_TOKEN_LIFETIME
            response.set_cookie(
                cookie_name,
                response.data["access"],
                expires=token_expiration,
                secure=cookie_secure,
                domain=cookie_domain,
                httponly=cookie_httponly,
                samesite=cookie_samesite,
            )

            response.data["access_token_expiration"] = token_expiration
        return response


class VerifyEmailView(APIView, ConfirmEmailView):
    permission_classes = (AllowAny,)
    allowed_methods = ("POST", "OPTIONS", "HEAD")

    @staticmethod
    def get_serializer(*args, **kwargs):
        return VerifyEmailSerializer(*args, **kwargs)

    @staticmethod
    def get(*args, **kwargs):
        raise MethodNotAllowed("GET")

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.kwargs["key"] = serializer.validated_data["key"]
        confirmation = self.get_object()
        confirmation.confirm(self.request)
        return Response({"detail": _("ok")}, status=status.HTTP_200_OK)


@api_view(["GET", "PUT", "PATCH"])
@permission_classes([IsAuthenticated])
def profile(request) -> Response:
    """Determine if the user is authenticated and return their profile"""
    try:
        profile = Profile.objects.get(user=request.user)
    except Profile.DoesNotExist:
        return Response({"error": "User does not have a profile"}, status=404)

    if request.method == "GET":
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    if request.method == "PUT":
        serializer = ProfileSerializer(profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    if request.method == "PATCH":
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    if request.method not in ["GET", "PUT", "PATCH"]:
        return Response({"error": "Invalid method"}, status=405)

    return Response(serializer.errors, status=400)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_profile(request, username) -> Response:
    """Determine if profile for username exists"""
    try:
        profile = Profile.objects.get(user__username=username)
    except Profile.DoesNotExist:
        return Response({"error": "User does not have a profile"}, status=404)

    if request.method == "GET":
        serializer = DisplayProfileSerializer(profile)
        return Response(serializer.data)

    if request.method not in ["GET"]:
        return Response({"error": "Invalid method"}, status=405)

    return Response(serializer.errors, status=400)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def profile_is_complete(request) -> Response:
    """Determine if the user is authenticated and return their SocialProfile"""
    try:
        profile = Profile.objects.get(user=request.user)
    except Profile.DoesNotExist:
        return Response({"error": "User does not have a Social Profile"}, status=404)
    if request.method == "GET":
        serializer = ProfileSerializer(profile)
        if serializer.data["about"] == "":
            return Response({"is_complete": False})
        return Response({"is_complete": True})
    if request.method not in ["GET"]:
        return Response({"error": "Invalid method"}, status=405)

    return Response(serializer.errors, status=400)


# make PATCH request to /api/users/status/ in conjunction with /api/users/profile/
# and /api/users/social/ in React to "submit" the user's profile
# make get request to /api/users/status/ to check if user is "Approved" or not.
@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def user_status(request) -> Response:
    """Determine if the user is authenticated and return their UserStatus"""
    match request.method:
        case "GET":
            try:
                user_status = UserStatus.objects.get(user=request.user)
            except UserStatus.DoesNotExist:
                return Response(
                    {"error": "User does not have a UserStatus"}, status=404
                )
            serializer = UserStatusSerializer(user_status)
            return Response(serializer.data)
        case "PATCH":
            try:
                user_status = UserStatus.objects.get(user=request.user)
            except UserStatus.DoesNotExist:
                return Response(
                    {"error": "User does not have a UserStatus"}, status=404
                )
            serializer = UserStatusSerializer(
                user_status, data=request.data, partial=True
            )
            match serializer.is_valid():
                case True:
                    serializer.save()
                    return Response(serializer.data)
                case _:
                    return Response(serializer.errors, status=400)
        case _:
            return Response({"error": "Invalid method"}, status=405)


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def change_email(request) -> Response:
    match request.method:
        case "GET":
            try:
                user = User.objects.get(pk=request.user.pk)
            except User.DoesNotExist:
                return Response({"error": "User does not exist"}, status=404)
            match has_verified_email(user.pk):
                case True:
                    return Response({"verified": True}, status=200)
                case _:
                    return Response({"verified": False}, status=200)
        case "PATCH":
            try:
                user: User = User.objects.get(pk=request.user.pk)
                old_email: str = user.email
            except User.DoesNotExist:
                return Response({"error": "User does not exist"}, status=404)
            serializer = UserEmailSerializer(user, data=request.data, partial=True)
            match serializer.is_valid():
                case True:
                    serializer.save()
                    EmailAddress.objects.filter(email=old_email).delete()
                    send_email_confirmation(
                        request, user, email=user.email, signup=True
                    )
                    return Response(serializer.data)
                case _:
                    return Response(serializer.errors, status=400)
        case _:
            return Response({"error": "Invalid method"}, status=405)
