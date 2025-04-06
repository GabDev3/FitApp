from django.urls import path
from .views import CreateMealView, GetMealView

urlpatterns = [
    path("meal/create/", CreateMealView.as_view(), name="meal-create"),
    path("meal/get/<int:id>", GetMealView.as_view(), name="meal-get"),

]
