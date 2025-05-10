from .serializers import (ProductCreateSerializer, ProductGetSerializer,
                          ProductRemoveSerializer, ProductEditSerializer)
from rest_framework import status, permissions, generics
from rest_framework.response import Response
from .models import Product
from .services import ProductService
from users.models import MyUser


class CreateProductView(generics.CreateAPIView):
    serializer_class = ProductCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product = ProductService.create_product(
            validated_data=serializer.validated_data,
            user=request.user
        )

        output_serializer = ProductGetSerializer(product)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)


class GetAllUsersProductsView(generics.ListAPIView):
    serializer_class = ProductGetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        products = ProductService.list_user_products(user)
        return products

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GetAllProductsView(generics.ListAPIView):
    serializer_class = ProductGetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        products = ProductService.list_all_products()
        return products

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GetProductView(generics.RetrieveAPIView):
    serializer_class = ProductGetSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def retrieve(self, request, *args, **kwargs):
        product = ProductService.get_product(kwargs['id'])
        serializer = self.get_serializer(product)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProductRemoveView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProductRemoveSerializer
    lookup_field = 'id'

    def destroy(self, request, *args, **kwargs):
        author = ProductService.get_product_author(kwargs['id'])
        if author.id != request.user.id:
            return Response({"detail": "You can only modify your own products."},
                            status=status.HTTP_403_FORBIDDEN)
        if author.id == request.user.id:
            product = ProductService.get_product(kwargs['id'])
            serializer = self.get_serializer(product)

            ProductService.delete_product(kwargs['id'])

            return Response(serializer.data, status=status.HTTP_204_NO_CONTENT)


class ProductEditView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProductEditSerializer
    lookup_field = 'id'

    def update(self, request, *args, **kwargs):
        author = ProductService.get_product_author(kwargs['id'])
        if author.id != request.user.id:
            return Response({"detail": "You can only modify your own products."},
                            status=status.HTTP_403_FORBIDDEN)
        if not request.data:
            return Response({"detail": "No data provided."},
                            status=status.HTTP_400_BAD_REQUEST)
        if author.id == request.user.id:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            updated_product = ProductService.update_product(kwargs['id'], serializer.validated_data)
            output_serializer = self.get_serializer(updated_product)
            return Response(output_serializer.data, status=status.HTTP_200_OK)
