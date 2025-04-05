from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=100, null=False, default="default_meal_name")
    complex_carbs = models.FloatField(default=0)
    simple_carbs = models.FloatField(default=0)
    fiber = models.FloatField(default=0)
    saturated_fat = models.FloatField(default=0)
    unsaturated_fat = models.FloatField(default=0)
    protein = models.FloatField(default=0)
    kcal = models.FloatField(blank=True, null=True)

    @property
    def carbohydrates(self):
        return self.complex_carbs + self.simple_carbs + self.fiber

    @property
    def fats(self):
        return self.saturated_fat + self.unsaturated_fat

    def calculate_kcal(self):
        return self.carbohydrates * 4 + self.protein * 4 + self.fats * 9

    def save(self, *args, **kwargs):
        self.kcal = self.calculate_kcal()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
