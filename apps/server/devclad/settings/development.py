from decouple import config

from .base import *

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

CSRF_COOKIE_SAMESITE = "strict"

# JWT_AUTH_SECURE = True
# JWT_AUTH_SAMESITE = "strict"
# JWT_AUTH_COOKIE_USE_CSRF = True

ACCOUNT_EMAIL_VERIFICATION = config(
    "ACCOUNT_EMAIL_VERIFICATION", default="mandatory", cast=str
)
