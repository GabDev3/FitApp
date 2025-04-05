from django.contrib.auth import get_user_model
from .serializers import CreateProductSerializer
from rest_framework import status, permissions, generics
from rest_framework.response import Response
from .models import Product

class CreateProductView(generics.CreateAPIView):
    serializer_class = CreateProductSerializer
    queryset = Product.objects.all()
    permission_classes = [permissions.AllowAny]
