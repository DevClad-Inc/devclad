from rest_framework import serializers
from social.models import SocialProfile, MeetingRoom
from timezone_field.rest_framework import TimeZoneSerializerField
from django.contrib.auth import get_user_model

from social.serializers import ReadWriteSerializerMethodField

User = get_user_model()


class MeetingSerializer(serializers.ModelSerializer):
    invites = ReadWriteSerializerMethodField()
    type_of = serializers.CharField()

    class Meta:
        model = MeetingRoom
        exclude = ["attended"]

    def get_invites(self, obj):
        meeting = MeetingRoom.objects.get(uid=obj.uid)
        return meeting.get_flat_values("invites")

    def validate_organizer(self, value):
        is_self = value == User.objects.get(username=self.context["request"].user)
        match is_self:
            case True:
                return value
            case _:
                raise serializers.ValidationError(
                    "You cannot create a meeting for another user"
                )

    def validate_invites(self, value):
        if self.context["request"].user.id not in value["invites"]:
            self.context["request"].data["invites"].append(
                self.context["request"].user.id
            )
        if len(value["invites"]) > 2:
            raise serializers.ValidationError(
                "You can only invite 2 people to a meeting"
            )
        for invite in value["invites"]:
            match_or_circle = (
                invite
                in self.context["request"]
                .user.socialprofile.matches_this_week.all()
                .values_list("id", flat=True)
                or invite
                in self.context["request"]
                .user.socialprofile.circle_symmetrical.all()
                .values_list("id", flat=True)
                or invite == self.context["request"].user.id
            )
            match match_or_circle:
                case False:
                    raise serializers.ValidationError(
                        "User is not in your circle or matches this week."
                    )
                case _:
                    pass
        return value

    def validate_type_of(self, value):
        TYPES = ["Catch up 1:1", "1:1 Match"]
        if value in TYPES:
            return value
        else:
            raise serializers.ValidationError("Invalid meeting type")
