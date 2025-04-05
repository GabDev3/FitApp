from django.contrib.auth import get_user_model
from .serializers import ProductCreateSerializer, ProductGetSerializer
from rest_framework import status, permissions, generics
from rest_framework.response import Response
from .models import Product

class CreateProductView(generics.CreateAPIView):
    serializer_class = ProductCreateSerializer
    queryset = Product.objects.all()
    permission_classes = [permissions.AllowAny]

class GetProductView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductGetSerializer
    permission_classes = [permissions.AllowAny]  # or AllowAny if needed
    lookup_field = 'id'  # dynamic part in the URL
