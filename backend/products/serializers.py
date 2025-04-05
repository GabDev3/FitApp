from rest_framework import serializers
from .models import Product

class CreateProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'name', 'complex_carbs', 'simple_carbs', 'fiber',
            'saturated_fat', 'unsaturated_fat', 'protein'
        ]

    def create(self, validated_data):
        return Product.objects.create(**validated_data)  # kcal is auto-calculated in model
