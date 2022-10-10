# User's Identity on Chat Services (GetStream for Chat; 100ms for Video)

from django.conf import settings

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from stream.models import StreamUser
from users.models import Profile

import stream_chat
import datetime


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def token(request):
    """
    Generate a token for a user/ upsert a user
    """
    match request.method:
        case "GET":
            try:
                stream_user = StreamUser.objects.get(user=request.user)
                profile = Profile.objects.get(user=request.user)
                uid = stream_user.uid
                token = stream_user.token
            except StreamUser.DoesNotExist:
                StreamUser.objects.create(user=request.user)
                return Response({"error": "Try again."}, status=400)
            match token:
                case "":
                    api_key = settings.STREAM_API_KEY
                    api_secret = settings.STREAM_API_SECRET
                    user_id = str(uid)[:8]

                    server_client = stream_chat.StreamChat(api_key, api_secret)
                    token = server_client.create_token(
                        user_id, iat=datetime.datetime.now()
                    )

                    stream_user.token = token
                    stream_user.save()
                    server_client.upsert_users(
                        [
                            {
                                "id": user_id,
                                "first_name": request.user.first_name,
                                "last_name": request.user.last_name,
                                "username": request.user.username,
                                "email": request.user.email,
                                "image": profile.get_avatar_url(),
                            }
                        ]
                    )
                    return Response(
                        {"token": stream_user.token, "uid": str(uid)[:8]},
                        status=200,
                    )
                case _:
                    return Response({"token": token, "uid": str(uid)[:8]}, status=200)
        case _:
            return Response({"error": "Invalid method"}, status=405)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_uid(request, username):
    """
    Get a user's uid. *Meant to be used for other users.*
    token/ already returns the uid for the current user.
    """
    match request.method:
        case "GET":
            try:
                stream_user = StreamUser.objects.get(user__username=username)
                uid = stream_user.uid
            except StreamUser.DoesNotExist:
                return Response({"error": "Try again."}, status=400)
            return Response({"uid": str(uid)[:8]}, status=200)
        case _:
            return Response({"error": "Invalid method"}, status=405)
