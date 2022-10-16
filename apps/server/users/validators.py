from rest_framework import serializers
from allauth.utils import email_address_exists, valid_email_or_none

devType = [
    "Mobile/Web",
    "Native Desktop",
    "Game Development",
    "Systems",
    "Hardware",
    "Blockchain",
    "AI",
    "Other",
]
purpose = [
    "Networking",
    "To find developers for an idea I have",
    "To Find projects to work on",
    "To participate in Hackathons",
    "This just seems cool",
]

countries = [
    "Australia",
    "Canada",
    "European Union",
    "Japan",
    "India",
    "Non EU Europe (excluding UK)",
    "United States of America",
    "United Kingdom",
    "South Korea",
    "Other",
]


def purpose_validator(value):
    value = value.split(", ")
    for v in value:
        if v not in purpose:
            raise serializers.ValidationError("Purpose is not valid")
        if value.count(v) > 1:
            raise serializers.ValidationError("You can't repeat purposes")
    return value


def devType_validator(value):
    value = value.split(", ")
    for v in value:
        if v not in devType:
            raise serializers.ValidationError("Development type is not valid")
        if value.count(v) > 1:
            raise serializers.ValidationError("You can't repeat development types")
    return value


def location_validator(value):
    # values is a string; should be present in countries list
    if value not in countries:
        raise serializers.ValidationError("Location is not valid")
    return value


def image_size_validator(value):
    if value.size > (1024 * 1024 * 5):
        raise serializers.ValidationError("Keep image size under 5MB")


def validate_email(value):
    print(value)
    if valid_email_or_none(value) is None:
        raise serializers.ValidationError("Email is not valid")
    if email_address_exists(value):
        raise serializers.ValidationError("Email already exists")
