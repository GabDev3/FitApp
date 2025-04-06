from .serializers import (MealCreateSerializer, MealGetSerializer,
                          MealRemoveSerializer)
from .models import Meal, MealProduct
from rest_framework import status, permissions, generics
from rest_framework.response import Response


class CreateMealView(generics.CreateAPIView):
    serializer_class = MealCreateSerializer
    queryset = Meal.objects.all()
    permission_classes = [permissions.AllowAny]


class GetMealView(generics.RetrieveAPIView):
    queryset = Meal.objects.all()
    serializer_class = MealGetSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'id'


class RemoveMealView(generics.DestroyAPIView):
    queryset = Meal.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = MealRemoveSerializer
    lookup_field = 'id'

    def destroy(self, request, *args, **kwargs):
        # Get the meal object to delete
        meal = self.get_object()

        # Optionally, serialize the meal to return data after deletion
        serializer = self.get_serializer(meal)

        # Call the default destroy method to delete the meal
        response = super().destroy(request, *args, **kwargs)

        # Optionally add more custom data to the response, if needed
        response.data = {
            "message": f"Meal '{meal.name}' deleted successfully.",
            "deleted_meal": serializer.data
        }

        response.status_code = status.HTTP_200_OK

        return response