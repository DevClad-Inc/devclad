from users.models import GithubOAuth
from rest_framework import serializers


class GithubOAuthSerializer(serializers.ModelSerializer):
    class Meta:
        model = GithubOAuth
        exclude = ["id", "user"]
