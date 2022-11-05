from django.db.models.signals import post_save
from django.contrib.auth import get_user_model
from django.dispatch import receiver
from .models import Profile, UserStatus, GithubOAuth
from social.models import SocialProfile
from work.models import ProjectProfile, HackathonProfile
from stream.models import StreamUser

User = get_user_model()


@receiver(post_save, sender=User)
def create_profiles(sender, instance, created, **kwargs):
    match created:
        case True:
            UserStatus.objects.create(user=instance)
            GithubOAuth.objects.create(user=instance)
            Profile.objects.create(user=instance)
            SocialProfile.objects.create(user=instance)
            StreamUser.objects.create(user=instance)
            ProjectProfile.objects.create(user=instance)
            HackathonProfile.objects.create(user=instance)
    try:
        instance.userstatus.save()
    except:
        UserStatus.objects.create(user=instance)
    try:
        instance.githuboauth.save()
    except:
        GithubOAuth.objects.create(user=instance)
    try:
        instance.profile.save()
    except:
        Profile.objects.create(user=instance)
    try:
        instance.socialprofile.save()
    except:
        SocialProfile.objects.create(user=instance)
    try:
        instance.streamuser.save()
    except:
        StreamUser.objects.create(user=instance)
    try:
        instance.projectprofile.save()
    except:
        ProjectProfile.objects.create(user=instance)
    try:
        instance.hackathonprofile.save()
    except:
        HackathonProfile.objects.create(user=instance)


# todo: add a signal for an async task to send email to user (Welcome to DevClad!)
