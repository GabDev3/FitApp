from django.db import models


class Meal(models.Model):
    name = models.CharField(max_length=100, null=False, default="default_meal_name", unique=True)
    author_meal = models.ForeignKey('users.MyUser', on_delete=models.CASCADE, default=1, related_name="meals_author")

    @property
    def kcals(self):
        total_kcal = 0
        for meal_product in self.meal_products.all():
            total_kcal += meal_product.product.calculate_kcal() * meal_product.quantity / 100
        return total_kcal


class MealProduct(models.Model):
    meal = models.ForeignKey(Meal, on_delete=models.CASCADE, related_name='meal_products')
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE)
    quantity = models.FloatField(default=1)

    def __str__(self):
        return f"{self.quantity}x {self.product.name} in {self.meal.name}"


class UserMeal(models.Model):
    meal = models.ForeignKey('meals.Meal', on_delete=models.CASCADE, related_name="user_meal")
    user = models.ForeignKey('users.MyUser', on_delete=models.CASCADE, related_name="user_meal")
    consumed_at = models.DateTimeField(null=False, blank=True, auto_now=True)
