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
    def update_meal(data):
        """
        Validates input and updates meal via MealRepository.
        """
        serializer = MealEditSerializer(data=data)
        serializer.is_valid(raise_exception=True)

        validated_data = serializer.validated_data
        meal_id = data.get("id")
        meal_products = validated_data.pop("meal_products")
        name = validated_data.get("name")

        # Update basic meal fields
        meal = MealRepository.get_meal_by_id(meal_id)
        meal.name = name
        meal.save()

        # Prepare meal_product data for repository
        simplified_meal_products = [
            {
                "product_id": mp["product"].id,
                "quantity": mp["quantity"]
            }
            for mp in meal_products
        ]

        # Call repository to update related products
        MealRepository.update_meal(meal_id=meal.id, meal_products=simplified_meal_products)

        return meal

    @staticmethod
    def get_all_meals():
        """
        Fetches all meals with their products from the database.
        """
        meals = MealRepository.get_all_meals()
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
