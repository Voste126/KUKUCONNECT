from django.urls import path
from .views import ProductListView, ProductDetailView, ProductCreateView, OrderCreateView, OrderDetailView, MarketplaceView, FarmerProductListView, FarmerOrdersView, BuyerOrdersView
urlpatterns = [
    path('', ProductListView.as_view(), name='product-list'),
    path('<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('new/', ProductCreateView.as_view(), name='product-create'),
    path('orders/', OrderCreateView.as_view(), name='order-create'),
    path('orders/<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
    path('marketplace/', MarketplaceView.as_view(), name='marketplace'),
    path('my-products/', FarmerProductListView.as_view(), name='farmer-products'),
    path('orders/farmer/', FarmerOrdersView.as_view(), name='farmer-orders'),
    path('orders/buyer/', BuyerOrdersView.as_view(), name='buyer-orders'),
]