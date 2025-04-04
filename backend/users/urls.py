from django.urls import path
from .views import CreateUserView, LoginUserView

urlpatterns = [
    path("user/register/", CreateUserView.as_view(), name="register"),
    path("user/login/", LoginUserView.as_view(), name="login")
]
