from decouple import config
from .base import *

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
        "OPTIONS": {"min_length": 4},
    }
]

CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOW_CREDENTIALS = True

SESSION_COOKIE_SECURE = config("SESSION_COOKIE_SECURE", default=False, cast=bool)
SESSION_COOKIE_DOMAIN = "127.0.0.1"
SESSION_COOKIE_SAMESITE = "Strict"
SESSION_COOKIE_NAME = "local-session"

ACCOUNT_EMAIL_VERIFICATION = config(
    "ACCOUNT_EMAIL_VERIFICATION", default="none", cast=str
)

# AWS_QUERYSTRING_AUTH = False

# AWS_ACCESS_KEY_ID = config("AWS_ACCESS_KEY_ID", default="", cast=str)
# AWS_SECRET_ACCESS_KEY = config("AWS_SECRET_ACCESS_KEY", default="", cast=str)
# AWS_STORAGE_BUCKET_NAME = "devclad"  # hc
# AWS_S3_REGION_NAME = "us-east-1"
# AWS_S3_SIGNATURE_VERSION = "s3v4"

# AWS_S3_FILE_OVERWRITE = False
# AWS_DEFAULT_ACL = "public-read"
# AWS_HEADERS = {"Cache-Control": "public, max-age=1209600"}
# DEFAULT_FILE_STORAGE = "storages.backends.s3boto3.S3Boto3Storage"
# STATICFILES_STORAGE = "storages.backends.s3boto3.S3StaticStorage"
