# from django.contrib.auth import get_user_model, authenticate, login
from .serializers import UserRegisterSerializer, UserLoginSerializer, UserGetSerializer, UserEditSerializer, UserEditRoleSerializer
from rest_framework import status, permissions, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .services import UserService


class CreateUserView(generics.CreateAPIView):
    serializer_class = UserRegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = UserService.create_user(serializer.validated_data)

        output_serializer = UserGetSerializer(user)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)


class LoginUserView(generics.GenericAPIView):
    serializer_class = UserLoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        tokens = UserService.authenticate_user(email, password)

        if tokens is None:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({
                "refresh": tokens['refresh'],
                "access": tokens['access'],
            }, status=status.HTTP_200_OK)


class GetCurrentUserInfoView(generics.RetrieveAPIView):
    serializer_class = UserGetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        serializer = self.get_serializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserEditCurrentView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserEditSerializer

    def update(self, request, *args, **kwargs):
        user = request.user
        serializer = self.get_serializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        updated_user = UserService.update_user(user.id, serializer.validated_data)
        output_serializer = UserGetSerializer(updated_user)
        return Response(output_serializer.data, status=status.HTTP_200_OK)


class UserDeleteCurrentView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserGetSerializer

    def delete(self, request, *args, **kwargs):
        user = request.user
        deleted_user = UserService.delete_user(user.id)
        output_serializer = UserGetSerializer(deleted_user)
        return Response(output_serializer.data, status=status.HTTP_204_NO_CONTENT)


class AdminGetUserView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserGetSerializer
    lookup_field = 'id'

    def get(self, request, *args, **kwargs):
        if UserService.user_is_admin(request.user.id):
            user_id = kwargs.get('id')
            user = UserService.get_user(user_id)
            serializer = self.get_serializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "You don't have permission to access this resource."},
                            status=status.HTTP_403_FORBIDDEN)


class AdminGetAllUsers(generics.ListAPIView):
    serializer_class = UserGetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if UserService.user_is_admin(self.request.user.id):
            return UserService.list_all_users()
        else:
            return None
        
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        
        if queryset is not None:
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "You don't have permission to access this resource."},
                            status=status.HTTP_403_FORBIDDEN)


class AdminChangeUserRole(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserEditRoleSerializer

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if UserService.user_is_admin(request.user.id):
            user_id = serializer.validated_data['id']
            new_role = serializer.validated_data['role']

            updated_user = UserService.update_role(user_id, new_role)
            output_serializer = UserGetSerializer(updated_user)
            return Response(output_serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "You don't have permission to access this resource."},
                            status=status.HTTP_403_FORBIDDEN)

class AdminDeleteUser(generics.DestroyAPIView):
    serializer_class = UserGetSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = ['id']

    def destroy(self, request, *args, **kwargs):
        if UserService.user_is_admin(request.user.id):
            user_id = kwargs['id']
            deleted_user = UserService.delete_user(user_id)
            output_serializer = self.get_serializer(deleted_user)
            return Response(output_serializer.data, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"error": "You don't have permission to access this resource."},
                            status=status.HTTP_403_FORBIDDEN)

       