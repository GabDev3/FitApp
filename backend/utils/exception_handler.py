from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        return Response({
            "error": response.data.get("detail", "Unexpected error"),
            "status": response.status_code
        }, status=response.status_code)

    return Response({
        "error": str(exc),
        "status": status.HTTP_500_INTERNAL_SERVER_ERROR
    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
