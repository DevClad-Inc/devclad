from datetime import timedelta
from pathlib import Path
from decouple import config
from corsheaders.defaults import default_headers

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config("DEBUG", default=False, cast=bool)
PRODUCTION = config("PRODUCTION", default=False, cast=bool)

# ALLOWED_HOST in .env as ALLOWED_HOSTS=name.com name.com name.com
ALLOWED_HOSTS = config(
    "ALLOWED_HOSTS",
    default="",
    cast=lambda allowed_hosts: [host.strip() for host in allowed_hosts.split(" ")],
)

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sites",
    # user apps
    "users.apps.UsersConfig",
    "social.apps.SocialConfig",
    "work.apps.WorkConfig",
    "stream.apps.StreamConfig",
    # REST Framework
    "rest_framework",
    "rest_framework.authtoken",
    # django-cors-headers
    "corsheaders",
    # SimpleJWT
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",
    # AUTH
    "dj_rest_auth",
    # ALLAUTH
    "allauth",
    "allauth.account",
    # Enable registration with allauth
    "dj_rest_auth.registration",
    # Social accounts
    "allauth.socialaccount",
    "allauth.socialaccount.providers.twitter",
    "django_q",
    # "graphene_django",
    "django_filters",
]

MIDDLEWARE = [
    # CORS
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    # 3rd-party ====
    "rollbar.contrib.django.middleware.RollbarNotifierMiddleware",
]

# ==== ROLLBAR ====

ROLLBAR = {
    "access_token": "879540db65a74364893afe8a882f05a6",
    "environment": "development" if PRODUCTION else "production",
    "root": BASE_DIR,
}
import rollbar

rollbar.init(**ROLLBAR)

# ==== ROLLBAR ====

ROOT_URLCONF = "devclad.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "devclad.wsgi.application"

# Using ARGON2 password hashing; do not remove argon2-cffi
PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.Argon2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher",
    "django.contrib.auth.hashers.BCryptSHA256PasswordHasher",
    "django.contrib.auth.hashers.ScryptPasswordHasher",
]

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
        "OPTIONS": {
            "user_attributes": ["first_name", "last_name", "email", "username"],
            "max_similarity": 0.6,
        },
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
        "OPTIONS": {"min_length": 10},
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.0/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.0/howto/static-files/

STATIC_URL = "static/"

# Default primary key field type
# https://docs.djangoproject.com/en/4.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

AUTH_USER_MODEL = "users.User"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR.parent / "media"

# ===== AUTHENTICATION =====

# for ALLAUTH
SITE_ID = 1


AUTHENTICATION_BACKENDS = [
    # Needed to login by username in Django admin, regardless of `allauth`
    "django.contrib.auth.backends.ModelBackend",
    # `allauth` specific authentication methods, such as login by e-mail
    "allauth.account.auth_backends.AuthenticationBackend",
    # "graphql_jwt.backends.JSONWebTokenBackend",
]

# # Provider specific settings

ACCOUNT_ADAPTER = "users.adapters.AccountAdapter"

ACCOUNT_USER_MODEL_USERNAME_FIELD = "username"
ACCOUNT_AUTHENTICATION_METHOD = "email"
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_PRESERVE_USERNAME_CASING = False

# check if production or development
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework.authentication.SessionAuthentication",
        "dj_rest_auth.jwt_auth.JWTCookieAuthentication",
    ),
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
    ],
    # "DEFAULT_THROTTLE_RATES": {
    #     "anon": "30/hour",
    # },
}

REST_USE_JWT = True

SIMPLE_JWT_SIGNING_KEY = config("SIMPLE_JWT_SIGNING_KEY", default="", cast=str)

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=14),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN": True,
    "SIGNING_KEY": SIMPLE_JWT_SIGNING_KEY,
}


CORS_ALLOWED_ORIGINS = config(
    "CORS_ALLOWED_ORIGINS",
    default="",
    cast=lambda allowed_origins: [
        origin.strip() for origin in allowed_origins.split(" ")
    ],
)

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_HEADERS = list(default_headers) + [
    "withCredentials",
]


UPLOADED_FILES_USE_URL = True

# ===== EMAIL =====

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = config("EMAIL_HOST")
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = "apikey"
EMAIL_HOST_PASSWORD = config("EMAIL_PASS")

DEFAULT_FROM_EMAIL = config("DEFAULT_FROM_EMAIL")

REST_AUTH_REGISTER_SERIALIZERS = {
    "REGISTER_SERIALIZER": "users.serializers.RegisterSerializer",
}

REST_AUTH_SERIALIZERS = {
    "PASSWORD_RESET_SERIALIZER": "users.serializers.CustomPasswordResetSerializer",
}

# ======= DJANGO Q using Redis =======

Q_CLUSTER = {
    "name": "devclad-queue",
    "retry": 120,
    "timeout": 90,
    "label": "DevClad Queue",
    "redis": {
        "host": config("REDIS_HOST"),
        "port": config("REDIS_PORT"),
        "username": config("REDIS_USERNAME"),
        "password": config("REDIS_PASSWORD"),
        "ssl": True,
    },
}

# ==================================== CHAT ========================================== #

STREAM_API_KEY = config("STREAM_API_KEY")
STREAM_API_SECRET = config("STREAM_API_SECRET")

# ==================================== GRAPHQL ========================================== #
