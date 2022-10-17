# serializer for user
from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError as DjangoValidationError
from django.contrib.auth import get_user_model
from allauth.account import app_settings as allauth_settings
from allauth.utils import email_address_exists
from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email
from dj_rest_auth.serializers import PasswordResetSerializer

from django.contrib.auth.password_validation import validate_password
from django.conf import settings

from users.models import Profile, UserStatus, User
from users.forms import CustomAllAuthPasswordResetForm
from users.validators import image_size_validator, validate_email


User = get_user_model()

# Custom RegistrationSerializer; with first and last name + possible future changes.
# From https://github.com/iMerica/dj-rest-auth/blob/master/dj_rest_auth/registration/serializers.py#L197
class RegisterSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=30, required=True, write_only=True)
    last_name = serializers.CharField(max_length=30, required=True, write_only=True)
    email = serializers.EmailField(required=allauth_settings.EMAIL_REQUIRED)
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    @staticmethod
    def validate_username(username):
        username = get_adapter().clean_username(username)
        return username

    @staticmethod
    def validate_email(email):
        email = get_adapter().clean_email(email)
        if allauth_settings.UNIQUE_EMAIL and email and email_address_exists(email):
            raise serializers.ValidationError(
                _("A user is already registered with this e-mail address."),
            )
        return email

    @staticmethod
    def validate_password1(password):
        return get_adapter().clean_password(password)

    @staticmethod
    def validate(data):
        if data["password1"] != data["password2"]:
            raise serializers.ValidationError(
                _("The two password fields didn't match.")
            )

        return data

    def custom_signup(self, request, user):
        pass

    def get_cleaned_data(self):
        return {
            "first_name": self.validated_data.get("first_name", ""),
            "last_name": self.validated_data.get("last_name", ""),
            "username": self.validated_data.get("username", ""),
            "password1": self.validated_data.get("password1", ""),
            "email": self.validated_data.get("email", ""),
        }

    def save(self, request):
        adapter = get_adapter()
        user = adapter.new_user(request)
        self.cleaned_data = self.get_cleaned_data()
        user = adapter.save_user(request, user, self, commit=False)
        if "password1" in self.cleaned_data:
            try:
                adapter.clean_password(self.cleaned_data["password1"], user=user)
                validate_password(self.cleaned_data["password1"], user=user)
            except DjangoValidationError as exc:
                raise serializers.ValidationError(
                    detail=serializers.as_serializer_error(exc)
                ) from exc

        user.save()
        self.custom_signup(request, user)
        setup_user_email(request, user, [])
        return user


class CustomPasswordResetSerializer(PasswordResetSerializer):
    @property
    def password_reset_form_class(self):
        return CustomAllAuthPasswordResetForm


class ProfileSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(
        allow_empty_file=False,
        use_url=settings.UPLOADED_FILES_USE_URL,
        validators=[image_size_validator],
    )

    class Meta:
        model = Profile
        exclude = ["user", "uid"]


class DisplayProfileSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(
        allow_empty_file=False,
        use_url=settings.UPLOADED_FILES_USE_URL,
        validators=[image_size_validator],
    )
    first_name = serializers.CharField(source="user.first_name")
    last_name = serializers.CharField(source="user.last_name")

    class Meta:
        model = Profile
        exclude = ["user", "uid"]


class UserStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserStatus
        fields = ["status", "approved"]
        read_only_fields = ["approved"]


class UserEmailSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True, validators=[validate_email])

    class Meta:
        model = User
        fields = ["email"]
