from django.urls import path
from .views import CreateProductView, GetProductView, ProductRemoveView


urlpatterns = [
    path("product/create/", CreateProductView.as_view(), name="product-create"),
    path("product/get/<int:id>/", GetProductView.as_view(), name="product-get"),
    path("product/remove/<int:id>/", ProductRemoveView.as_view(), name="product-remove"),
]
