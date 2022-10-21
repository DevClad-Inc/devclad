from decouple import config
from .base import *

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOW_CREDENTIALS = True

SESSION_COOKIE_SECURE = True
SESSION_COOKIE_DOMAIN = "localhost"
SESSION_COOKIE_SAMESITE = "None"
SESSION_COOKIE_NAME = "local-session"

ACCOUNT_EMAIL_VERIFICATION = config(
    "ACCOUNT_EMAIL_VERIFICATION", default="mandatory", cast=str
)

REDIRECT_URL = config("REDIRECT_URL", default="http://localhost:5173", cast=str)
