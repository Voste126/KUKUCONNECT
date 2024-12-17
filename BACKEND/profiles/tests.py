import pytest
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def create_user(db):
    def make_user(**kwargs):
        return User.objects.create_user(**kwargs)
    return make_user

@pytest.fixture
def get_token(api_client):
    def obtain_token(username, password):
        response = api_client.post(reverse('token_obtain_pair'), {
            'username': username,
            'password': password
        })
        return response.data['access']
    return obtain_token

@pytest.mark.django_db
def test_create_farmer_profile(api_client, create_user, get_token):
    user = create_user(username='farmer1', password='password123')
    token = get_token('farmer1', 'password123')
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    data = {
        'farm_name': 'Green Acres',
        'location': 'Nairobi',
        'phone_number': '123456789',
        'farm_size': 50.5
    }
    response = api_client.post('/api/profiles/farmers/', data)
    assert response.status_code == status.HTTP_201_CREATED
    assert response.data['farm_name'] == 'Green Acres'

@pytest.mark.django_db
def test_create_buyer_profile(api_client, create_user, get_token):
    user = create_user(username='buyer1', password='password123')
    token = get_token('buyer1', 'password123')
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    data = {
        'business_name': 'Fresh Produce Ltd',
        'phone_number': '987654321',
        'preferred_products': 'Vegetables'
    }
    response = api_client.post('/api/profiles/buyers/', data)
    assert response.status_code == status.HTTP_201_CREATED
    assert response.data['business_name'] == 'Fresh Produce Ltd'

#test for updating a particular farmer profile and buyer profile
