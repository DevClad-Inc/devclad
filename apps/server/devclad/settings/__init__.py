from decouple import config

ENVIRONMENT = config("ENVIRONMENT", default="DEVELOPMENT")

match ENVIRONMENT:
    case "DEVELOPMENT":
        from devclad.settings.development import *
    case "PRODUCTION":
        from devclad.settings.production import *
    case "GITPOD":
        from devclad.settings.gitpod import *

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
