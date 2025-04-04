from rest_framework import serializers
from django.contrib.auth import get_user_model

MyUser = get_user_model()  # This will fetch 'users.MyUser'

class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ['id', 'username', 'email', 'password', 'age', 'dailyIntake']
        extra_kwargs = {'password': {'write_only': True}}  # Don't expose password

    def create(self, validated_data):
        daily_intake = validated_data.pop('dailyIntake', None)  # Handle dailyIntake if it's optional

        user = MyUser.objects.create_user(**validated_data)  # Use MyUser for creation

        # If dailyIntake was passed, set it after the user is created
        if daily_intake is not None:
            user.dailyIntake = daily_intake
            user.save()

        return user


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=255)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    class Meta:
        fields = ['username', 'password']

    def validate(self, data):
        username = data.get("username")
        password = data.get("password")

        # Ensure both fields are provided
        if not username or not password:
            raise serializers.ValidationError("Both username and password are required")

        # Check if the user exists
        user = MyUser.objects.filter(username=username).first()
        if user is None:
            raise serializers.ValidationError("Invalid credentials")

        # Check if the password matches
        if not user.check_password(password):
            raise serializers.ValidationError("Invalid credentials")

        return data