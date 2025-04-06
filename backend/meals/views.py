from .serializers import MealCreateSerializer, MealGetSerializer
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