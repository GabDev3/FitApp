from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .repositories import UserRepository


class UserService:
    @staticmethod
    def list_all_users():
        return UserRepository.get_all()

    @staticmethod
    def get_user(user_id):
        return UserRepository.get_by_id(user_id)

    @staticmethod
    def create_user(validated_data):
        return UserRepository.create(validated_data)

    @staticmethod
    def delete_user(user_id):
        user = UserRepository.get_by_id(user_id)
        return UserRepository.delete(user)

    @staticmethod
    def update_user(user_id, validated_data):
        user = UserRepository.get_by_id(user_id)
        return UserRepository.update(user, validated_data)

    @staticmethod
    def authenticate_user(email, password):
        user = authenticate(username=email, password=password)
        if user is None:
            return None
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

    @staticmethod
    def user_is_admin(user_id):
        user = UserRepository.get_by_id(user_id)
        if user.role == 'Admin':
            return True
        else:
            return False

    @staticmethod
    def update_role(user_id, new_role):
        user = UserRepository.get_by_id(user_id)

        if new_role not in ['Admin', 'User']:
            raise ValueError("Invalid role")
        else:
            UserRepository.update(user, {'role': new_role})
            user.save()
            return user
