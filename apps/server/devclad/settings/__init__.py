from decouple import config

PRODUCTION = config("PRODUCTION", default=False, cast=bool)

if PRODUCTION:
    from devclad.settings.production import *
else:
    from devclad.settings.development import *

# ==== ROLLBAR ====

ROLLBAR = {
    "access_token": "879540db65a74364893afe8a882f05a6",
    "environment": "development" if PRODUCTION else "production",
    "root": BASE_DIR,
}
import rollbar

rollbar.init(**ROLLBAR)

# ==== ROLLBAR ====
