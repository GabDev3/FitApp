from django.urls import path
from .views import CreateMealView, GetMealView, RemoveMealView, MealEditView, GetAllMealsView, GetAllMealsCurrentUserView, AddConsumedMealView, RemoveConsumedMealView

urlpatterns = [
    path("meal/create/", CreateMealView.as_view(), name="meal-create"),
    path("meal/get/<int:id>/", GetMealView.as_view(), name="meal-get"),
    path("meal/remove/<int:id>/", RemoveMealView.as_view(), name="meal-remove"),
    path("meal/edit/<int:id>/", MealEditView.as_view(), name="meal-edit"),
    path("meal/get_all/", GetAllMealsView.as_view(), name="meal-get-all"),
    path("meal/get_all_current/", GetAllMealsCurrentUserView.as_view(), name="meal-get-all-current"),
    path('consumed-meals/add/<int:meal_id>/', AddConsumedMealView.as_view(), name='add-consumed-meal'),
    path('consumed-meals/remove/<int:user_meal_id>/', RemoveConsumedMealView.as_view(), name='remove-consumed-meal'),
    ]
