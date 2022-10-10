from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MaxValueValidator, MinValueValidator

from timezone_field import TimeZoneField

User = get_user_model()


class SocialProfile(models.Model):
    DEV_TYPE_CHOICES = [
        ("Mobile/Web", "Mobile/Web"),
        ("Native Desktop", "Native Desktop"),
        ("Game Development", "Game Development"),
        ("Systems", "Systems"),
        ("Hardware", "Hardware"),
        ("Blockchain", "Blockchain"),
        ("AI", "AI"),
        ("Other", "Other"),
    ]
    IDEA_STATUS_CHOICES = [
        ("Open to exploring ideas.", "Open to exploring ideas."),
        ("Not open to exploring ideas.", "Not open to exploring ideas."),
        ("Need people working on my idea.", "Need people working on my idea."),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    video_call_friendly = models.BooleanField(default=True)
    languages = models.CharField(max_length=64, blank=True)  # up to 5
    location = models.CharField(max_length=64, blank=True)
    raw_xp = models.IntegerField(
        default=0, blank=True, validators=[MinValueValidator(0), MaxValueValidator(50)]
    )
    purpose = models.CharField(max_length=255, blank=True)
    timezone = TimeZoneField(default="America/Los_Angeles")
    preferred_timezone_deviation = models.CharField(
        choices=[
            ("+/- 0", "+/- 0"),
            ("+/- 2", "+/- 2"),
            ("+/- 4", "+/- 4"),
            ("+/- 6", "+/- 6"),
            ("+/- 8", "+/- 8"),
            ("Any", "Any"),
        ],
        default="Any",
        max_length=5,
    )
    dev_type = models.CharField(
        max_length=128,
        blank=True,
    )
    preferred_dev_type = models.CharField(
        max_length=64,
        blank=True,
        choices=DEV_TYPE_CHOICES,
    )  # more like a filter for the matches applied at the end
    idea_status = models.CharField(
        max_length=64, blank=True, choices=IDEA_STATUS_CHOICES
    )
    # CALCULATION PURPOSE FIELDS:
    available_this_week = models.BooleanField(default=False)
    available_always_off = models.BooleanField(
        default=False
    )  # if this is true, the user is not available this week until they change it
    indirect_matching = models.BooleanField(default=True)
    matches_this_week = models.ManyToManyField("self", blank=True)
    skipped_users = models.ManyToManyField("self", blank=True)  # clear every 4 weeks
    shadowed_users = models.ManyToManyField("self", blank=True)  # never clear
    blocked_users = models.ManyToManyField("self", blank=True)
    circle = models.ManyToManyField("self", blank=True, symmetrical=False)
    # todo: option to remove from circle;

    def __str__(self):
        return self.user.username
