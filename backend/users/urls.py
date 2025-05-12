from django.urls import path
from .views import CreateUserView, LoginUserView, GetCurrentUserInfoView, UserEditCurrentView, UserDeleteCurrentView, AdminGetUserView, AdminChangeUserRole, AdminGetAllUsers, AdminDeleteUser

urlpatterns = [
    path("user/register/", CreateUserView.as_view(), name="register"),
    path("user/login/", LoginUserView.as_view(), name="login"),
    path("user/info/current/", GetCurrentUserInfoView.as_view(), name="current-user-info"),
    path("user/info/all/", AdminGetAllUsers.as_view(), name="all-user-info"),
    path("user/info/<int:id>/", AdminGetUserView.as_view(), name="id-user-info"),
    path("user/edit/current/", UserEditCurrentView.as_view(), name="edit-current-user"),
    path("user/edit/role/", AdminChangeUserRole.as_view(), name="edit-user-role"),
    path("user/delete/current/", UserDeleteCurrentView.as_view(), name="delete-current-user"),
    path("user/delete/<int:id>/", AdminDeleteUser.as_view(), name="delete-user-id")
]
