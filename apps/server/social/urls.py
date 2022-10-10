from django.urls import include, path

from social.views import (
    profile,
    additional_preferences,
    social_profile,
    circle,
    block,
    shadow,
    skip,
    profile_is_complete,
)

from social.ml.views import get_matches_this_week

app_name = "social"

urlpatterns = [
    path("profile/", profile, name="profile"),
    path("profile/<str:username>/", social_profile, name="profile"),
    path("additional-prefs/", additional_preferences, name="additional-prefs"),
    path("circle/<str:username>/<str:operation>/", circle, name="circle"),
    path("block/", block, name="block"),
    path("shadow/", shadow, name="shadow"),
    path("skipped/", skip, name="skip"),
    path("is-complete/", profile_is_complete, name="profile_is_complete"),
    path("one-one/", get_matches_this_week, name="matches_this_week"),
]
