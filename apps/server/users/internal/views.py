from urllib.request import Request
from rest_framework.decorators import (
    api_view,
    permission_classes,
)
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from users.models import UserStatus
from users.serializers import UserStatusSerializer
from users.internal.serializers import UserSerializer

from django.contrib.auth import get_user_model


User = get_user_model()


@api_view(["GET", "PATCH"])
@permission_classes([IsAdminUser])
def manage_users(request: Request) -> Response:
    match request.method:
        case "GET":
            if status := request.query_params.get("status"):
                user_statuses = UserStatus.objects.exclude(
                    status="Not Submitted"
                ).filter(approved=status)
                users = [user_status.user for user_status in user_statuses]
                status_serializer = UserStatusSerializer(user_statuses, many=True)
                user_serializer = UserSerializer(users, many=True)
                return Response(
                    {"users": user_serializer.data, "statuses": status_serializer.data}
                )
            users = User.objects.all()
            user_statuses = UserStatus.objects.all()
            serializer = UserSerializer(users, many=True)
            status_serializer = UserStatusSerializer(user_statuses, many=True)
            return Response(
                {"users": serializer.data, "user_statuses": status_serializer.data}
            )
        case "PATCH":
            user = User.objects.get(id=request.data["id"])
            user_status = UserStatus.objects.get(user=user)
            serializer = UserStatusSerializer(user_status, data=request.data)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
        case _:
            return Response(status=405)


@api_view(["GET"])
@permission_classes([IsAdminUser])
def check_admin(request: Request) -> Response:
    match request.method:
        case "GET":
            if request.user.is_superuser:
                return Response({"is_admin": True})
            # this shouldn't happen since the decorator should prevent it
            return Response({"is_admin": False})
        case _:
            return Response(status=405)
