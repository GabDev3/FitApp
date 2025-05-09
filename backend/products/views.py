from .serializers import (ProductCreateSerializer, ProductGetSerializer,
                          ProductRemoveSerializer, ProductEditSerializer)
from rest_framework import status, permissions, generics
from rest_framework.response import Response
from .models import Product
from .services import ProductService

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
    # def perform_create(self, serializer):
    #     if serializer.is_valid():
    #         serializer.save(author_product=self.request.user)
    #     else:
    #         print(serializer.errors)

class GetProductView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductGetSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'id'


class ProductRemoveView(generics.DestroyAPIView):
    queryset = Product.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProductRemoveSerializer
    lookup_field = 'id'

    def destroy(self, request, *args, **kwargs):
        # Get the object to delete
        product = self.get_object()

        # Serialize the product (to return its data after deletion)
        serializer = self.get_serializer(product)

        # Perform the deletion
        product.delete()

        # Return the serialized data of the deleted product
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProductEditView(generics.RetrieveUpdateAPIView):
    queryset = Product.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = ProductEditSerializer
    lookup_field = 'id'