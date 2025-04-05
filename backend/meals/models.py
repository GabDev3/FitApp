from django.db import models

# Create your models here.


class Meal(models.Model):
    name = models.CharField(max_length=100, null=False, default="default_meal_name", unique=True)
    #TODO meal-product relation (maybe array?)
