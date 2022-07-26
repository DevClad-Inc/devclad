# Generated by Django 4.1.2 on 2022-10-30 13:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("social", "0003_meetingroom"),
    ]

    operations = [
        migrations.AddField(
            model_name="socialprofile",
            name="preferred_day",
            field=models.CharField(
                choices=[
                    ("Sunday", "Sunday"),
                    ("Monday", "Monday"),
                    ("Tuesday", "Tuesday"),
                    ("Wednesday", "Wednesday"),
                    ("Thursday", "Thursday"),
                    ("Friday", "Friday"),
                    ("Saturday", "Saturday"),
                ],
                default="Monday",
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name="socialprofile",
            name="preferred_time",
            field=models.CharField(
                choices=[
                    ("Morning", "6AM to 12PM"),
                    ("Afternoon", "12PM TO 4PM"),
                    ("Evening", "4PM TO 7PM"),
                    ("Night", "7PM TO 11PM"),
                    ("Anytime", "Anytime"),
                ],
                default="Morning",
                max_length=20,
            ),
        ),
        migrations.AlterField(
            model_name="socialprofile",
            name="available_this_week",
            field=models.BooleanField(default=True),
        ),
    ]
