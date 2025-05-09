from .repositories import ProductRepository
from django.core.exceptions import ObjectDoesNotExist

class ProductService:

    @staticmethod
    def list_user_products(user):
        return ProductRepository.get_all_by_user(user)

    @staticmethod
    def create_product(validated_data, user):
        validated_data['author_product'] = user
        return ProductRepository.create(validated_data)

    @staticmethod
    def get_product(product_id):
        try:
            return ProductRepository.get_by_id(product_id)
        except ObjectDoesNotExist:
            return None

    @staticmethod
    def delete_product(product_id):
        product = ProductRepository.get_by_id(product_id)
        return ProductRepository.delete(product)

    @staticmethod
    def update_product(product_id, validated_data):
        product = ProductRepository.get_by_id(product_id)
        return ProductRepository.update(product, validated_data)
