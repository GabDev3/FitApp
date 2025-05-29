from rest_framework import serializers
from .models import Meal, MealProduct
from products.models import Product


class MealProductCreateSerializer(serializers.ModelSerializer):
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product'
    )

    class Meta:
        model = MealProduct
        fields = ['product_id', 'quantity']


class MealCreateSerializer(serializers.ModelSerializer):
    meal_products = MealProductCreateSerializer(many=True)

    class Meta:
        model = Meal
        fields = ['id', 'name', 'meal_products']

    def create(self, validated_data):
        meal_products_data = validated_data.pop('meal_products')
        # Add author if passed via context (used below)
        author = self.context['request'].user
        meal = Meal.objects.create(author_meal=author, **validated_data)
        for mp_data in meal_products_data:
            MealProduct.objects.create(meal=meal, **mp_data)
        return meal


class MealGetSerializer(serializers.ModelSerializer):
    class MealProductGetSerializer(serializers.ModelSerializer):
        product_id = serializers.IntegerField(source='product.id')

        class Meta:
            model = MealProduct
            fields = ['product_id', 'quantity']

    meal_products = MealProductGetSerializer(many=True, read_only=True)

    class Meta:
        model = Meal
        fields = ['id', 'name', 'kcals', 'meal_products']
        read_only_fields = fields


class MealRemoveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meal
        fields = ['id', 'name', 'kcals']


class MealProductEditSerializer(serializers.ModelSerializer):
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        source='product'
    )

    class Meta:
        model = MealProduct
        fields = ['product_id', 'quantity']


class MealEditSerializer(serializers.ModelSerializer):
    meal_products = MealProductEditSerializer(many=True)

    class Meta:
        model = Meal
        fields = ['id', 'name', 'meal_products']

    def update(self, instance, validated_data):
        # Let the service layer handle the update logic
        return instance