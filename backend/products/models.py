from django.db import models

class Product(models.Model):
    class Product(models.Model):
        name = models.CharField(max_length=100)
        complex_carbs = models.FloatField(default=0)
        simple_carbs = models.FloatField(default=0)
        fiber = models.FloatField(default=0)
        saturated_fat = models.FloatField()
        unsaturated_fat = models.FloatField()
        protein = models.FloatField()
        kcal = models.FloatField(blank=True, null=True)

        def __str__(self):
            return self.name

        @property
        def carbohydrates(self):
            return self.complex_carbs + self.simple_carbs + self.fiber

        @property
        def fats(self):
            return self.saturated_fat + self.unsaturated_fat
