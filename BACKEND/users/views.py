from django.shortcuts import render
import logging
from rest_framework import generics, permissions, status
from .serializers import CustomUserSerializer, CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenBlacklistView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from drf_yasg.utils import swagger_auto_schema


logger = logging.getLogger(__name__)

# User Registration View
class UserRegistrationView(generics.CreateAPIView):
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.AllowAny]
    @swagger_auto_schema(operation_description="Register a new user", request_body=CustomUserSerializer)
    def post(self, request, *args, **kwargs):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            logger.warning(f"Registration failed: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Custom JWT Login View
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class ProtectedView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CustomUserSerializer

    def get_object(self):
        return self.request.user

class UserDetailView(APIView):
    """
    API view to retrieve details of the logged-in user.
    """
    permission_classes = [IsAuthenticated]
    @swagger_auto_schema(operation_description="Retrieve details of the logged-in user",operation_summary="Retrieve details of the logged-in user")
    def get(self, request, *args, **kwargs):
        user = request.user
        data = {
            "id": user.id,
            "username": user.username,
            "userType": user.user_type  # Assuming user_type is a field in your CustomUser model
        }
        return Response(data)

class LogoutView(APIView):
    """
    API view to log out the user and revoke the JWT token.
    """
    permission_classes = [IsAuthenticated]
    @swagger_auto_schema(operation_description="Log out the user and revoke the JWT token",operation_summary="Log out the user and revoke the JWT token")
    def post(self, request):
        try:
            refresh_token = request.data.get("refresh_token")
            if refresh_token is None:
                return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)
            
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST) # Your logout view is correct and uses token blacklisting, which is good.