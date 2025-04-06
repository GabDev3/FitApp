from django.urls import path
from .views import CreateMealView

urlpatterns = [
    path("meal/create/", CreateMealView.as_view(), name="meal-create"),

]
