from django.urls import path
from .views import CreateProductView


urlpatterns = [
    path("product/create/", CreateProductView.as_view(), name="product-create"),

]