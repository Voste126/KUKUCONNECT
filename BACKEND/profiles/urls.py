from django.urls import path
from .views import FarmerProfileCreateView, FarmerProfileDetailView, BuyerProfileCreateView, BuyerProfileDetailView

urlpatterns = [
    path('farmers/', FarmerProfileCreateView.as_view(), name='farmer-profile-create'),
    path('farmers/<int:user_id>/', FarmerProfileDetailView.as_view(), name='farmer-profile-detail'),
    path('buyers/', BuyerProfileCreateView.as_view(), name='buyer-profile-create'),
    path('buyers/<int:user_id>/', BuyerProfileDetailView.as_view(), name='buyer-profile-detail'),
]

