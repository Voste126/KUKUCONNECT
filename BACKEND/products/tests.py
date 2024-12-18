import pytest
from rest_framework import status
from django.urls import reverse
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.fixture
def api_client():
    from rest_framework.test import APIClient
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
def test_create_product(api_client, create_user, get_token):
    user = create_user(username='farmer1', password='password123')
    token = get_token('farmer1', 'password123')
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    data = {
        'title': 'Organic Chicken',
        'description': 'Freshly farmed organic chicken.',
        'category': 'number',
        'price': 200.00,
        'stock': 10
    }
    response = api_client.post('/api/products/new/', data)
    assert response.status_code == status.HTTP_201_CREATED
    assert response.data['title'] == 'Organic Chicken'

@pytest.mark.django_db
def test_update_product(api_client, create_user, get_token):
    user = create_user(username='farmer1', password='password123')
    token = get_token('farmer1', 'password123')
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    # Create a product first
    data = {
        'title': 'Organic Chicken',
        'description': 'Freshly farmed organic chicken.',
        'category': 'number',
        'price': 200.00,
        'stock': 10
    }
    response = api_client.post('/api/products/new/', data)
    assert response.status_code == status.HTTP_201_CREATED

    # Update the product
    product_id = response.data['id']
    update_data = {
        'title': 'Organic Chicken Updated',
        'description': 'Freshly farmed organic chicken, now even better.',
        'category': 'number',
        'price': 250.00,
        'stock': 15
    }
    response = api_client.put(f'/api/products/{product_id}/', update_data)
    assert response.status_code == status.HTTP_200_OK
    assert response.data['title'] == 'Organic Chicken Updated'

@pytest.mark.django_db
def test_delete_product(api_client, create_user, get_token):
    user = create_user(username='farmer1', password='password123')
    token = get_token('farmer1', 'password123')
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    # Create a product first
    data = {
        'title': 'Organic Chicken',
        'description': 'Freshly farmed organic chicken.',
        'category': 'number',
        'price': 200.00,
        'stock': 10
    }
    response = api_client.post('/api/products/new/', data)
    assert response.status_code == status.HTTP_201_CREATED

    # Delete the product
    product_id = response.data['id']
    response = api_client.delete(f'/api/products/{product_id}/')
    assert response.status_code == status.HTTP_204_NO_CONTENT

@pytest.mark.django_db
def test_get_farmer_products(api_client, create_user, get_token):
    user = create_user(username='farmer1', password='password123')
    token = get_token('farmer1', 'password123')
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    # Create a product first
    data = {
        'title': 'Organic Chicken',
        'description': 'Freshly farmed organic chicken.',
        'category': 'number',
        'price': 200.00,
        'stock': 10
    }
    response = api_client.post('/api/products/new/', data)
    assert response.status_code == status.HTTP_201_CREATED

    # Get products for the authenticated farmer
    response = api_client.get('/api/products/my-products/')
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 1
    assert response.data[0]['title'] == 'Organic Chicken'