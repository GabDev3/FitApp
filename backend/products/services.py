from .repositories import ProductRepository
from .serializers import ProductEditSerializer
from rest_framework import status
from rest_framework.response import Response
from users.services import UserService

class ProductService:

    @staticmethod
    def list_all_products():
        return ProductRepository.get_all()

    @staticmethod
    def list_user_products(user):
        return ProductRepository.get_all_by_user(user)

    @staticmethod
    def create_product(validated_data, user):
        validated_data['author_product'] = user
        return ProductRepository.create(validated_data)

    @staticmethod
    def get_product(product_id):
        return ProductRepository.get_by_id(product_id)

    @staticmethod
    def delete_product(product_id):
        product = ProductRepository.get_by_id(product_id)
        return ProductRepository.delete(product)

    @staticmethod
    def update_product(product_id, user, data):
        product = ProductRepository.get_by_id(product_id)
        author = product.author_product

        
        if author.id != user.id and not UserService.user_is_admin(user.id):
            return Response({"detail": "You can't edit this product unless you're an author or an admin."},
                            status=status.HTTP_403_FORBIDDEN)

        
        serializer = ProductEditSerializer(instance=product, data=data, partial=True)
        serializer.is_valid(raise_exception=True)

        
        return ProductRepository.update(product, serializer.validated_data)

    @staticmethod
    def get_product_author(product_id):
        return ProductRepository.get_product_author(product_id)