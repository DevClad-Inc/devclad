# Generated by Django 4.1.3 on 2022-11-24 04:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("social", "0005_alter_socialprofile_preferred_day_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="meetingroom",
            name="link",
        ),
    ]