from django.contrib.auth.models import AbstractUser
from django.db import models

class MyUser(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    height = models.FloatField(null=True, blank=True)
    weight = models.FloatField(null=True, blank=True)
    activity_level = models.FloatField(null=True, blank=True)
    goal = models.FloatField(null=True, blank=True)
    dailyIntake = models.FloatField(null=True, blank=True)
    age = models.PositiveIntegerField(null=True, blank=True)



    class Role(models.TextChoices):
        ADMIN = 'Admin'
        USER = 'User'

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.USER,
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
