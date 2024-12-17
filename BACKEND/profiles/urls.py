from django.urls import path
from .views import (
    FarmerProfileCreateView, FarmerProfileDetailView,
    BuyerProfileCreateView, BuyerProfileDetailView,
)

urlpatterns = [
    # Farmer Profile Endpoints
    path('farmers/', FarmerProfileCreateView.as_view(), name='create-farmer-profile'),
    path('farmers/<int:pk>/', FarmerProfileDetailView.as_view(), name='farmer-profile-detail'),

    # Buyer Profile Endpoints
    path('buyers/', BuyerProfileCreateView.as_view(), name='create-buyer-profile'),
    path('buyers/<int:pk>/', BuyerProfileDetailView.as_view(), name='buyer-profile-detail'),
]

