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
        read_only_fields = ["attended"]

    def get_invites(self, obj):
        meeting = MeetingRoom.objects.get(uid=obj.uid)
        return meeting.get_flat_values("invites")

    def validate_organizer(self, value):
        match (value == User.objects.get(username=self.context["request"].user)):
            case True:
                return value
            case _:
                raise serializers.ValidationError(
                    "You cannot create a meeting for another user"
                )

    def validate_invites(self, value):
        match (len(value["invites"]) == 1):
            case True:
                invite = value["invites"][0]
                is_self = invite == self.context["request"].user.id
                is_in_circle = invite in self.context[
                    "request"
                ].user.socialprofile.circle_symmetrical.all().values_list(
                    "id", flat=True
                )
                is_match = invite in self.context[
                    "request"
                ].user.socialprofile.matches_this_week.all().values_list(
                    "id", flat=True
                )
                match (is_in_circle or is_match or is_self):
                    case True:
                        self.context["request"].data["invites"].append(
                            self.context["request"].user.id
                        )
                    case _:
                        raise serializers.ValidationError(
                            "User is not in your circle or matches this week."
                        )
            case _:
                raise serializers.ValidationError(
                    "Maximum number of invites is 1 for this meeting type"
                )
        return value

    def validate_type_of(self, value):
        TYPES = ["Catch up 1:1", "1:1 Match"]
        if value in TYPES:
            return value
        else:
            raise serializers.ValidationError("Invalid meeting type")
