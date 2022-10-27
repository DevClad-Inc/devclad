from django.db.models.signals import post_save
from django.contrib.auth import get_user_model
from django.dispatch import receiver
from .models import Profile, UserStatus
from social.models import SocialProfile
from work.models import ProjectProfile, HackathonProfile
from stream.models import StreamUser

User = get_user_model()


@receiver(post_save, sender=User)
def create_profiles(sender, instance, created, **kwargs):
    match created:
        case True:
            UserStatus.objects.create(user=instance)
            Profile.objects.create(user=instance)
            SocialProfile.objects.create(user=instance)
            StreamUser.objects.create(user=instance)
            ProjectProfile.objects.create(user=instance)
            HackathonProfile.objects.create(user=instance)
            # todo: Create a user instance for Twilio video
            # account_sid = settings.TWILIO_ACCT_SID
            # auth_token = settings.TWILIO_AUTH_TOKEN
            # client = Client(account_sid, auth_token)
            # with contextlib.suppress(Exception):
            #     client.conversations.users.create(identity=instance.username.lower())
    instance.userstatus.save()
    instance.profile.save()
    instance.socialprofile.save()
    instance.streamuser.save()
    instance.projectprofile.save()
    instance.hackathonprofile.save()


# todo: add a signal for an async task to send email to user (Welcome to DevClad!)
