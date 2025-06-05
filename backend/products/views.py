from .serializers import (ProductCreateSerializer, ProductGetSerializer,
                          ProductRemoveSerializer, ProductEditSerializer)
from rest_framework import status, permissions, generics
from rest_framework.response import Response
# from .models import Product
from .services import ProductService
from users.services import UserService
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
from drf_spectacular.types import OpenApiTypes
from rest_framework.response import Response


class CreateProductView(generics.CreateAPIView):
    serializer_class = ProductCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="Create a new product",
        description="Create a new product with nutritional information",
        request=ProductCreateSerializer,
        responses={
            201: ProductGetSerializer,
            400: OpenApiExample(
                'Bad Request',
                value={'error': 'Invalid data provided'}
            ),
            401: OpenApiExample(
                'Unauthorized',
                value={'error': 'Authentication required'}
            )
        },
        tags=['Products']
    )

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

    @extend_schema(
        summary="Get current user's products",
        description="Retrieve products created by the current user",
        responses={
            200: ProductGetSerializer(many=True),
            401: OpenApiExample(
                'Unauthorized',
                value={'error': 'Authentication required'}
            )
        },
        tags=['Products']
    )

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

    @extend_schema(
        summary="Get all products",
        description="Retrieve all available products",
        responses={
            200: ProductGetSerializer(many=True),
            401: OpenApiExample(
                'Unauthorized',
                value={'error': 'Authentication required'}
            )
        },
        tags=['Products']
    )

    def get_queryset(self):
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

    @extend_schema(
        summary="Get product by ID",
        description="Retrieve a specific product by its ID",
        parameters=[
            OpenApiParameter(
                name='id',
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description='Unique identifier for the product'
            )
        ],
        responses={
            200: ProductGetSerializer,
            404: OpenApiExample(
                'Not Found',
                value={'error': 'Product not found'}
            ),
            401: OpenApiExample(
                'Unauthorized',
                value={'error': 'Authentication required'}
            )
        },
        tags=['Products']
    )

    def retrieve(self, request, *args, **kwargs):
        product = ProductService.get_product(kwargs['id'])
        serializer = self.get_serializer(product)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProductRemoveView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProductRemoveSerializer
    lookup_field = 'id'

    @extend_schema(
        summary="Delete a product",
        description="Delete a product (only by author or admin)",
        parameters=[
            OpenApiParameter(
                name='id',
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description='Unique identifier for the product to delete'
            )
        ],
        responses={
            204: ProductRemoveSerializer,
            403: OpenApiExample(
                'Forbidden',
                value={'detail': "You can't edit this product unless you're an author or an admin."}
            ),
            404: OpenApiExample(
                'Not Found',
                value={'error': 'Product not found'}
            )
        },
        tags=['Products']
    )

    def destroy(self, request, *args, **kwargs):
        author = ProductService.get_product_author(kwargs['id'])
        if author.id != request.user.id and not UserService.user_is_admin(request.user.id):
            return Response({"detail": "You can't edit this product unless you're an author or an admin."},
                            status=status.HTTP_403_FORBIDDEN)
        if author.id == request.user.id or UserService.user_is_admin(request.user.id):
            product = ProductService.get_product(kwargs['id'])
            serializer = self.get_serializer(product)

            ProductService.delete_product(kwargs['id'])

            return Response(serializer.data, status=status.HTTP_204_NO_CONTENT)


class ProductEditView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProductEditSerializer
    lookup_field = 'id'

    @extend_schema(
        summary="Update a product",
        description="Update product information (only by author or admin)",
        request=ProductEditSerializer,
        responses={
            200: ProductEditSerializer,
            400: OpenApiExample(
                'Bad Request',
                value={'detail': 'No data provided.'}
            ),
            403: OpenApiExample(
                'Forbidden',
                value={'detail': "You can't edit this product unless you're an author or an admin."}
            ),
            404: OpenApiExample(
                'Not Found',
                value={'error': 'Product not found'}
            )
        },
        tags=['Products']
    )


    def update(self, request, *args, **kwargs):
        product_id = kwargs['id']
        user = request.user
        data = request.data

        if not data:
            return Response({"detail": "No data provided."}, status=status.HTTP_400_BAD_REQUEST)

        result = ProductService.update_product(product_id, user, data)

        if isinstance(result, Response):
            return result  # already a Response object with error

        serializer = self.get_serializer(result)
        return Response(serializer.data, status=status.HTTP_200_OK)