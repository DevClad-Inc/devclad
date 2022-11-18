from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.exceptions import ObjectDoesNotExist
from social.models import SocialProfile
from stream.models import StreamUser
from work.models import HackathonProfile, ProjectProfile

from .models import GithubOAuth, Profile, SubscriptionStatus, UserStatus

User = get_user_model()


@receiver(post_save, sender=User)
def create_profiles(sender, instance, created, **kwargs):
    match created:
        case True:
            # statuses
            UserStatus.objects.create(user=instance)
            SubscriptionStatus.objects.create(user=instance)
            # v1 profiles
            Profile.objects.create(user=instance)
            SocialProfile.objects.create(user=instance)
            # need for messaging
            StreamUser.objects.create(user=instance)
            # need for oauth
            GithubOAuth.objects.create(user=instance)
            # need for easily creating v2 features
            ProjectProfile.objects.create(user=instance)
            HackathonProfile.objects.create(user=instance)
    try:
        instance.userstatus.save()
        instance.subscriptionstatus.save()
        instance.githuboauth.save()
        instance.profile.save()
        instance.socialprofile.save()
        instance.streamuser.save()
        instance.projectprofile.save()
        instance.hackathonprofile.save()
    except ObjectDoesNotExist as DNE:
        match DNE:
            case UserStatus.DoesNotExist:
                UserStatus.objects.create(user=instance)
            case SubscriptionStatus.DoesNotExist:
                SubscriptionStatus.objects.create(user=instance)
            case GithubOAuth.DoesNotExist:
                GithubOAuth.objects.create(user=instance)
            case Profile.DoesNotExist:
                Profile.objects.create(user=instance)
            case SocialProfile.DoesNotExist:
                SocialProfile.objects.create(user=instance)
            case StreamUser.DoesNotExist:
                StreamUser.objects.create(user=instance)
            case ProjectProfile.DoesNotExist:
                ProjectProfile.objects.create(user=instance)
            case HackathonProfile.DoesNotExist:
                HackathonProfile.objects.create(user=instance)
            case _:
                pass


# todo: add a signal for an async task to send email to user (Welcome to DevClad!)
