from django.urls import path
from .views import CreateProductView, GetProductView


urlpatterns = [
    path("product/create/", CreateProductView.as_view(), name="product-create"),
    path("product/get/<int:id>/", GetProductView.as_view(), name="product-get")
]
