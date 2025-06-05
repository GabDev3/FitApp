from .models import Meal, MealProduct, UserMeal
from typing import List, Dict
from products.repositories import ProductRepository
from django.db import transaction
from products.models import Product
from typing import List, Dict

class MealRepository:

    @staticmethod
    def add_meal(meal: Meal):
        """
        Add a new meal to the database.
        """
        meal.save()
        return meal

    @staticmethod
    def remove_meal(id: int):
        """
        Remove a meal from the database by its ID.
        """
        try:
            meal = Meal.objects.get(id=id)
            meal.delete()
            return True
        except Meal.DoesNotExist:
            return False

    @staticmethod
    def update_meal(meal: Meal, meal_products: List[Dict]):
        """
        Replace existing MealProducts for a meal with new ones.
        """
        if not meal:
            raise ValueError("Meal object is None")

        print(f"Updating meal {meal.id} with products: {meal_products}")  

        try:
            with transaction.atomic():
                
                existing_products = set(meal.meal_products.values_list('product_id', flat=True))
                print(f"Existing products: {existing_products}")  

                
                deleted_count = meal.meal_products.all().delete()
                print(f"Deleted {deleted_count} existing meal products")  

                
                new_products = []
                for item in meal_products:
                    product_id = item.get('product_id')
                    quantity = item.get('quantity')

                    print(f"Processing product_id: {product_id}, quantity: {quantity}")  

                    if not product_id or not quantity:
                        raise ValueError(f"Invalid product data: {item}")

                    if not Product.objects.filter(id=product_id).exists():
                        raise ValueError(f"Product with ID {product_id} does not exist")

                    new_product = MealProduct.objects.create(
                        meal=meal,
                        product_id=product_id,
                        quantity=quantity
                    )
                    new_products.append(new_product)

                print(f"Created {len(new_products)} new meal products")  

        except Exception as e:
            print(f"Error in repository update_meal: {str(e)}")  
            print(f"Error type: {type(e)}")  
            raise

        return True

    @staticmethod
    def get_meal_by_id(id: int):
        """
        Get a meal from the database by its ID.
        """
        try:
            return Meal.objects.get(id=id)
        except Meal.DoesNotExist:
            return None

    @staticmethod
    def get_all_meals():
        """
        Get all meals from the database.
        """
        return Meal.objects.all()

    @staticmethod
    def get_all_user_id(user_id: int):
        """
        Get all meals of a specific user.
        """
        return Meal.objects.filter(author_meal=user_id)

    @staticmethod
    def get_meal_products(id: int):
        """
        Get all products of a specific meal.
        """
        try:
            meal = Meal.objects.get(id=id)
            return meal.meal_products.all()
        except Meal.DoesNotExist:
            return None

    @staticmethod
    def get_meal_history(user_id: int):
        """
        Get all meals consumed by a specific user.
        """
        return UserMeal.objects.filter(user=user_id)

    @staticmethod
    def add_meal_to_history(meal: Meal, user_id: int):
        """
        Add a meal to the user's meal history.
        """
        user_meal = UserMeal(meal=meal, user_id=user_id)
        user_meal.save()
        return user_meal

    @staticmethod
    def remove_meal_from_history(user_meal: UserMeal):
        """
        Remove a meal from the user's meal history.
        """
        user_meal.delete()
        return True

    @staticmethod
    def get_meal_author(meal_id: int):
        """
        Get the author of a specific meal.
        """
        try:
            meal = Meal.objects.get(id=meal_id)
            return meal.author_meal
        except Meal.DoesNotExist:
            return None

    def get_user_meal_by_id(user_meal_id: int):
        """
        Get a specific user meal by its ID.
        """
        try:
            return UserMeal.objects.get(id=user_meal_id)
        except UserMeal.DoesNotExist:
            return None