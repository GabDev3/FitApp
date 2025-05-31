from .repositories import MealRepository
from .serializers import MealCreateSerializer, MealEditSerializer, MealGetSerializer

class MealService:

    @staticmethod
    def create_meal(meal_data, request):
        serializer = MealCreateSerializer(data=meal_data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        return serializer.save()

    @staticmethod
    def remove_meal(meal_id: int):
        return MealRepository.remove_meal(meal_id)

    @staticmethod
    def update_meal(meal_id: int, data: dict):
        """
        Validates input and updates the entire meal via MealRepository.
        """
        meal = MealRepository.get_meal_by_id(meal_id)
        if not meal:
            raise ValueError("Meal not found")

        serializer = MealEditSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        # Update meal name
        meal.name = validated_data['name']
        meal.save()

        # Update meal products
        meal_products = [
            {
                "product_id": mp['product_id'],
                "quantity": mp['quantity']
            }
            for mp in validated_data['meal_products']
        ]

        try:
            MealRepository.update_meal(meal=meal, meal_products=meal_products)
        except Exception as e:
            print(f"Error in update_meal: {e}")  # Debug log
            raise

        return meal

    @staticmethod
    def get_all_meals():
        """
        Fetches all meals with their products from the database.
        """
        meals = MealRepository.get_all_meals()
        return MealGetSerializer(meals, many=True).data

    @staticmethod
    def get_all_meals_current_user(user_id: int):
        """
        Fetches all meals of the current user.
        """
        meals = MealRepository.get_all_user_id(user_id)
        return MealGetSerializer(meals, many=True).data

    @staticmethod
    def user_is_author(meal_id: int, user_id: int) -> bool:
        """
        Checks if the user is the author of the meal.
        """
        author = MealRepository.get_meal_author(meal_id)
        if author is None:
            return False
        return author.id == user_id

    @staticmethod
    def get_meal_by_id(id: int):
        return MealRepository.get_meal_by_id(id)
