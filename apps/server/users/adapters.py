from urllib.parse import urlsplit
from django.conf import settings
from django.urls import reverse
from django.contrib.sites.shortcuts import get_current_site
from allauth.account.adapter import DefaultAccountAdapter

# https://github.com/iMerica/dj-rest-auth/issues/17#issuecomment-606161091
class AccountAdapter(DefaultAccountAdapter):
    @staticmethod
    def get_email_confirmation_url(request, emailconfirmation):
        site = get_current_site(request)
        location = reverse("account_confirm_email", args=[emailconfirmation.key])

        bits = urlsplit(location)
        return (
            location
            if (bits.scheme and bits.netloc)
            else "{proto}://{domain}{url}".format(
                proto="http" if settings.DEBUG else "https",
                domain="localhost:5173" if settings.DEBUG else f"app.{site.domain}",
                url=location,
            )
        )
