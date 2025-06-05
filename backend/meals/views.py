from .serializers import (MealCreateSerializer, MealGetSerializer,
                          MealRemoveSerializer, MealEditSerializer, UserMealDeleteSerializer, UserMealGetSerializer)
from .models import Meal, MealProduct
from rest_framework.response import Response
from .services import MealService
from rest_framework import generics, permissions, status
from users.services import UserService
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
from drf_spectacular.types import OpenApiTypes
from rest_framework.response import Response

class CreateMealView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MealCreateSerializer

    @extend_schema(
        summary="Create a new meal",
        description="Create a new meal with products and nutritional information",
        request=MealCreateSerializer,
        responses={
            201: MealCreateSerializer,
            400: OpenApiExample(
                'Bad Request',
                value={'error': 'Invalid data provided'}
            ),
            401: OpenApiExample(
                'Unauthorized',
                value={'error': 'Authentication required'}
            )
        },
        tags=['Meals']
    )

    def post(self, request, *args, **kwargs):
        meal = MealService.create_meal(request.data, request)
        serializer = self.get_serializer(meal)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class GetMealView(generics.GenericAPIView):
    serializer_class = MealGetSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    @extend_schema(
        summary="Get meal by ID",
        description="Retrieve a specific meal by its ID",
        parameters=[
            OpenApiParameter(
                name='id',
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description='Unique identifier for the meal'
            )
        ],
        responses={
            200: MealGetSerializer,
            404: OpenApiExample(
                'Not Found',
                value={'error': 'Meal not found'}
            ),
            401: OpenApiExample(
                'Unauthorized',
                value={'error': 'Authentication required'}
            )
        },
        tags=['Meals']
    )

    def get(self, request, *args, **kwargs):
        meal = MealService.get_meal_by_id(self.kwargs.get('id'))

        if not meal:
            return Response({"error": "Meal not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(meal)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GetAllMealsView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MealGetSerializer

    def get(self, request, *args, **kwargs):
        meals = MealService.get_all_meals()
        return Response(meals, status=status.HTTP_200_OK)


class GetAllMealsCurrentUserView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MealGetSerializer

    @extend_schema(
        summary="Get all meals",
        description="Retrieve all available meals",
        responses={
            200: MealGetSerializer(many=True),
            401: OpenApiExample(
                'Unauthorized',
                value={'error': 'Authentication required'}
            )
        },
        tags=['Meals']
    )

    def get(self, request, *args, **kwargs):
        user_id = request.user.id
        meals = MealService.get_all_meals_current_user(user_id)
        return Response(meals, status=status.HTTP_200_OK)


class RemoveMealView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MealGetSerializer
    lookup_field = 'id'

    @extend_schema(
        summary="Delete a meal",
        description="Delete a meal (only by author or admin)",
        parameters=[
            OpenApiParameter(
                name='id',
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description='Unique identifier for the meal to delete'
            )
        ],
        responses={
            204: OpenApiExample(
                'No Content',
                value={}
            ),
            403: OpenApiExample(
                'Forbidden',
                value={'error': 'Permission denied'}
            ),
            404: OpenApiExample(
                'Not Found',
                value={'error': 'Meal not found'}
            )
        },
        tags=['Meals']
    )

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
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MealEditSerializer
    lookup_field = 'id'

    @extend_schema(
        summary="Update a meal",
        description="Update meal information (only by author or admin)",
        request=MealEditSerializer,
        responses={
            200: MealEditSerializer,
            400: OpenApiExample(
                'Bad Request',
                value={'error': 'Invalid data provided'}
            ),
            403: OpenApiExample(
                'Forbidden',
                value={'error': 'You do not have permission to edit this meal'}
            ),
            404: OpenApiExample(
                'Not Found',
                value={'error': 'Meal not found'}
            )
        },
        tags=['Meals']
    )

    def get_queryset(self):
        meal_id = self.kwargs.get('id')
        meal = MealService.get_meal_by_id(meal_id)
        if not meal:
            return None
        return meal

    def put(self, request, *args, **kwargs):
        meal = self.get_queryset()
        if meal is None:
            return Response({"error": "Meal not found"}, status=status.HTTP_404_NOT_FOUND)

        if not MealService.user_is_author(meal.id, request.user.id) and not UserService.user_is_admin(request.user.id):
            return Response({"error": "You do not have permission to edit this meal"}, status=status.HTTP_403_FORBIDDEN)

        meal_id = self.kwargs.get('id')
        updated_meal = MealService.update_meal(meal_id, request.data)
        serializer = self.get_serializer(updated_meal)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AddConsumedMealView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserMealGetSerializer
    lookup_url_kwarg = 'meal_id'

    @extend_schema(
        summary="Add consumed meal",
        description="Add a meal to user's consumption history",
        parameters=[
            OpenApiParameter(
                name='meal_id',
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description='ID of the meal to add to consumption history'
            )
        ],
        responses={
            201: UserMealGetSerializer,
            400: OpenApiExample(
                'Bad Request',
                value={'error': 'Invalid request'}
            ),
            404: OpenApiExample(
                'Not Found',
                value={'error': 'Meal not found'}
            )
        },
        tags=['Meal History']
    )

    def post(self, request, *args, **kwargs):
        meal_id = self.kwargs.get(self.lookup_url_kwarg)  
        try:
            result = MealService.add_consumed_meal(meal_id, request.user.id)
            return Response(result, status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class RemoveConsumedMealView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserMealDeleteSerializer
    lookup_url_kwarg = 'user_meal_id'

    @extend_schema(
        summary="Remove consumed meal",
        description="Remove a meal from user's consumption history",
        parameters=[
            OpenApiParameter(
                name='user_meal_id',
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description='ID of the user meal record to remove'
            )
        ],
        responses={
            204: OpenApiExample(
                'No Content',
                value={}
            ),
            400: OpenApiExample(
                'Bad Request',
                value={'error': 'Invalid request'}
            ),
            404: OpenApiExample(
                'Not Found',
                value={'error': 'User meal not found'}
            )
        },
        tags=['Meal History']
    )

    def delete(self, request, *args, **kwargs):
        user_meal_id = self.kwargs.get(self.lookup_url_kwarg)  
        try:
            MealService.remove_consumed_meal(user_meal_id, request.user.id)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class MealHistoryView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="Get meal consumption history",
        description="Retrieve current user's meal consumption history",
        responses={
            200: OpenApiExample(
                'Success',
                value={'meal_history': [1, 2, 3]}
            ),
            401: OpenApiExample(
                'Unauthorized',
                value={'error': 'Authentication required'}
            )
        },
        tags=['Meal History']
    )

    def get(self, request, *args, **kwargs):
        user_id = request.user.id
        meal_history = MealService.get_meal_history_ids(user_id)
        return Response(meal_history, status=status.HTTP_200_OK)
