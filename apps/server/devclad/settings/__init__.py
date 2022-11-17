from decouple import config

ENVIRONMENT = config("ENVIRONMENT", default="DEVELOPMENT")

match ENVIRONMENT:
    case "DEVELOPMENT":
        from devclad.settings.development import *
    case "PRODUCTION":
        from devclad.settings.production import *
    case "GITPOD":
        from devclad.settings.development import *

        SECURE_HSTS_SECONDS = config("SECURE_HSTS_SECONDS")
        SECURE_SSL_REDIRECT = True
        SECURE_HSTS_INCLUDE_SUBDOMAINS = True
        SESSION_COOKIE_SECURE = config("SESSION_COOKIE_SECURE", cast=bool)
        # SESSION_COOKIE_AGE = 2 weeks by default
        CSRF_COOKIE_SECURE = config("CSRF_COOKIE_SECURE", cast=bool)
        SECURE_HSTS_PRELOAD = True
        SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# ==== ROLLBAR ====

ROLLBAR = {
    "access_token": "879540db65a74364893afe8a882f05a6",
    "environment": "development"
    if (ENVIRONMENT == "DEVELOPMENT" or "GITPOD")
    else "production",
    "root": BASE_DIR,
}
import rollbar

rollbar.init(**ROLLBAR)

# ==== ROLLBAR ====
