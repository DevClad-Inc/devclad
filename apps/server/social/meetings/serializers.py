from rest_framework import serializers
from social.models import MeetingRoom, SocialProfile
from social.serializers import ReadWriteSerializerMethodField
from django.contrib.auth import get_user_model

User = get_user_model()

#! the createsu creates the admin user but it sort of fucked up the pk/id sync of users and socialprofiles
#! so, the code contains fixes for that

"""
- using invite_profile to reference the SP user; not a nasty workaround but modification from existing code.
"""


class MeetingSerializer(serializers.ModelSerializer):
    invites = ReadWriteSerializerMethodField()
    invite_emails = serializers.SerializerMethodField()
    type_of = serializers.CharField()

    class Meta:
        model = MeetingRoom
        fields = "__all__"
        read_only_fields = ["attended", "invite_emails"]

    @staticmethod
    def get_invites(obj):
        meeting = MeetingRoom.objects.get(uid=obj.uid)
        return meeting.get_flat_values("invites")

    @staticmethod
    def get_invite_emails(obj):
        meeting = MeetingRoom.objects.get(uid=obj.uid)
        meeting_users = meeting.get_flat_values("invites")
        return [User.objects.get(username=user).email for user in meeting_users]

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
                invite_profile = SocialProfile.objects.get(user=invite).pk
                circle_list = (
                    self.context["request"]
                    .user.socialprofile.matches_this_week.all()
                    .values_list("id", flat=True)
                )
                match_list = (
                    self.context["request"]
                    .user.socialprofile.matches_this_week.all()
                    .values_list("id", flat=True)
                )

                is_in_circle = invite_profile in circle_list
                is_match = invite_profile in match_list
                match (is_in_circle or is_match or is_self):
                    case True:
                        self.context["request"].data["invites"].append(
                            User.objects.get(username=self.context["request"].user).id
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

    @staticmethod
    def validate_type_of(value):
        TYPES = ["Catch up 1:1", "1:1 Match"]
        if value in TYPES:
            return value
        raise serializers.ValidationError("Invalid meeting type")
