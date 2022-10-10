from django.db import models
from users.models import User
from django.core.validators import MaxValueValidator, MinValueValidator

# Create your models here.


class ProjectProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    base_time_commitment = models.IntegerField(
        default=2, blank=True, validators=[MinValueValidator(0), MaxValueValidator(50)]
    )
    purpose = models.CharField(max_length=64, blank=True)
    # current_teams, active_applications, favorite_projects


class HackathonProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # past_hackathons, highlight_hackathon, current_team, active_applications, favorite_hackathons
