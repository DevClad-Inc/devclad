from rest_framework import serializers
from social.models import SocialProfile, MeetingRoom
from timezone_field.rest_framework import TimeZoneSerializerField
from django.contrib.auth import get_user_model

from social.serializers import ReadWriteSerializerMethodField

User = get_user_model()


class MeetingSerializer(serializers.ModelSerializer):
    organizer = serializers.CharField(source="organizer.username")
    invites = ReadWriteSerializerMethodField()
    type_of = serializers.CharField()

    class Meta:
        model = MeetingRoom
        exclude = ["attended"]

    def get_invites(self, obj):
        meeting = MeetingRoom.objects.get(uid=obj.uid)
        return meeting.get_flat_values("invites")

    def validate_invites(self, value):
        invite = SocialProfile.objects.get(user=value)
        print(invite)
        match_or_circle = (
            invite in self.context["request"].user.social_profile.circle.all()
            or invite
            in self.context["request"].user.social_profile.circle_symmetrical.all()
        )
        match match_or_circle:
            case True:
                return value
            case _:
                raise serializers.ValidationError(
                    "User is not in your circle or matches this week."
                )

    def validate_organizer(self, value):
        is_self = value == self.context["request"].user.username
        match is_self:
            case True:
                return value
            case _:
                raise serializers.ValidationError("User must be organizer of meeting.")

    def validate_type_of(self, value):
        TYPES = ["Catch up 1:1", "1:1 Match"]
        if value in TYPES:
            return value
        else:
            raise serializers.ValidationError("Invalid meeting type")
