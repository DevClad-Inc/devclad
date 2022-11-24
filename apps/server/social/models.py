import uuid
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
    DAYS_OF_WEEK = [
        ("Sunday", "Sunday"),
        ("Monday", "Monday"),
        ("Tuesday", "Tuesday"),
        ("Wednesday", "Wednesday"),
        ("Thursday", "Thursday"),
        ("Friday", "Friday"),
        ("Saturday", "Saturday"),
        ("Any Day", "Any Day"),
    ]
    TIMES_OF_DAY = [
        ("6AM - 12PM", "6AM - 12PM"),
        ("12PM - 4PM", "12PM - 4PM"),
        ("4PM - 8PM", "4PM - 8PM"),
        ("8PM - 12AM", "8PM - 12AM"),
        ("12AM - 6AM", "12AM - 6AM"),
        ("Anytime", "Anytime"),
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
    preferred_day = models.CharField(
        choices=DAYS_OF_WEEK, default="Any Day", max_length=20
    )
    preferred_time = models.CharField(
        choices=TIMES_OF_DAY, default="Anytime", max_length=20
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
    available_this_week = models.BooleanField(
        default=True
    )  # keep to True for now | change to False after hitting 1000 users
    available_always_off = models.BooleanField(
        default=False
    )  # if this is true, the user is not available this week until they change it
    indirect_matching = models.BooleanField(default=True)
    matches_this_week = models.ManyToManyField("self", blank=True)
    skipped = models.ManyToManyField("self", blank=True)  # clear every 4 weeks
    shadowed = models.ManyToManyField("self", blank=True)  # never clear
    blocked = models.ManyToManyField("self", blank=True)
    circle = models.ManyToManyField(
        "self", blank=True, symmetrical=False, related_name="circle_symmetrical"
    )

    def __str__(self: "SocialProfile") -> str:
        return self.user.username

    def get_flat_values(self: "SocialProfile", field: str) -> list:
        match field:
            case "circle_symmetrical":
                """because circle is assymetrical by default, adding the user does not add them to your circle.
                adding is being managed by the views so only certain cases allow adding in circle 2-way"""
                list_one = self.circle_symmetrical.all()
                list_two = self.circle.all()
                intersect = list(set(list_one) & set(list_two))
                return [user.user.username for user in intersect]
            case _:
                model_field = getattr(self, field)
                return model_field.all().values_list("user__username", flat=True)


class MeetingRoom(models.Model):
    uid = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        unique=True,
    )
    name = models.CharField(max_length=512, default="1:1 Meeting")
    TYPE = [
        ("1:1 Match", "1:1 Match"),
        ("Catch up 1:1", "Catch up 1:1"),
    ]
    organizer = models.ForeignKey(User, on_delete=models.CASCADE)
    invites = models.ManyToManyField(
        User, default=None, blank=True, related_name="invites"
    )
    type_of = models.CharField(default="1:1 Match", max_length=128, choices=TYPE)
    time = models.DateTimeField(default=None)
    attended = models.BooleanField(default=False)

    def __str__(self) -> str:
        return f"{self.name}"

    def get_flat_values(self: "MeetingRoom", field: str) -> list:
        model_field = getattr(self, field)
        return model_field.all().values_list("username", flat=True)
