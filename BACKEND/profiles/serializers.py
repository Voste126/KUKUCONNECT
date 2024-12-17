from rest_framework import serializers
from .models import FarmerProfile, BuyerProfile

class FarmerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = FarmerProfile
        fields = ['id', 'user', 'farm_name', 'location', 'phone_number', 'farm_size', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

class BuyerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = BuyerProfile
        fields = ['id', 'user', 'business_name', 'phone_number', 'preferred_products', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']