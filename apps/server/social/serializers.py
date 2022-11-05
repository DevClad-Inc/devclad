from users.models import Profile
from users.validators import devType_validator, location_validator, purpose_validator
from rest_framework import serializers
from social.models import SocialProfile
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
            "available_always_off",
            "preferred_day",
            "preferred_time",
            "video_call_friendly",
            "indirect_matching",
        ]


class AdditionalSPSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialProfile
        fields = [
            "video_call_friendly",
            "available_always_off",
            "preferred_day",
            "preferred_time",
        ]


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
    circle = ReadWriteSerializerMethodField()

    class Meta:
        model = SocialProfile
        fields = ["circle"]

    @staticmethod
    def get_circle(obj):
        sp = SocialProfile.objects.get(user=obj.user)
        return sp.get_flat_values("circle_symmetrical")


class AddedSerializer(serializers.ModelSerializer):
    circle = serializers.SerializerMethodField()

    class Meta:
        model = SocialProfile
        fields = ["circle"]
        read_only_fields = fields

    @staticmethod
    def get_circle(obj):
        sp = SocialProfile.objects.get(user=obj.user)
        return sp.get_flat_values("circle")


class UIDSerializer(serializers.Serializer):
    class Meta:
        models = Profile
        fields = ["uid"]


class SkippedUsersSerializer(serializers.ModelSerializer):
    skipped = ReadWriteSerializerMethodField()

    class Meta:
        model = SocialProfile
        fields = ["skipped"]

    @staticmethod
    def get_skipped(obj):
        sp = SocialProfile.objects.get(user=obj.user)
        return sp.get_flat_values("skipped")


class ShadowUsersSerializer(serializers.ModelSerializer):
    shadowed = ReadWriteSerializerMethodField()

    class Meta:
        model = SocialProfile
        fields = ["shadowed"]

    @staticmethod
    def get_shadowed(obj):
        sp = SocialProfile.objects.get(user=obj.user)
        return sp.get_flat_values("shadowed")


class BlockedUsersSerializer(serializers.ModelSerializer):
    blocked = ReadWriteSerializerMethodField()

    class Meta:
        model = SocialProfile
        fields = ["blocked"]

    @staticmethod
    def get_blocked(obj):
        sp = SocialProfile.objects.get(user=obj.user)
        return sp.get_flat_values("blocked")
