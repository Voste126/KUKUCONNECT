from rest_framework import generics, permissions
from .models import Product, Order
from .serializers import ProductSerializer, OrderSerializer
from drf_yasg.utils import swagger_auto_schema

class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]
    

class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class ProductCreateView(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    # ADDED: Automatically assign the logged-in user as the farmer
    def perform_create(self, serializer):
        serializer.save(farmer=self.request.user)


# a view to be able to edit a particular product accordding to its id
class ProductEditView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    # ---
    # FIXED: BROKEN ACCESS CONTROL
    # This function ensures that the logged-in user can ONLY see,
    # edit, or delete products that they own (i.e., where farmer=request.user).
    # ---
    def get_queryset(self):
        """
        This view should only return products owned by the authenticated user.
        """
        user = self.request.user
        if user.is_authenticated:
            return self.queryset.filter(farmer=user)
        return Product.objects.none()


class OrderCreateView(generics.CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    # ADDED: Automatically assign the logged-in user as the buyer
    def perform_create(self, serializer):
        serializer.save(buyer=self.request.user)


class OrderDetailView(generics.RetrieveDestroyAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Ensure the authenticated user can only delete their own orders.
        """
        # This view correctly implements access control. No changes needed.
        if getattr(self, 'swagger_fake_view', False):
            # queryset just for schema generation metadata
            return Order.objects.none()
        
        return self.queryset.filter(buyer=self.request.user)

class MarketplaceView(generics.ListAPIView):
    # This is a public view, so no permission classes are needed.
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class FarmerProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # This view correctly implements access control. No changes needed.
        user = self.request.user
        if user.is_authenticated:
            return Product.objects.filter(farmer=user)
        return Product.objects.none()
    
class FarmerOrdersView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # This view correctly implements access control. No changes needed.
        farmer = self.request.user
        return Order.objects.filter(items__product__farmer=farmer).distinct()

class BuyerOrdersView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # This view correctly implements access control. No changes needed.
        buyer = self.request.user
        return Order.objects.filter(buyer=buyer)