import pytest
from rest_framework import status
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def create_user(db):
    def make_user(**kwargs):
        if 'email' not in kwargs:
            kwargs['email'] = f"{kwargs['username']}@example.com"
        return User.objects.create_user(**kwargs)
    return make_user

@pytest.fixture
def get_token(api_client):
    def obtain_token(username, password):
        response = api_client.post(reverse('token_obtain_pair'), {
            'username': username,
            'password': password
        })
        return response.data
    return obtain_token

@pytest.mark.django_db
def test_user_registration_success(api_client):
    """Test successful user registration."""
    register_url = reverse('user-register')
    data = {
        "username": "buyer1",
        "password": "TestPass123",
        "email": "buyer1@example.com",
        "user_type": "buyer",
    }
    response = api_client.post(register_url, data)

    assert response.status_code == status.HTTP_201_CREATED
    assert "username" in response.data
    assert response.data["username"] == "buyer1"

@pytest.mark.django_db
def test_user_registration_failure(api_client):
    """Test registration with invalid data (e.g., missing fields)."""
    register_url = reverse('user-register')
    data = {"username": "", "password": ""}
    response = api_client.post(register_url, data)

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "username" in response.data
    assert "password" in response.data

@pytest.mark.django_db
def test_user_login_success(api_client, create_user):
    """Test successful user login and JWT token generation."""
    user = create_user(username='farmer1', password='TestPass123', email='farmer1@example.com')
    login_url = reverse('token_obtain_pair')
    data = {
        "username": "farmer1",
        "password": "TestPass123",
    }
    response = api_client.post(login_url, data)

    assert response.status_code == status.HTTP_200_OK
    assert "access" in response.data  # Check for JWT access token
    assert "refresh" in response.data  # Check for JWT refresh token

@pytest.mark.django_db
def test_user_login_failure(api_client, create_user):
    """Test login failure with invalid credentials."""
    user = create_user(username='farmer1', password='TestPass123', email='farmer1@example.com')
    login_url = reverse('token_obtain_pair')
    data = {
        "username": "farmer1",
        "password": "WrongPass123",
    }
    response = api_client.post(login_url, data)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "detail" in response.data  # Check for error message

@pytest.mark.django_db
def test_access_protected_route(api_client, create_user, get_token):
    """Test accessing a protected route with JWT token."""
    user = create_user(username='farmer1', password='TestPass123', email='farmer1@example.com')
    tokens = get_token('farmer1', 'TestPass123')
    access_token = tokens["access"]

    # Use the token to access a protected route
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")
    protected_url = reverse('protected-view')  # Replace with actual protected endpoint

    response = api_client.get(protected_url)
    assert response.status_code == status.HTTP_200_OK

@pytest.mark.django_db
def test_protected_route_without_token(api_client):
    """Test accessing protected route without JWT token."""
    protected_url = reverse('protected-view')  # Replace with actual protected endpoint

    response = api_client.get(protected_url)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_get_user_details_success(api_client, create_user, get_token):
    """Test retrieving user details for the logged-in user."""
    user = create_user(username='farmer1', password='TestPass123', email='farmer1@example.com')
    tokens = get_token('farmer1', 'TestPass123')
    access_token = tokens["access"]

    # Use the token to access the `/api/users/me/` endpoint
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")
    response = api_client.get(reverse('user-detail'))

    # Assert the response status and data
    assert response.status_code == status.HTTP_200_OK
    assert response.data["username"] == "farmer1"
    assert response.data["id"] == user.id

@pytest.mark.django_db
def test_get_user_details_unauthenticated(api_client):
    """Test retrieving user details without authentication."""
    response = api_client.get(reverse('user-detail'))

    # Assert the response status for unauthenticated access
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "detail" in response.data
    assert response.data["detail"] == "Authentication credentials were not provided."


@pytest.mark.django_db
def test_user_logout(api_client, create_user, get_token):
    user = create_user(username='farmer1', password='TestPass123', email='farmer1@example.com')
    tokens = get_token('farmer1', 'TestPass123')
    refresh_token = tokens["refresh"]
    access_token = tokens["access"]
    
    # Authenticate the client
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')

    # Use the refresh token to log out
    logout_url = reverse('logout')
    response = api_client.post(logout_url, {"refresh_token": refresh_token})

    # Assert the response status
    assert response.status_code == status.HTTP_205_RESET_CONTENT