from rest_framework import generics
from django.contrib.auth import get_user_model
from .serializers import UserSerializer
from rest_framework.permissions import AllowAny

MyUser = get_user_model()  # Get the 'MyUser' model

class CreateUserView(generics.CreateAPIView):
    serializer_class = UserSerializer
    queryset = MyUser.objects.all()  # Query 'MyUser' model
    permission_classes = [AllowAny]

