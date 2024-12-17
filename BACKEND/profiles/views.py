from django.shortcuts import render, redirect
import logging
from rest_framework import generics, permissions, status,viewsets
from rest_framework.response import Response
from .models import FarmerProfile, BuyerProfile
from .serializers import FarmerProfileSerializer, BuyerProfileSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

logger = logging.getLogger(__name__)

# Farmer Profile Views
class FarmerProfileCreateView(generics.CreateAPIView):
    serializer_class = FarmerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(operation_description="Create a Farmer Profile", request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['farm_name', 'location', 'phone_number'],
    ))
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

        
class FarmerProfileDetailView(generics.RetrieveUpdateAPIView):
    queryset = FarmerProfile.objects.all()
    serializer_class = FarmerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(operation_description="Retrieve a Farmer Profile")
    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

# Buyer Profile Views
class BuyerProfileCreateView(generics.CreateAPIView):
    serializer_class = BuyerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(operation_description="Create a Buyer Profile", request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['phone_number'],
    ))
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class BuyerProfileDetailView(generics.RetrieveUpdateAPIView):
    queryset = BuyerProfile.objects.all()
    serializer_class = BuyerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(operation_description="Retrieve a Buyer Profile")
    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)
