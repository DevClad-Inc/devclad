import datetime
from django.http import HttpResponse
import json
from urllib.request import Request
import uuid
from django.contrib.auth import get_user_model

from django.db.models import Q

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from social.models import MeetingRoom, SocialProfile
from .serializers import MeetingSerializer

User = get_user_model()

"""using SP's pk to get reference to the user (organizer) and modify request data with username"""


def JSONTimeZone(time):
    time = time.replace(tzinfo=None)
    return time.isoformat()


def generateMail(serialized_data: dict):
    meeting = MeetingRoom.objects.get(id=serialized_data["id"])
    return json.dumps(
        [
            {
                "typeOf": serialized_data["type_of"],
                "time": serialized_data["time"],
                "uid": serialized_data["uid"],
                "email": User.objects.get(username=invite).email,
                "firstName": User.objects.get(username=invite).first_name,
                "inviteName": User.objects.get(
                    username=meeting.invites.exclude(username=invite)[0]
                ).first_name,
                "timeZone": str(
                    SocialProfile.objects.get(
                        user=User.objects.get(username=invite)
                    ).timezone
                ),
            }
            for invite in meeting.invites.all()
        ]
    )


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def meetings(request: Request, uid: str) -> Response:
    """Get meetings for the week; create/update meetings"""
    match request.method:
        case "GET":
            match (uid):
                case "upcoming":
                    meetings = (
                        MeetingRoom.objects.filter(
                            time__gt=datetime.datetime.now(),
                        )
                        .filter(
                            Q(invites__in=[request.user]) | Q(organizer=request.user)
                        )
                        .distinct()
                        .order_by("time")
                    )
                    serializer = MeetingSerializer(meetings, many=True)
                    for meeting in serializer.data:
                        meeting["organizer"] = User.objects.get(
                            id=meeting["organizer"]
                        ).username
                case "past":
                    meetings = (
                        MeetingRoom.objects.filter(
                            time__lt=datetime.datetime.now(),
                        )
                        .filter(
                            Q(invites__in=[request.user]) | Q(organizer=request.user),
                        )
                        .distinct()
                        .order_by("-time")
                    )
                    serializer = MeetingSerializer(meetings, many=True)
                    for meeting in serializer.data:
                        meeting["organizer"] = User.objects.get(
                            pk=meeting["organizer"]
                        ).username
                case _:
                    try:
                        uuid.UUID(uid)
                    except ValueError:
                        return Response("Invalid UID", status=400)
                    try:
                        meeting = MeetingRoom.objects.get(uid=uid)
                        serializer = MeetingSerializer(meeting)
                    except MeetingRoom.DoesNotExist:
                        return Response("Meeting not found", status=404)
                    if request.user not in meeting.invites.all():
                        return Response(
                            "You are not invited to this meeting", status=403
                        )
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
                    return HttpResponse(
                        generateMail(serializer.data), "application/json"
                    )
                case _:
                    return Response({"message": serializer.errors}, status=400)
        case _:
            return Response({"error": "Invalid method"}, status=405)
