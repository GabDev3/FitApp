from .models import Product

class ProductRepository:

    @staticmethod
    def get_all_by_user(user):
        return Product.objects.filter(author_product=user)

    @staticmethod
    def get_by_id(product_id):
        return Product.objects.get(id=product_id)

    @staticmethod
    def get_all():
        return Product.objects.all()

    @staticmethod
    def get_product_author(product_id):
        product = Product.objects.get(id=product_id)
        return product.author_product if product else None

    @staticmethod
    def create(data):
        return Product.objects.create(**data)

    @staticmethod
    def delete(product):
        product.delete()
        return product

    @staticmethod
    def update(product, data):
        for attr, value in data.items():
            current_value = getattr(product, attr, None)
            if current_value != value:
                setattr(product, attr, value)

        # Final double-check: don't allow duplicate name
        if Product.objects.exclude(id=product.id).filter(name=product.name).exists():
            raise serializers.ValidationError({"name": "Product with this name already exists."})

        product.save()
        return product