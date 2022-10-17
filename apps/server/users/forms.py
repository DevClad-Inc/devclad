from dj_rest_auth.forms import AllAuthPasswordResetForm
from django.contrib.sites.shortcuts import get_current_site
from django.conf import settings
from django.urls import reverse
from allauth.account.forms import default_token_generator
from allauth.account import app_settings
from allauth.account.adapter import get_adapter
from allauth.account.utils import user_pk_to_url_str, user_username


class CustomAllAuthPasswordResetForm(AllAuthPasswordResetForm):
    # override save method to send email confirmation
    def save(self, request, **kwargs):
        current_site = get_current_site(request)
        current_site_domain = (
            "localhost:5173" if settings.DEBUG else f"app.{current_site.domain}"
        )
        email = self.cleaned_data["email"]
        protocol = "https" if request.is_secure() else "http"
        token_generator = kwargs.get("token_generator", default_token_generator)
        for user in self.users:
            temp_key = token_generator.make_token(user)
            path = reverse(
                "password_reset_confirm", args=[user_pk_to_url_str(user), temp_key]
            )
            context = {
                "current_site": current_site,
                "user": user,
                "domain": current_site_domain,
                "request": request,
                "path": path,
                "protocol": protocol,
            }

            if (
                app_settings.AUTHENTICATION_METHOD
                != app_settings.AuthenticationMethod.EMAIL
            ):
                context["username"] = user_username(user)
            get_adapter(request).send_mail(
                "account/email/password_reset_key", email, context
            )

        return self.cleaned_data["email"]
