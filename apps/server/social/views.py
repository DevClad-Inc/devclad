from urllib.request import Request
from django.contrib.auth import get_user_model


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from social.models import SocialProfile
from social.serializers import (
    SocialProfileSerializer,
    AdditionalSPSerializer,
    SocialDisplayProfileSerializer,
    CircleSerializer,
    AddedSerializer,
    BlockedUsersSerializer,
    ShadowUsersSerializer,
    SkippedUsersSerializer,
)

User = get_user_model()


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def profile(request):
    """Determine if the user is authenticated and return their SocialProfile"""
    match request.method:
        case "GET":
            try:
                profile = SocialProfile.objects.get(user=request.user)
            except SocialProfile.DoesNotExist:
                return Response(
                    {"error": "User does not have a Social Profile"}, status=404
                )
            serializer = SocialProfileSerializer(profile)
            return Response(serializer.data)

        case "PATCH":
            try:
                profile = SocialProfile.objects.get(user=request.user)
            except SocialProfile.DoesNotExist:
                return Response(
                    {"error": "User does not have a Social Profile"}, status=404
                )
            serializer = SocialProfileSerializer(
                profile, data=request.data, partial=True
            )

            match serializer.is_valid():
                case True:
                    serializer.save()
                    return Response(serializer.data)
                case False:
                    return Response(serializer.errors, status=400)
        case _:
            return Response({"error": "Invalid request method"}, status=400)


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def additional_preferences(request):
    """Manage user's additional 1on1 preferences"""
    match request.method:
        case "GET":
            try:
                profile = SocialProfile.objects.get(user=request.user)
            except SocialProfile.DoesNotExist:
                return Response(
                    {"error": "User does not have a Social Profile"}, status=404
                )
            serializer = AdditionalSPSerializer(profile)
            return Response(serializer.data)
        case "PATCH":
            try:
                profile = SocialProfile.objects.get(user=request.user)
            except SocialProfile.DoesNotExist:
                return Response(
                    {"error": "User does not have a Social Profile"}, status=404
                )
            serializer = AdditionalSPSerializer(
                profile, data=request.data, partial=True
            )
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
        case _:
            return Response({"error": "Invalid method"}, status=405)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def social_profile(request: Request, username: str) -> Response:
    """Social Profile of user visible to other users"""
    match request.method:
        case "GET":
            try:
                user = User.objects.get(username=username)
                profile = SocialProfile.objects.get(user=user)
            except SocialProfile.DoesNotExist:
                return Response(
                    {"error": "User does not have a Social Profile"}, status=404
                )
            serializer = SocialDisplayProfileSerializer(profile)
            return Response(serializer.data)
        case _:
            return Response({"error": "Invalid method"}, status=405)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def profile_is_complete(request):
    """Determine if social profile of user is complete"""
    match request.method:
        case "GET":
            try:
                profile = SocialProfile.objects.get(user=request.user)
            except SocialProfile.DoesNotExist:
                return Response(
                    {"error": "User does not have a Social Profile"}, status=404
                )
            serializer = SocialProfileSerializer(profile)
            required_fields = [
                "preferred_dev_type",
                "purpose",
                "dev_type",
                "timezone",
                "idea_status",
                "languages",
                "raw_xp",
            ]
            match_case = all(field in serializer.data for field in required_fields)
            return Response({"is_complete": match_case})
        case _:
            return Response({"error": "Invalid method"}, status=405)


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def circle(request: Request, username: str, operation: str) -> Response:
    """Perform operations on a user's circle"""
    match request.method:
        case "GET":
            match operation:
                case "get":
                    try:
                        profile = SocialProfile.objects.get(user__username=username)
                    except SocialProfile.DoesNotExist:
                        return Response(
                            {"error": "User does not have a Social Profile"}, status=404
                        )
                    serializer = CircleSerializer(profile)
                    return Response({"circle": serializer.data["circle"]})
                case _:
                    return Response({"error": "Invalid operation"}, status=400)

        case "PATCH":
            request_user_profile = SocialProfile.objects.get(user=request.user)
            try:
                other_user_profile = SocialProfile.objects.get(user__username=username)
            except SocialProfile.DoesNotExist:
                return Response(
                    {"error": "User does not have a Social Profile"}, status=404
                )
            match operation:
                case "add":
                    matches_this_week = request_user_profile.matches_this_week.all()
                    for username in request.data["circle"]:
                        user_profile = SocialProfile.objects.get(
                            user__username=username
                        )
                        user_profile_added = user_profile.get_flat_values("circle")
                        if user_profile not in (matches_this_week):
                            # this check is for an upcoming feature: add by a secret code
                            if request_user_profile not in user_profile_added:
                                return Response(
                                    {"error": "Operation blocked."}, status=400
                                )
                            return Response(
                                {"error": "User not in matches this week"}, status=400
                            )

                    request.data["circle"] = [
                        User.objects.get(username=uname).id
                        for uname in request.data["circle"]
                    ]

                    serializer = CircleSerializer(
                        request_user_profile, data=request.data
                    )
                    match serializer.is_valid():
                        case True:
                            serializer.save()
                            print(serializer.data)
                            other_user_profile.circle.add(request_user_profile)
                            return Response({"circle": serializer.data["circle"]})
                        case _:
                            return Response(serializer.errors, status=400)

                case "remove":
                    request.data["circle"] = [
                        User.objects.get(username=uname).id
                        for uname in request.data["circle"]
                    ]
                    serializer = CircleSerializer(
                        request_user_profile, data=request.data, partial=True
                    )
                    match serializer.is_valid():
                        case True:
                            serializer.save()
                            if (
                                SocialProfile.objects.get(user=request.user)
                                in other_user_profile.circle.all()
                            ):
                                other_user_profile.circle.remove(request_user_profile)
                            return Response({"circle": serializer.data["circle"]})
                        case False:
                            return Response(serializer.errors, status=400)
                case _:
                    return Response({"error": "Invalid operation"}, status=400)
        case _:
            return Response({"error": "Invalid method"}, status=405)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def added(request: Request) -> Response:
    """List of users that request.user has added to their circle; not necessarily the other way around"""
    match request.method:
        case "GET":
            try:
                profile = SocialProfile.objects.get(user=request.user)
            except SocialProfile.DoesNotExist:
                return Response(
                    {"error": "User does not have a Social Profile"}, status=404
                )
            serializer = AddedSerializer(profile)
            return Response({"added": serializer.data["circle"]})
        case _:
            return Response({"error": "Invalid method"}, status=405)


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def block(request: Request) -> Response:
    """Block a user/Get blocked users"""
    match request.method:
        case "GET":
            try:
                profile = SocialProfile.objects.get(user=request.user)
            except SocialProfile.DoesNotExist:
                return Response(
                    {"error": "User does not have a Social Profile"}, status=404
                )
            serializer = BlockedUsersSerializer(profile)
            return Response({"blocked": serializer.data["blocked"]})

        case "PATCH":
            request_user_profile = SocialProfile.objects.get(user=request.user)
            request.data["blocked"] = [
                User.objects.get(username=uname).id for uname in request.data["blocked"]
            ]
            serializer = BlockedUsersSerializer(request_user_profile, data=request.data)
            if serializer.is_valid():
                serializer.save()
                for id in request.data["blocked"]:
                    user_profile = SocialProfile.objects.get(user__id=id)
                    if user_profile == request_user_profile:
                        return Response({"error": "Cannot block self"}, status=400)
                    user_profile.circle.remove(
                        request_user_profile
                        if request_user_profile in user_profile.circle.all()
                        else None
                    )
                    user_profile.matches_this_week.remove(
                        request_user_profile
                        if request_user_profile in user_profile.matches_this_week.all()
                        else None
                    )
                    user_profile.shadowed.remove(
                        request_user_profile
                        if request_user_profile in user_profile.shadowed.all()
                        else None
                    )
                    user_profile.skipped.remove(
                        request_user_profile
                        if request_user_profile in user_profile.skipped.all()
                        else None
                    )
                    request_user_profile.circle.remove(
                        user_profile
                        if user_profile in request_user_profile.circle.all()
                        else None
                    )
                return Response({"blocked": serializer.data["blocked"]})
            return Response(serializer.errors, status=400)
        case _:
            return Response({"error": "Invalid method"}, status=405)


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def shadow(request: Request) -> Response:
    """Shadow a user/Get shadowed users"""
    match request.method:
        case "GET":
            try:
                profile = SocialProfile.objects.get(user=request.user)
            except SocialProfile.DoesNotExist:
                return Response(
                    {"error": "User does not have a Social Profile"}, status=404
                )
            serializer = ShadowUsersSerializer(profile)
            return Response({"shadowed": serializer.data["shadowed"]})

        case "PATCH":
            request_user_profile = SocialProfile.objects.get(user=request.user)
            request.data["shadowed"] = [
                User.objects.get(username=uname).id
                for uname in request.data["shadowed"]
            ]
            serializer = ShadowUsersSerializer(request_user_profile, data=request.data)
            if serializer.is_valid():
                serializer.save()
                for id in request.data["shadowed"]:
                    user_profile = SocialProfile.objects.get(user__id=id)
                    if user_profile == request_user_profile:
                        return Response({"error": "Cannot shadow self"}, status=400)
                    if (
                        user_profile not in request_user_profile.matches_this_week.all()
                    ):
                        return Response(
                            {"error": "Cannot shadow a user not your match this week"},
                            status=400,
                        )
                    user_profile.matches_this_week.remove(
                        request_user_profile
                        if request_user_profile in user_profile.matches_this_week.all()
                        else None
                    )
                    user_profile.skipped.remove(
                        request_user_profile
                        if request_user_profile in user_profile.skipped.all()
                        else None
                    )
                return Response({"shadowed": serializer.data["shadowed"]})
            return Response(serializer.errors, status=400)
        case _:
            return Response({"error": "Invalid method"}, status=405)


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def skip(request: Request) -> Response:
    """Skip a user/Get skipped users"""
    match request.method:
        case "GET":
            try:
                profile = SocialProfile.objects.get(user=request.user)
            except SocialProfile.DoesNotExist:
                return Response(
                    {"error": "User does not have a Social Profile"}, status=404
                )
            serializer = SkippedUsersSerializer(profile)
            return Response({"skipped": serializer.data["skipped"]})

        case "PATCH":
            request_user_profile = SocialProfile.objects.get(user=request.user)

            request.data["skipped"] = [
                User.objects.get(username=name).id for name in request.data["skipped"]
            ]

            serializer = SkippedUsersSerializer(request_user_profile, data=request.data)
            if serializer.is_valid():
                serializer.save()
                for id in request.data["skipped"]:
                    user_profile = SocialProfile.objects.get(user__id=id)
                    if user_profile == request_user_profile:
                        return Response({"error": "Cannot skip self"}, status=400)
                    if (
                        user_profile not in request_user_profile.matches_this_week.all()
                    ):
                        return Response(
                            {"error": "Cannot skip a user not your match this week"},
                            status=400,
                        )
                    # this won't happen but this is fail safe for users trying to use the API directly
                    if user_profile in request_user_profile.shadowed.all():
                        return Response(
                            {"error": "Cannot skip a shadowed user"}, status=400
                        )
                    user_profile.matches_this_week.remove(
                        request_user_profile
                        if request_user_profile in user_profile.matches_this_week.all()
                        else None
                    )
                return Response({"skipped": serializer.data["skipped"]})
            return Response(serializer.errors, status=400)
        case _:
            return Response({"error": "Invalid method"}, status=405)
