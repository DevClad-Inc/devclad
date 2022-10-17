from decouple import config

from .base import *

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

CSRF_COOKIE_SAMESITE = "strict"


ACCOUNT_EMAIL_VERIFICATION = config(
    "ACCOUNT_EMAIL_VERIFICATION", default="mandatory", cast=str
)
