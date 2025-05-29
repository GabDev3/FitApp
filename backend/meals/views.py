from .serializers import (MealCreateSerializer, MealGetSerializer,
                          MealRemoveSerializer, MealEditSerializer)
from .models import Meal, MealProduct
from rest_framework.response import Response
from .services import MealService
from rest_framework import generics, permissions, status
from users.services import UserService

class CreateMealView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MealCreateSerializer

    def post(self, request, *args, **kwargs):
        meal = MealService.create_meal(request.data, request)
        serializer = self.get_serializer(meal)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class GetMealView(generics.GenericAPIView):
    serializer_class = MealGetSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def get(self, request, *args, **kwargs):
        meal_id = kwargs.get('id')
        meal = Meal.objects.filter(id=meal_id).first()

        if not meal:
            return Response({"error": "Meal not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(meal)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GetAllMealsView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = MealGetSerializer

    def get(self, request, *args, **kwargs):
        meals = MealService.get_all_meals()
        return Response(meals, status=status.HTTP_200_OK)


class RemoveMealView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MealGetSerializer
    lookup_field = 'id'

    def get_queryset(self):
        return MealService.get_meal_by_id(self.kwargs.get('id'))

    def destroy(self, request, *args, **kwargs):
        user = self.request.user
        meal = self.get_queryset()
        removed_data = self.get_serializer(meal).data
        if MealService.user_is_author(meal.id, user.id) or UserService.user_is_admin(user.id):
            meal = MealService.remove_meal(meal.id)
            if meal:
                return Response(removed_data, status=status.HTTP_204_NO_CONTENT)


class MealEditView(generics.RetrieveUpdateAPIView):
    queryset = Meal.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = MealEditSerializer
    lookup_field = 'id'
