from django.db import models
from django.conf import settings
from django.db.models import UniqueConstraint
from django.contrib.auth.models import AbstractUser
from django.core.validators import validate_image_file_extension
from django.core.exceptions import ValidationError
from django.db.models.functions import Lower
import uuid
import boto3
import requests


class User(AbstractUser):
    pass

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
        # constraint throws IntegrityError if username is not unique
        constraints = [UniqueConstraint(Lower("username"), name="unique_username")]


def file_size(
    value: bytes,
) -> bytes or None:  # maybe change to "bytes | ValidationError"?
    limit = 8 * 1024 * 1024
    if value.size > limit:
        raise ValidationError("File too large. Size should not exceed 8 MiB.")
    return value


def random_avatar() -> str:
    name = str(uuid.uuid4())[:8]
    url = requests.get("https://userpics.devclad.com/api/getpic")
    response = requests.get(url.text, stream=True)
    if settings.ENVIRONMENT == "DEVELOPMENT":
        with open(f"media/avatars/{name}.png", "wb+") as f:
            if not response.ok:
                raise Exception("Could not get avatar")
            for block in response.iter_content(1024):
                if not block:
                    break
                f.write(block)
    else:
        s3Client = boto3.client(
            "s3",
            region_name="us-east-1",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        )
        bucket = "devclad"
        s3Client.put_object(
            Bucket=bucket,
            Key=f"media/avatars/{name}.png",
            Body=response.raw.read(),
            ContentType="image/png",
        )
    return f"avatars/{name}.png"


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    uid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    avatar = models.ImageField(
        upload_to="avatars/",
        default=random_avatar,
        validators=[validate_image_file_extension, file_size],
    )
    pronouns = models.CharField(max_length=20, default="he/him")
    about = models.CharField(max_length=255, default="")
    website = models.URLField(blank=True)
    linkedin = models.URLField(blank=True)
    calendly = models.URLField(blank=True)

    def __str__(self: "Profile") -> str:
        return self.user.username

    # might not need this if we directly upload to Cloudflare from client
    def get_avatar_url(self: "Profile") -> str:
        return self.avatar.url


class SubscriptionStatus(models.Model):
    """Will be managed using Stripe"""

    SUBSCRIPTION_STATUS = [
        ("Free Trial", "Free Trial"),
        ("Starter", "Starter"),
        ("X", "X"),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    status = models.CharField(
        choices=SUBSCRIPTION_STATUS, default="Free Trial", max_length=64
    )
    subscription_id = models.CharField(max_length=64, blank=True, null=True)
    customer_id = models.CharField(max_length=64, blank=True, null=True)
    """
    trial length, billing frequency, billing period, and billing cycle anchor are managed by Stripe
    """

    def __str__(self: "SubscriptionStatus") -> str:
        return f"{self.user.username} - {self.status}"


class UserStatus(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=255,
        default="Not Submitted",
        choices=[
            ("Submitted", "Submitted"),
            ("Not Submitted", "Not Submitted"),
        ],
    )
    approved = models.BooleanField(default=False)
    count = models.IntegerField(default=0, blank=True)
    # count is number of times user has submitted profile and it has been under review
    class Meta:
        verbose_name = "User Status"
        verbose_name_plural = "User Statuses"

    def __str__(self: "UserStatus") -> str:
        return self.user.username


class GithubOAuth(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    username = models.CharField(max_length=255, blank=True)
    access_token = models.CharField(max_length=255, default="")
    access_token_workspaces = models.CharField(
        max_length=255, default=""
    )  # access token with advanced permissions for workspaces feature

    class Meta:
        verbose_name = "Github OAuth Token"
        verbose_name_plural = "Github OAuth Tokens"

    def __str__(self: "GithubOAuth") -> str:
        return self.user.username
