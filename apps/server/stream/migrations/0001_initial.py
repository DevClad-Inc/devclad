# Generated by Django 4.1.2 on 2022-10-11 06:46

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="StreamUser",
            fields=[
                (
                    "uid",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("token", models.CharField(default="", max_length=255)),
            ],
            options={
                "verbose_name": "Stream User",
                "verbose_name_plural": "Stream Users",
            },
        ),
    ]