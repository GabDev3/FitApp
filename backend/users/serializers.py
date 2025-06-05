from rest_framework import serializers
from .models import MyUser


class UserGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ['id', 'email', 'first_name', 'last_name', 'role', 'height',
                  'weight', 'activity_level', 'goal', 'dailyIntake', 'age']
        read_only_fields = fields


class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ['id', 'email', 'password', 'first_name', 'last_name', 'height',
                  'weight', 'activity_level', 'goal', 'dailyIntake', 'age']
        extra_kwargs = {'password': {'write_only': True}}  


class UserEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ['email', 'first_name', 'last_name', 'height',
                  'weight', 'activity_level', 'goal', 'dailyIntake', 'age']


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class UserEditRoleSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    role = serializers.CharField(max_length=20)

