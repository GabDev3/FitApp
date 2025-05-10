from rest_framework import serializers
from .models import Product


class ProductCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'complex_carbs', 'simple_carbs', 'fiber',
            'saturated_fat', 'unsaturated_fat', 'protein', 'author_product'
        ]
        extra_kwargs = {"author_product": {"read_only": True}}


class ProductGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'carbohydrates', 'complex_carbs', 'simple_carbs', 'fiber',
            'fats', 'saturated_fat', 'unsaturated_fat', 'protein', 'kcal', 'author_product'
        ]
        read_only_fields = fields


class ProductRemoveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'carbohydrates', 'complex_carbs', 'simple_carbs', 'fiber',
            'fats', 'saturated_fat', 'unsaturated_fat', 'protein', 'kcal', 'author_product'
        ]


class ProductEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'carbohydrates', 'complex_carbs', 'simple_carbs', 'fiber',
            'fats', 'saturated_fat', 'unsaturated_fat', 'protein', 'kcal', 'author_product'
        ]
