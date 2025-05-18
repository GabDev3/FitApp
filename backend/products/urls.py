from django.urls import path
from .views import CreateProductView, GetProductView, ProductRemoveView, ProductEditView, GetAllProductsView, GetAllUsersProductsView


urlpatterns = [
    path("product/create/", CreateProductView.as_view(), name="product-create"),
    path("product/get_all/", GetAllProductsView.as_view(), name="product-get-all"),
    path("product/get_all_user/", GetAllUsersProductsView.as_view(), name="product-get-all-user"),
    path("product/get/<int:id>/", GetProductView.as_view(), name="product-get"),
    path("product/remove/<int:id>/", ProductRemoveView.as_view(), name="product-remove"),
    path("product/edit/<int:id>/", ProductEditView.as_view(), name="product-edit"),
]
