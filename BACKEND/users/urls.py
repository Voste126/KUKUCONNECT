from django.urls import path
from .views import UserRegistrationView, CustomTokenObtainPairView, ProtectedView, UserDetailView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # Registration
    path('register/', UserRegistrationView.as_view(), name='user-register'),

    # JWT Token
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('protected/', ProtectedView.as_view(), name='protected-view'),

    path('me/', UserDetailView.as_view(), name='user-detail'),
]
