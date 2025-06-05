
from .serializers import UserRegisterSerializer, UserLoginSerializer, UserGetSerializer, UserEditSerializer, UserEditRoleSerializer
from rest_framework import status, permissions, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .services import UserService
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
from drf_spectacular.types import OpenApiTypes
from rest_framework.response import Response


class CreateUserView(generics.CreateAPIView):
    serializer_class = UserRegisterSerializer
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        summary="Register a new user",
        description="Create a new user account",
        request=UserRegisterSerializer,
        responses={
            201: UserGetSerializer,
            400: OpenApiExample(
                'Bad Request',
                value={'error': 'Invalid data provided'}
            )
        },
        tags=['Authentication']
    )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = UserService.create_user(serializer.validated_data)

        output_serializer = UserGetSerializer(user)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)


class LoginUserView(generics.GenericAPIView):
    serializer_class = UserLoginSerializer
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        summary="User login",
        description="Authenticate user and return JWT tokens",
        request=UserLoginSerializer,
        responses={
            200: OpenApiExample(
                'Success',
                value={
                    'refresh': 'refresh_token_here',
                    'access': 'access_token_here'
                }
            ),
            401: OpenApiExample(
                'Unauthorized',
                value={'error': 'Invalid credentials'}
            )
        },
        tags=['Authentication']
    )

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

    @extend_schema(
        summary="Get current user info",
        description="Retrieve information about the currently authenticated user",
        responses={
            200: UserGetSerializer,
            401: OpenApiExample(
                'Unauthorized',
                value={'error': 'Authentication required'}
            )
        },
        tags=['Users']
    )

    def get(self, request, *args, **kwargs):
        user = request.user
        serializer = self.get_serializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserEditCurrentView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserEditSerializer

    @extend_schema(
        summary="Update current user",
        description="Update current user's information",
        request=UserEditSerializer,
        responses={
            200: UserGetSerializer,
            400: OpenApiExample(
                'Bad Request',
                value={'error': 'Invalid data provided'}
            ),
            401: OpenApiExample(
                'Unauthorized',
                value={'error': 'Authentication required'}
            )
        },
        tags=['Users']
    )

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

    @extend_schema(
        summary="Delete current user",
        description="Delete the currently authenticated user account",
        responses={
            204: UserGetSerializer,
            401: OpenApiExample(
                'Unauthorized',
                value={'error': 'Authentication required'}
            )
        },
        tags=['Users']
    )

    def delete(self, request, *args, **kwargs):
        user = request.user
        deleted_user = UserService.delete_user(user.id)
        output_serializer = UserGetSerializer(deleted_user)
        return Response(output_serializer.data, status=status.HTTP_204_NO_CONTENT)


class AdminGetUserView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserGetSerializer
    lookup_field = 'id'

    @extend_schema(
        summary="Admin: Get user by ID",
        description="Retrieve a specific user by ID (admin only)",
        parameters=[
            OpenApiParameter(
                name='id',
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description='Unique identifier for the user'
            )
        ],
        responses={
            200: UserGetSerializer,
            403: OpenApiExample(
                'Forbidden',
                value={'error': "You don't have permission to access this resource."}
            ),
            404: OpenApiExample(
                'Not Found',
                value={'error': 'User not found'}
            )
        },
        tags=['Admin']
    )

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

    @extend_schema(
        summary="Admin: Get all users",
        description="Retrieve all users (admin only)",
        responses={
            200: UserGetSerializer(many=True),
            403: OpenApiExample(
                'Forbidden',
                value={'error': "You don't have permission to access this resource."}
            )
        },
        tags=['Admin']
    )

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

    @extend_schema(
        summary="Admin: Change user role",
        description="Change a user's role (admin only)",
        request=UserEditRoleSerializer,
        responses={
            200: UserGetSerializer,
            400: OpenApiExample(
                'Bad Request',
                value={'error': 'Invalid data provided'}
            ),
            403: OpenApiExample(
                'Forbidden',
                value={'error': "You don't have permission to access this resource."}
            )
        },
        tags=['Admin']
    )

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

    @extend_schema(
        summary="Admin: Delete user",
        description="Delete a user by ID (admin only)",
        parameters=[
            OpenApiParameter(
                name='id',
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description='Unique identifier for the user to delete'
            )
        ],
        responses={
            204: UserGetSerializer,
            403: OpenApiExample(
                'Forbidden',
                value={'error': "You don't have permission to access this resource."}
            ),
            404: OpenApiExample(
                'Not Found',
                value={'error': 'User not found'}
            )
        },
        tags=['Admin']
    )

    def destroy(self, request, *args, **kwargs):
        if UserService.user_is_admin(request.user.id):
            user_id = kwargs['id']
            deleted_user = UserService.delete_user(user_id)
            output_serializer = self.get_serializer(deleted_user)
            return Response(output_serializer.data, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"error": "You don't have permission to access this resource."},
                            status=status.HTTP_403_FORBIDDEN)

       