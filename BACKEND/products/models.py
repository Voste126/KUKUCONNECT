from django.db import models
from django.conf import settings

class Product(models.Model):
    FARMER_CHOICES = [
        ('weight', 'By Weight'),
        ('number', 'By Number'),
    ]
    farmer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE, 
        related_name="products"
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=10, choices=FARMER_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()  # e.g., weight in kg or count of chickens
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
