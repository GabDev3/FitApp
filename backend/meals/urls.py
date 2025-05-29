from django.urls import path
from .views import CreateMealView, GetMealView, RemoveMealView, MealEditView, GetAllMealsView

urlpatterns = [
    path("meal/create/", CreateMealView.as_view(), name="meal-create"),
    path("meal/get/<int:id>/", GetMealView.as_view(), name="meal-get"),
    path("meal/remove/<int:id>/", RemoveMealView.as_view(), name="meal-remove"),
    path("meal/edit/<int:id>/", MealEditView.as_view(), name="meal-edit"),
    path("meal/get_all/", GetAllMealsView.as_view(), name="meal-get-all"),
]
