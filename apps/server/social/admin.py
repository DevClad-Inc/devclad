from django.contrib import admin
from social.models import MeetingRoom
from social.models import SocialProfile

admin.site.register(SocialProfile)
admin.site.register(MeetingRoom)
