from django.urls import path
from .views import CreateUserView, LoginUserView, UserDetailView

urlpatterns = [
    path("user/register/", CreateUserView.as_view(), name="register"),
    path("user/login/", LoginUserView.as_view(), name="login"),
    path("user/details/<int:id>/", UserDetailView.as_view(), name='user-detail'),

]
