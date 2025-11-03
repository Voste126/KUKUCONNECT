from django.shortcuts import render, redirect, get_object_or_404
import logging
from rest_framework import generics, permissions, status, viewsets
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
    
    # REMOVED: lookup_field = 'user_id' (This was insecure)

    # ---
    # FIXED: BROKEN ACCESS CONTROL
    # This function retrieves the profile object for the currently
    # authenticated user, ignoring any ID passed in the URL.
    # This ensures a user can ONLY see and edit their *own* profile.
    # ---
    @swagger_auto_schema(operation_description="Retrieve or Update the logged-in Farmer's Profile")
    def get_object(self):
        """
        Return the profile for the currently authenticated user.
        """
        # Ensure we get the profile linked to the user making the request
        obj = get_object_or_404(self.get_queryset(), user=self.request.user)
        self.check_object_permissions(self.request, obj)
        return obj

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
    
    # REMOVED: lookup_field = 'user_id' (This was insecure)

    # ---
    # FIXED: BROKEN ACCESS CONTROL
    # Same fix as FarmerProfileDetailView.
    # This ensures a user can ONLY see and edit their *own* profile.
    # ---
    @swagger_auto_schema(operation_description="Retrieve or Update the logged-in Buyer's Profile")
    def get_object(self):
        """
        Return the profile for the currently authenticated user.
        """
        # Ensure we get the profile linked to the user making the request
        obj = get_object_or_404(self.get_queryset(), user=self.request.user)
        self.check_object_permissions(self.request, obj)
        return obj