from django.urls import path

from .views import get_matches_this_week

app_name = "social"

urlpatterns = [
    path("", get_matches_this_week, name="matches_this_week"),
]
