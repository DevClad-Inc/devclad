from django.urls import path

from stream.views import token, get_uid

app_name = "stream"

urlpatterns = [
    path("token/", token, name="streamtoken"),
    path("uid/<str:username>/", get_uid, name="uid"),
]
