from rest_framework import generics
from django.contrib.auth import get_user_model, authenticate, login
from .serializers import UserRegisterSerializer, UserLoginSerializer
from rest_framework import status, permissions
from rest_framework.response import Response


MyUser = get_user_model()  # Get the 'MyUser' model

class CreateUserView(generics.CreateAPIView):
    serializer_class = UserRegisterSerializer
    queryset = MyUser.objects.all()  # Query 'MyUser' model
    permission_classes = [permissions.AllowAny]


class LoginUserView(generics.GenericAPIView):
    serializer_class = UserLoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            return Response({"detail": "Login successful"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
