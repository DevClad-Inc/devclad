from urllib.request import Request
from django.contrib.auth import get_user_model

from django.db.models import Q

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from social.models import MeetingRoom
from .serializers import MeetingSerializer

User = get_user_model()


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def meetings(request: Request) -> Response:
    """
    Get meetings for the week; create/update meetings
    """
    match request.method:
        case "GET":
            meetings = MeetingRoom.objects.filter(
                Q(invites__in=[request.user]) | Q(organizer=request.user)
            ).distinct()

            serializer = MeetingSerializer(meetings, many=True)

            return Response({"meetings": serializer.data})
        case "PATCH":
            request.data["invites"] = [
                User.objects.get(username=invite).id
                for invite in request.data["invites"]
            ]
            request.data["organizer"] = User.objects.get(
                username=request.data["organizer"]
            ).id
            serializer = MeetingSerializer(
                data=request.data, partial=True, context={"request": request}
            )
            match serializer.is_valid():
                case True:
                    serializer.save()
                    return Response(serializer.data)
                case _:
                    return Response({"message": serializer.errors}, status=400)
        case _:
            return Response({"error": "Invalid method"}, status=405)
