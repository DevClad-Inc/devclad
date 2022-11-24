import requests
from rest_framework.decorators import (
    api_view,
    permission_classes,
)
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from users.models import GithubOAuth
from users.oauth.serializers import GithubOAuthSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from django.conf import settings


@api_view(["PATCH"])
@permission_classes([AllowAny])
def github_oauth_login(request) -> Response:
    """Login with Github"""
    match request.method:
        case "PATCH":
            try:
                username = request.data["username"]
                githubOAuth = GithubOAuth.objects.get(username=username)
            except GithubOAuth.DoesNotExist:
                return Response({"error": "Github not connected"}, status=400)
            access_token = request.data["access_token"]
            serializer = GithubOAuthSerializer(
                githubOAuth, data={"access_token": access_token}, partial=True
            )
            match serializer.is_valid():
                case True:
                    try:
                        user = GithubOAuth.objects.get(username=username).user
                        print(user)
                    except GithubOAuth.DoesNotExist:
                        return Response({"error": "Github not connected"}, status=400)
                    serializer.save()
                    refresh = RefreshToken.for_user(user)
                    return Response(
                        {"refresh": str(refresh), "access": str(refresh.access_token)},
                        status=200,
                    )
        case _:
            return Response({"error": "Invalid method"}, status=405)


@api_view(["PATCH", "GET"])
@permission_classes([IsAuthenticated])
def github_oauth_connect(request) -> Response:
    """Connect with Github"""
    match request.method:
        case "GET":
            try:
                githubOauth = GithubOAuth.objects.get(user=request.user)
            except GithubOAuth.DoesNotExist:
                githubOauth = GithubOAuth.objects.create(user=request.user)
            serializer = GithubOAuthSerializer(githubOauth)
            return Response(serializer.data)
        case "PATCH":
            try:
                githubOAuth = GithubOAuth.objects.get(user=request.user)
            except GithubOAuth.DoesNotExist:
                githubOAuth = GithubOAuth.objects.create(user=request.user)
            access_token = request.data.get("access_token")
            username = request.data.get("username")
            serializer = GithubOAuthSerializer(
                githubOAuth,
                data={"access_token": access_token, "username": username},
                partial=True,
            )
            match serializer.is_valid():
                case True:
                    match github_validity_check(access_token):
                        case True:
                            serializer.save()
                            return Response(
                                {"message": "Github account connected"},
                                status=200,
                            )
                        case _:
                            match settings.DEBUG:
                                case True:
                                    serializer.save()
                                    return Response(
                                        {"message": "Github account connected"},
                                        status=200,
                                    )
                                case _:
                                    return Response(
                                        {"error": "Github account not valid"},
                                        status=400,
                                    )
        case _:
            return Response({"error": "Invalid method"}, status=405)


def github_validity_check(access_token: str) -> bool:
    """Prevent bad actors from using our Github OAuth"""
    url = "https://api.github.com/user"
    headers = {"Authorization": f"token {access_token}"}
    response = requests.get(url, headers=headers)
    match response.status_code:
        case 200:
            return True
        case _:
            return False
