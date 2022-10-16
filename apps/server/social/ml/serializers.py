from rest_framework import serializers
from social.models import SocialProfile

from social.serializers import ReadWriteSerializerMethodField


class MatchesThisWeekSerializer(serializers.ModelSerializer):
    matches_this_week = ReadWriteSerializerMethodField()

    class Meta:
        model = SocialProfile
        fields = ["matches_this_week"]
        read_only_fields = ["matches_this_week"]

    def get_matches_this_week(self, obj):
        sp = SocialProfile.objects.get(user=obj.user)
        return sp.get_flat_values("matches_this_week")
