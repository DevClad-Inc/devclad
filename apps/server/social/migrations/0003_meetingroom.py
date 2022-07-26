# Generated by Django 4.1.2 on 2022-10-16 19:18

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("social", "0002_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="MeetingRoom",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "uid",
                    models.UUIDField(default=uuid.uuid4, editable=False, unique=True),
                ),
                ("name", models.CharField(default="1:1 Meeting", max_length=512)),
                ("link", models.CharField(blank=True, max_length=256, null=True)),
                (
                    "type_of",
                    models.CharField(
                        choices=[
                            ("1:1 Match", "1:1 Match"),
                            ("Catch up 1:1", "Catch up 1:1"),
                        ],
                        default="1:1 Match",
                        max_length=128,
                    ),
                ),
                ("time", models.DateTimeField(default=None)),
                ("attended", models.BooleanField(default=False)),
                (
                    "invites",
                    models.ManyToManyField(
                        blank=True,
                        default=None,
                        related_name="invites",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "organizer",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]
