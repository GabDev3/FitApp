from django.contrib.auth.models import AbstractUser
from django.db import models
# from meals.models import Meal


class MyUser(AbstractUser):
    age = models.PositiveIntegerField(null=True, blank=True)
    dailyIntake = models.FloatField(null=True, blank=True)


class UserMeal(models.Model):
    meal = models.ForeignKey('meals.Meal', on_delete=models.CASCADE, related_name="user_meal")
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name="user_meal")
    consumed_at = models.DateTimeField(null=False, blank=True, auto_now=True)
