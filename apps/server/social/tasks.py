from django_q.tasks import schedule
from django_q.models import Schedule

from django.contrib.auth import get_user_model

import rollbar

from social.models import SocialProfile
from social.ml.match import get_one_one_match

User = get_user_model()

"""
1. `available_this_week` is set to True for all users. (excluding available_always_off=True)
2. `matches_this_week` is set to empty for all users.

3. For availability = True; assign matches_this_week.
4. Set available_this_week = False for all users with matches_this_week.
"""


def assign_matches_this_week():
    try:
        SocialProfile.objects.filter(available_always_off=False).update(
            available_this_week=True
        )
        for profile in SocialProfile.objects.all():
            profile.matches_this_week.clear()
            profile.save()
        for social_profile in SocialProfile.objects.filter(
            available_this_week=True
        ).all():
            user = User.objects.get(id=social_profile.user.id)
            if match := get_one_one_match(user):
                matched_profile = SocialProfile.objects.get(user__id=match[0])
                social_profile.matches_this_week.add(matched_profile)
                social_profile.available_this_week = False
                social_profile.save()
                matched_profile.available_this_week = False
                matched_profile.save()
        SocialProfile.objects.filter(matches_this_week__isnull=False).update(
            available_this_week=False
        )
        rollbar.report_message("assign_matches_this_week")
        return True
    except Exception as e:
        print(e)
        rollbar.report_message("assign_matches_this_week failed")
        return False


# TODO: better LOGGING INTO ROLLBAR
