from django.contrib.auth import get_user_model

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from social.models import SocialProfile
from social.serializers import (
    MatchesThisWeekSerializer,
)
from social.ml.match import get_one_one_match

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
    """
    Determine if the user is authenticated and return their SocialProfile
    """
    try:
        user = request.user
        profile = SocialProfile.objects.get(user=user)
    except SocialProfile.DoesNotExist:
        return Response({"error": "User does not have a Social Profile"}, status=404)
    if request.method == "GET":
        username_list = []
        # check NO MATCHES
        if profile.matches_this_week.count() > 0:
            data = MatchesThisWeekSerializer(profile).data
            username_list.extend(
                User.objects.get(id=id).username for id in data["matches_this_week"]
            )

            return Response({"matches_this_week": username_list})
        # check Availability
        if not profile.available_this_week or not (match := get_one_one_match(user)):
            return Response({"matches_this_week": []})
        matched_profile = SocialProfile.objects.get(user__id=match[0])
        profile.matches_this_week.add(matched_profile)
        profile.available_this_week = False
        matched_profile.available_this_week = False
        profile.save()
        matched_profile.save()
        # username in matchesthisweekserializer
        data = MatchesThisWeekSerializer(profile).data
        username_list.extend(
            User.objects.get(id=id).username for id in data["matches_this_week"]
        )

        return Response({"matches_this_week": username_list})
    if request.method not in ["GET"]:
        return Response({"error": "Invalid method"}, status=405)
    return Response("error", status=400)
