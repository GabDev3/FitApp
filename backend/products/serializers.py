from rest_framework import serializers
from .models import Product

class ProductCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'complex_carbs', 'simple_carbs', 'fiber',
            'saturated_fat', 'unsaturated_fat', 'protein'
        ]

    def create(self, validated_data):
        return Product.objects.create(**validated_data)  # kcal is auto-calculated in model

class ProductGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'carbohydrates', 'complex_carbs', 'simple_carbs', 'fiber',
            'fats', 'saturated_fat', 'unsaturated_fat', 'protein'
        ]
        read_only_fields = fields  # Make all fields read-only


class ProductRemoveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'carbohydrates', 'complex_carbs', 'simple_carbs', 'fiber',
            'fats', 'saturated_fat', 'unsaturated_fat', 'protein'
        ]