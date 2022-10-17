from django.urls import include, path
from .views import meetings

urlpatterns = [
    path("", meetings, name="meetings"),
    path("<str:uid>/", meetings, name="meeting"),
]
