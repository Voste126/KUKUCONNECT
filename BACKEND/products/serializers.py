from rest_framework import serializers
from .models import Product, OrderItem, Order

class ProductSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source="farmer.username", read_only=True)

    class Meta:
        model = Product
        fields = [
            "id", "title", "description", "category", "price", 
            "stock", "created_at", "updated_at", "farmer_name"
        ]
        read_only_fields = ["id", "created_at", "updated_at", "farmer_name"]

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['farmer'] = request.user
        return super().create(validated_data)
class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['product', 'quantity', 'price']
        read_only_fields = ['price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'buyer', 'total_price', 'items']
        read_only_fields = ['id', 'total_price']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['total_price'] = float(instance.total_price)
        return representation
    
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)  # `total_price` starts with a default value (e.g., 0.0).
        total_price = 0
        for item_data in items_data:
            item_data['price'] = item_data['product'].price * item_data['quantity']
            total_price += item_data['price']
            OrderItem.objects.create(order=order, **item_data)
        order.total_price = total_price
        order.save()  # Update the total_price after creating the items.
        return order


    
class OrderDetailSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'buyer', 'created_at', 'updated_at', 'total_price', 'items']