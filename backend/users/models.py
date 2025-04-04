from django.contrib.auth.models import AbstractUser
from django.db import models

class MyUser(AbstractUser):
    age = models.PositiveIntegerField(null=True, blank=True)
    dailyIntake = models.PositiveIntegerField(null=True, blank=True)
