from allauth.socialaccount.providers.twitter.views import TwitterOAuthAdapter
from dj_rest_auth.registration.views import SocialLoginView
from dj_rest_auth.social_serializers import TwitterLoginSerializer
from dj_rest_auth.registration.serializers import VerifyEmailSerializer
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from users.serializers import (
    DisplayProfileSerializer,
    ProfileSerializer,
    UserStatusSerializer,
    UserEmailSerializer,
)
from users.models import Profile, UserStatus, User
from rest_framework import status
from rest_framework.exceptions import MethodNotAllowed
from django.utils.translation import gettext_lazy as _
from allauth.account.views import ConfirmEmailView
from allauth.account.models import EmailAddress
from allauth.account.utils import (
    has_verified_email,
    send_email_confirmation,
)


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


class TwitterLogin(SocialLoginView):
    serializer_class = TwitterLoginSerializer
    adapter_class = TwitterOAuthAdapter


# Additional Social Connect View -
# https://dj-rest-auth.readthedocs.io/en/latest/installation.html?highlight=DEFAULT_AUTHENTICATION_CLASSES#additional-social-connect-views


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
