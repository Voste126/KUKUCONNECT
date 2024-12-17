from django.db import models

# Create your models here.

from django.contrib.auth.models import AbstractUser
from django.db import models

USER_TYPES = (
    ('farmer', 'Farmer'),
    ('buyer', 'Buyer'),
)

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)  # Ensure unique emails
    user_type = models.CharField(max_length=10, choices=USER_TYPES)

    def __str__(self):
        return f"{self.username} ({self.user_type})"
