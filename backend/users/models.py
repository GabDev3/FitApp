from django.contrib.auth.models import AbstractUser
from django.db import models

class MyUser(AbstractUser):
    userDetails = models.OneToOneField('UserDetails', on_delete=models.CASCADE, null=True, blank=True, related_name="user_details")

    class Role(models.TextChoices):
        ADMIN = 'ADMIN', 'Admin'
        USER = 'USER', 'User'

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.USER,
    )


class UserDetails(models.Model):
    user = models.OneToOneField('MyUser', on_delete=models.CASCADE, related_name="user_details")
    height = models.FloatField(null=True, blank=True)
    weight = models.FloatField(null=True, blank=True)
    activity_level = models.CharField(max_length=50, null=True, blank=True)
    goal = models.CharField(max_length=50, null=True, blank=True)
    dailyIntake = models.FloatField(null=True, blank=True)
    age = models.PositiveIntegerField(null=True, blank=True)


class UserMeal(models.Model):
    meal = models.ForeignKey('meals.Meal', on_delete=models.CASCADE, related_name="user_meal")
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name="user_meal")
    consumed_at = models.DateTimeField(null=False, blank=True, auto_now=True)
