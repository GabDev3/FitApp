from rest_framework import serializers
from .models import Meal, MealProduct, UserMeal
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
    product_id = serializers.IntegerField(min_value=1)
    quantity = serializers.FloatField(min_value=0.1)

    class Meta:
        model = MealProduct
        fields = ['product_id', 'quantity']

    def validate_product_id(self, value):
        if not Product.objects.filter(id=value).exists():
            raise serializers.ValidationError(f"Product with ID {value} does not exist")
        return value


class MealEditSerializer(serializers.ModelSerializer):
    meal_products = MealProductEditSerializer(many=True)
    name = serializers.CharField(required=True, min_length=1)

    class Meta:
        model = Meal
        fields = ['name', 'meal_products']

    def validate_meal_products(self, value):
        if not value:
            raise serializers.ValidationError("At least one product is required")
        return value

    def validate(self, data):
        if not data.get('name'):
            raise serializers.ValidationError({"name": "Name is required"})
        if not data.get('meal_products'):
            raise serializers.ValidationError({"meal_products": "At least one product is required"})
        return data


class UserMealGetSerializer(serializers.ModelSerializer):
    meal = MealGetSerializer(read_only=True)

    class Meta:
        model = UserMeal
        fields = ['id', 'meal', 'consumed_at']
        read_only_fields = fields


class UserMealDeleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserMeal
        fields = ['id']
        read_only_fields = fields


class MealHistorySerializer(serializers.ModelSerializer):
    meal_id = serializers.IntegerField(source='meal.id')
    consumed_at = serializers.DateTimeField()

    class Meta:
        model = UserMeal
        fields = ['id', 'meal_id', 'consumed_at']
