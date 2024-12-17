from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

class FarmerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="farmer_profile")
    farm_name = models.CharField(max_length=255,default='Farm Name')
    location = models.CharField(max_length=255, default='Location')
    phone_number = models.CharField(max_length=15, default='Phone Number')
    farm_size = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # Farm size in acres/hectares
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Farmer Profile"

class BuyerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="buyer_profile")
    business_name = models.CharField(max_length=255, null=True, blank=True)
    phone_number = models.CharField(max_length=15,default='Phone Number')
    preferred_products = models.TextField(null=True, blank=True)  # List of preferred products
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Buyer Profile"
