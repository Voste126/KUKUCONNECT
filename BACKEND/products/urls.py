from django.urls import path
from .views import ProductListView, ProductDetailView, ProductCreateView, FarmerProductListView

urlpatterns = [
    path('', ProductListView.as_view(), name='product-list'),
    path('<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('new/', ProductCreateView.as_view(), name='product-create'),
    path('my-products/', FarmerProductListView.as_view(), name='farmer-product-list'),  # New endpoint
]   
