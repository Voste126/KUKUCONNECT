from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source="farmer.username", read_only=True)

    class Meta:
        model = Product
        fields = [
            "id", "title", "description", "category", "price", 
            "stock", "created_at", "updated_at", "farmer_name"
        ]
        read_only_fields = ["id", "created_at", "updated_at", "farmer_name"]
