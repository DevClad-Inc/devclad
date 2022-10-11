from users.models import Profile
from rest_framework import serializers
from social.models import SocialProfile
from users.validators import devType_validator, location_validator, purpose_validator
from timezone_field.rest_framework import TimeZoneSerializerField


class ReadWriteSerializerMethodField(serializers.SerializerMethodField):
    def __init__(self, method_name=None, **kwargs):
        self.method_name = method_name
        kwargs["source"] = "*"
        super(serializers.SerializerMethodField, self).__init__(**kwargs)

    def to_internal_value(self, data):
        return {self.field_name: data}


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
            "skipped",
            "blocked",
            "shadowed",
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
            "skipped",
            "shadowed",
            "blocked",
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
    circle = ReadWriteSerializerMethodField()

    class Meta:
        model = SocialProfile
        fields = ["circle"]

    def get_circle(self, obj):
        sp = SocialProfile.objects.get(user=obj.user)
        return sp.get_flat_values("circle_symmetrical")


class AddedSerializer(serializers.ModelSerializer):
    circle = serializers.SerializerMethodField()

    class Meta:
        model = SocialProfile
        fields = ["circle"]

    def get_circle(self, obj):
        sp = SocialProfile.objects.get(user=obj.user)
        return sp.get_flat_values("circle")


class UIDSerializer(serializers.Serializer):
    class Meta:
        models = Profile
        fields = ["uid"]


class MatchesThisWeekSerializer(serializers.ModelSerializer):
    matches_this_week = ReadWriteSerializerMethodField()

    class Meta:
        model = SocialProfile
        fields = ["matches_this_week"]
        read_only_fields = ["matches_this_week"]

    def get_matches_this_week(self, obj):
        sp = SocialProfile.objects.get(user=obj.user)
        return sp.get_flat_values("matches_this_week")


class SkippedUsersSerializer(serializers.ModelSerializer):
    skipped = ReadWriteSerializerMethodField()

    class Meta:
        model = SocialProfile
        fields = ["skipped"]

    def get_skipped(self, obj):
        sp = SocialProfile.objects.get(user=obj.user)
        return sp.get_flat_values("skipped")


class ShadowUsersSerializer(serializers.ModelSerializer):
    shadowed = ReadWriteSerializerMethodField()

    class Meta:
        model = SocialProfile
        fields = ["shadowed"]

    def get_shadowed(self, obj):
        sp = SocialProfile.objects.get(user=obj.user)
        return sp.get_flat_values("shadowed")


class BlockedUsersSerializer(serializers.ModelSerializer):
    blocked = ReadWriteSerializerMethodField()

    class Meta:
        model = SocialProfile
        fields = ["blocked"]

    def get_blocked(self, obj):
        sp = SocialProfile.objects.get(user=obj.user)
        print(sp.get_flat_values("blocked"), "blocked")
        return sp.get_flat_values("blocked")
