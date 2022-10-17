from django.contrib.auth import get_user_model

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .serializers import MatchesThisWeekSerializer
from .match import get_one_one_match

from social.models import SocialProfile

User = get_user_model()

"""
Endpoint for getting a match: /social/one-one/
1. Returns the matches present in matches_this_week.
2. If there are no matches, it tries to find a match.
Returns empty list if no match is found.
Returns: list of user ids
(indirect matching is handled in get_one_one_match)
"""


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_matches_this_week(request):
    """Determine if the user is authenticated and return their SocialProfile"""
    match request.method:
        case "GET":
            try:
                profile = SocialProfile.objects.get(user=request.user)
            except SocialProfile.DoesNotExist:
                return Response(
                    {"error": "User does not have a Social Profile"}, status=404
                )
            # check NO MATCHES
            if profile.matches_this_week.count() > 0:
                data = MatchesThisWeekSerializer(profile).data
                return Response({"matches_this_week": data["matches_this_week"]})
            # # check Availability
            if profile.available_this_week is False or not (
                match := get_one_one_match(request.user)
            ):
                return Response({"matches_this_week": []})
            matched_profile = SocialProfile.objects.get(user__id=match[0])
            profile.matches_this_week.add(matched_profile)
            profile.available_this_week = False
            matched_profile.available_this_week = False
            profile.save()
            matched_profile.save()
            serializer = MatchesThisWeekSerializer(profile)
            return Response({"matches_this_week": serializer.data["matches_this_week"]})
        case _:
            return Response({"error": "Invalid method"}, status=405)
