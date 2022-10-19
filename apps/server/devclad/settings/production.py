from .base import *


ACCOUNT_EMAIL_VERIFICATION = "mandatory"
ACCOUNT_EMAIL_CONFIRMATION_EXPIRE_DAYS = 1

# JWT_AUTH_HTTPONLY = False

SESSION_COOKIE_DOMAIN = "api.devclad.com"
SESSION_COOKIE_NAME = "devclad-session"
SESSION_COOKIE_SAMESITE = "Strict"


REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"] = ["rest_framework.renderers.JSONRenderer"]

# SET COOKIE AND REDIRECT

REDIRECT_URL = config("REDIRECT_URL", default="https://app.devclad.com/", cast=str)
