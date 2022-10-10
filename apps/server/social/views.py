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
    BlockedUsersSerializer,
    ShadowUsersSerializer,
    SkippedUsersSerializer,
)

User = get_user_model()


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def profile(request):
    """
    Determine if the user is authenticated and return their SocialProfile
    """
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
    """
    Manage user's additional 1on1 preferences
    """
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
    """
    Social Profile of user visible to other users
    """
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
    """
    Determine if social profile of user is complete
    """
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
            match_case = all([field in serializer.data for field in required_fields])
            return Response({"is_complete": match_case})
        case _:
            return Response({"error": "Invalid method"}, status=405)


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def circle(request: Request, username: str, operation: str) -> Response:
    """
    Perform operations on a user's circle
    """
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
                    username_list = []
                    serializer = CircleSerializer(profile)
                    username_list.extend(
                        User.objects.get(id=id).username
                        for id in serializer.data["circle"]
                    )
                    return Response({"circle": username_list})
                case _:
                    return Response({"error": "Invalid operation"}, status=400)

        case "PATCH":
            username_list = []
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
                    user_circle = request_user_profile.circle.all()

                    for username in request.data["circle"]:
                        user_profile = SocialProfile.objects.get(
                            user__username=username
                        )
                        if user_profile not in (matches_this_week | user_circle):
                            return Response(
                                {"error": "User not in matches this week"}, status=400
                            )
                        elif user_profile == request_user_profile:
                            return Response(
                                {"error": "Cannot add self to circle"}, status=400
                            )

                    request.data["circle"] = [
                        User.objects.get(username=name).id
                        for name in request.data["circle"]
                    ]

                    serializer = CircleSerializer(
                        request_user_profile, data=request.data
                    )

                    match serializer.is_valid():
                        case True:
                            serializer.save()
                            other_user_profile.circle.add(request_user_profile)
                            username_list.extend(
                                User.objects.get(id=id).username
                                for id in serializer.data["circle"]
                            )
                            return Response({"circle": username_list})
                        case False:
                            return Response(serializer.errors, status=400)

                case "remove":
                    request.data["circle"] = [
                        User.objects.get(username=name).id
                        for name in request.data["circle"]
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
                            username_list.extend(
                                User.objects.get(id=id).username
                                for id in serializer.data["circle"]
                            )
                            return Response({"circle": username_list})
                        case False:
                            return Response(serializer.errors, status=400)
                case _:
                    return Response({"error": "Invalid operation"}, status=400)
        case _:
            return Response({"error": "Invalid method"}, status=405)


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def block(request: Request) -> Response:
    """
    Block a user/Get blocked users
    """
    match request.method:
        case "GET":
            try:
                profile = SocialProfile.objects.get(user=request.user)
            except SocialProfile.DoesNotExist:
                return Response(
                    {"error": "User does not have a Social Profile"}, status=404
                )
            username_list = []
            serializer = BlockedUsersSerializer(profile)
            username_list.extend(
                User.objects.get(id=id).username
                for id in serializer.data["blocked_users"]
            )
            return Response({"blocked_users": username_list})

        case "PATCH":
            username_list = []
            request_user_profile = SocialProfile.objects.get(user=request.user)
            request.data["blocked_users"] = [
                User.objects.get(username=name).id
                for name in request.data["blocked_users"]
            ]
            serializer = BlockedUsersSerializer(request_user_profile, data=request.data)
            if serializer.is_valid():
                serializer.save()
                for user_id in request.data["blocked_users"]:
                    user_profile = SocialProfile.objects.get(user__id=user_id)
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
                    user_profile.shadowed_users.remove(
                        request_user_profile
                        if request_user_profile in user_profile.shadowed_users.all()
                        else None
                    )
                    user_profile.skipped_users.remove(
                        request_user_profile
                        if request_user_profile in user_profile.skipped_users.all()
                        else None
                    )
                    request_user_profile.circle.remove(
                        user_profile
                        if user_profile in request_user_profile.circle.all()
                        else None
                    )
                username_list.extend(
                    User.objects.get(id=id).username
                    for id in serializer.data["blocked_users"]
                )
                return Response({"blocked_users": username_list})
            return Response(serializer.errors, status=400)
        case _:
            return Response({"error": "Invalid method"}, status=405)


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def shadow(request: Request) -> Response:
    """
    Shadow a user/Get shadowed users
    """
    match request.method:
        case "GET":
            try:
                profile = SocialProfile.objects.get(user=request.user)
            except SocialProfile.DoesNotExist:
                return Response(
                    {"error": "User does not have a Social Profile"}, status=404
                )
            username_list = []
            serializer = ShadowUsersSerializer(profile)
            username_list.extend(
                User.objects.get(id=id).username
                for id in serializer.data["shadowed_users"]
            )
            return Response({"shadowed_users": username_list})

        case "PATCH":
            username_list = []
            request_user_profile = SocialProfile.objects.get(user=request.user)
            request.data["shadowed_users"] = [
                User.objects.get(username=name).id
                for name in request.data["shadowed_users"]
            ]
            serializer = ShadowUsersSerializer(request_user_profile, data=request.data)
            if serializer.is_valid():
                serializer.save()
                for user_id in request.data["shadowed_users"]:
                    user_profile = SocialProfile.objects.get(user__id=user_id)
                    if user_profile == request_user_profile:
                        return Response({"error": "Cannot shadow self"}, status=400)
                    elif (
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
                    user_profile.skipped_users.remove(
                        request_user_profile
                        if request_user_profile in user_profile.skipped_users.all()
                        else None
                    )

                username_list.extend(
                    User.objects.get(id=id).username
                    for id in serializer.data["shadowed_users"]
                )
                return Response({"shadowed_users": username_list})
            return Response(serializer.errors, status=400)
        case _:
            return Response({"error": "Invalid method"}, status=405)


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def skip(request: Request) -> Response:
    """
    Skip a user/Get skipped users
    """
    match request.method:
        case "GET":
            try:
                profile = SocialProfile.objects.get(user=request.user)
            except SocialProfile.DoesNotExist:
                return Response(
                    {"error": "User does not have a Social Profile"}, status=404
                )
            username_list = []
            serializer = SkippedUsersSerializer(profile)
            username_list.extend(
                User.objects.get(id=id).username
                for id in serializer.data["skipped_users"]
            )
            return Response({"skipped_users": username_list})

        case "PATCH":
            username_list = []
            request_user_profile = SocialProfile.objects.get(user=request.user)
            request.data["skipped_users"] = [
                User.objects.get(username=name).id
                for name in request.data["skipped_users"]
            ]
            serializer = SkippedUsersSerializer(request_user_profile, data=request.data)
            if serializer.is_valid():
                serializer.save()
                for user_id in request.data["skipped_users"]:
                    user_profile = SocialProfile.objects.get(user__id=user_id)
                    if user_profile == request_user_profile:
                        return Response({"error": "Cannot skip self"}, status=400)
                    elif (
                        user_profile not in request_user_profile.matches_this_week.all()
                    ):
                        return Response(
                            {"error": "Cannot skip a user not your match this week"},
                            status=400,
                        )
                    # this won't happen but this is fail safe for users trying to use the API directly
                    elif user_profile in request_user_profile.shadowed_users.all():
                        return Response(
                            {"error": "Cannot skip a shadowed user"}, status=400
                        )
                    user_profile.matches_this_week.remove(
                        request_user_profile
                        if request_user_profile in user_profile.matches_this_week.all()
                        else None
                    )
                username_list.extend(
                    User.objects.get(id=id).username
                    for id in serializer.data["skipped_users"]
                )
                return Response({"skipped_users": username_list})
            return Response(serializer.errors, status=400)
        case _:
            return Response({"error": "Invalid method"}, status=405)
