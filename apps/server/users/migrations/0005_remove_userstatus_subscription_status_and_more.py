# Generated by Django 4.1.3 on 2022-11-16 14:20

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0004_userstatus_subscription_status"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="userstatus",
            name="subscription_status",
        ),
        migrations.CreateModel(
            name="SubscriptionStatus",
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
                    "status",
                    models.CharField(
                        choices=[
                            ("Free Trial", "Free Trial"),
                            ("Starter", "Starter"),
                            ("X", "X"),
                        ],
                        default="Free Trial",
                        max_length=64,
                    ),
                ),
                (
                    "subscription_id",
                    models.CharField(blank=True, max_length=64, null=True),
                ),
                ("customer_id", models.CharField(blank=True, max_length=64, null=True)),
                (
                    "user",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]