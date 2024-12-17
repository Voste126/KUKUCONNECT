from rest_framework.test import APITestCase, APIClient
from rest_framework import status
#from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from django.urls import reverse

User = get_user_model()

class UserAuthenticationTests(APITestCase):
    def setUp(self):
        """Set up initial data for tests."""
        self.client = APIClient()
        self.register_url = reverse('user-register')  # URL name for registration
        self.login_url = reverse('token_obtain_pair')  # JWT token login endpoint

        # Create a test user for login tests
        self.user_data = {
            "username": "farmer1",
            "password": "TestPass123",
            "email": "farmer1@example.com",
        }
        self.user = User.objects.create_user(**self.user_data)

    def test_user_registration_success(self):
        """Test successful user registration."""
        data = {
            "username": "buyer1",
            "password": "TestPass123",
            "email": "buyer1@example.com",
            "user_type": "buyer",
        }
        response = self.client.post(self.register_url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("username", response.data)
        self.assertEqual(response.data["username"], "buyer1")

    def test_user_registration_failure(self):
        """Test registration with invalid data (e.g., missing fields)."""
        data = {"username": "", "password": ""}
        response = self.client.post(self.register_url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("username", response.data)
        self.assertIn("password", response.data)

    def test_user_login_success(self):
        """Test successful user login and JWT token generation."""
        data = {
            "username": self.user_data["username"],
            "password": self.user_data["password"],
        }
        response = self.client.post(self.login_url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)  # Check for JWT access token
        self.assertIn("refresh", response.data)  # Check for JWT refresh token

    def test_user_login_failure(self):
        """Test login failure with invalid credentials."""
        data = {
            "username": self.user_data["username"],
            "password": "WrongPass123",
        }
        response = self.client.post(self.login_url, data)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("detail", response.data)  # Check for error message

    def test_access_protected_route(self):
        """Test accessing a protected route with JWT token."""
        # Obtain JWT tokens
        data = {
            "username": self.user_data["username"],
            "password": self.user_data["password"],
        }
        login_response = self.client.post(self.login_url, data)
        access_token = login_response.data["access"]

        # Use the token to access a protected route
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")
        protected_url = reverse('protected-view')  # Replace with actual protected endpoint

        response = self.client.get(protected_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_protected_route_without_token(self):
        """Test accessing protected route without JWT token."""
        protected_url = reverse('protected-view')  # Replace with actual protected endpoint

        response = self.client.get(protected_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
