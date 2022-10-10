from decouple import config

if config("PRODUCTION", default=False, cast=bool):
    from devclad.settings.production import *
else:
    from devclad.settings.development import *
