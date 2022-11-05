from django.urls import path


from users.oauth.views import github_oauth_connect, github_oauth_login

urlpatterns = [
    path("github/login/", github_oauth_login, name="github_oauth"),
    path("github/connect/", github_oauth_connect, name="github_oauth"),
]
