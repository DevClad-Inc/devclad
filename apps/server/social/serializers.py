from users.models import Profile
from rest_framework import serializers
from social.models import SocialProfile
from users.validators import devType_validator, location_validator, purpose_validator
from timezone_field.rest_framework import TimeZoneSerializerField


class SocialProfileSerializer(serializers.ModelSerializer):
    timezone = TimeZoneSerializerField()
    purpose = serializers.CharField(validators=[purpose_validator])
    dev_type = serializers.CharField(validators=[devType_validator])
    location = serializers.CharField(validators=[location_validator])
    preferred_dev_type = serializers.CharField(validators=[devType_validator])

    class Meta:
        model = SocialProfile
        # removing preferred_timezone_deviation for now
        exclude = [
            "id",
            "user",
            "skipped_users",
            "blocked_users",
            "shadowed_users",
            "matches_this_week",
            "circle",
            "preferred_timezone_deviation",
            "available_this_week",
        ]


class AdditionalSPSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialProfile
        fields = ["video_call_friendly", "available_always_off"]


class SocialDisplayProfileSerializer(serializers.ModelSerializer):
    timezone = TimeZoneSerializerField()
    purpose = serializers.CharField(validators=[purpose_validator])
    dev_type = serializers.CharField(validators=[devType_validator])
    location = serializers.CharField(validators=[location_validator])
    preferred_dev_type = serializers.CharField(validators=[devType_validator])

    class Meta:
        model = SocialProfile
        # removing preferred_timezone_deviation for now
        exclude = [
            "id",
            "user",
            "skipped_users",
            "shadowed_users",
            "blocked_users",
            "matches_this_week",
            "circle",
            "preferred_timezone_deviation",
            "indirect_matching",
            "available_always_off",
            "available_this_week",
        ]


# Endpoint: /api/social/circle/
# PATCH: add/remove user from circle
# GET: get circle
class CircleSerializer(serializers.ModelSerializer):
    # manytomany field
    circle = serializers.PrimaryKeyRelatedField(
        many=True, queryset=SocialProfile.objects.all()
    )

    class Meta:
        model = SocialProfile
        fields = ["circle"]


class UIDSerializer(serializers.Serializer):
    class Meta:
        models = Profile
        fields = ["uid"]


class MatchesThisWeekSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialProfile
        fields = ["matches_this_week"]
        read_only_fields = ["matches_this_week"]


class SkippedUsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialProfile
        fields = ["skipped_users"]


class ShadowUsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialProfile
        fields = ["shadowed_users"]


class BlockedUsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialProfile
        fields = ["blocked_users"]
