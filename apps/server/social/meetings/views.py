from urllib.request import Request
from django.contrib.auth import get_user_model

from django.db.models import Q

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from social.models import SocialProfile, MeetingRoom
from .serializers import MeetingSerializer

User = get_user_model()


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def meetings(request: Request) -> Response:
    """
    Get meetings for the week
    """
    match request.method:
        case "GET":
            meetings = MeetingRoom.objects.filter(
                Q(invites__in=[request.user]) | Q(organizer=request.user)
            ).distinct()

            serializer = MeetingSerializer(meetings, many=True)

            return Response({"meetings": serializer.data})
        case "PATCH":
            # todo: validate number of invites before creating meeting from request.data
            pass
        case _:
            return Response({"error": "Invalid method"}, status=405)
