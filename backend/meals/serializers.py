from rest_framework import serializers
from .models import Meal, MealProduct
from products.models import Product


class MealCreateSerializer(serializers.ModelSerializer):
    class MealProductCreateSerializer(serializers.ModelSerializer):
        product_id = serializers.PrimaryKeyRelatedField(
            queryset=Product.objects.all(), source='product'
        )

        class Meta:
            model = MealProduct
            fields = ['product_id', 'quantity']


    meal_products = MealProductCreateSerializer(many=True)

    class Meta:
        model = Meal
        fields = ['id', 'name', 'meal_products']

    def create(self, validated_data):
        meal_products_data = validated_data.pop('meal_products')
        meal = Meal.objects.create(**validated_data)
        for mp_data in meal_products_data:
            MealProduct.objects.create(meal=meal, **mp_data)
        return meal


class MealGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meal
        fields = ['id', 'name', 'kcals']
        read_only_fields = fields  # Make all fields read-only


class MealRemoveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meal
        fields = ['id', 'name', 'kcals']
