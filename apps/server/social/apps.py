from django.apps import AppConfig


class SocialConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "social"

    def ready(self):
        from django_q.tasks import schedule
        from django_q.models import Schedule

        schedules = [
            {
                "func": "social.tasks.assign_matches_this_week",
                "name": "Assign Match 1-on-1",
                "schedule_type": Schedule.CRON,
                "cron": "0 0 * * SUN",
                "repeats": -1,
            }
        ]

        for scheduleinfo in schedules:
            try:
                schedule(**scheduleinfo)
            except Exception as e:
                print(e)
