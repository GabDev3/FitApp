from rest_framework import serializers
from django.contrib.auth import get_user_model

MyUser = get_user_model()  # This will fetch 'users.MyUser'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ['id', 'username', 'email', 'password', 'age', 'dailyIntake']
        extra_kwargs = {'password': {'write_only': True}}  # Don't expose password

    def create(self, validated_data):
        user = MyUser.objects.create_user(**validated_data)  # Use MyUser for creation
        return user
