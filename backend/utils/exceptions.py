from rest_framework.exceptions import APIException

class ProductNotFound(APIException):
    status_code = 404
    default_detail = "Product not found."
    default_code = "product_not_found"
