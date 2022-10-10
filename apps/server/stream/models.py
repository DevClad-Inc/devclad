from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()


class StreamUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    uid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    token = models.CharField(max_length=255, default="")

    class Meta:
        verbose_name = "Stream User"
        verbose_name_plural = "Stream Users"

    def __str__(self):
        return self.user.username
