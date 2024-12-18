import pytest
from rest_framework import status
from django.urls import reverse
from django.contrib.auth import get_user_model
from products.models import Product, Order, OrderItem

User = get_user_model()

@pytest.fixture
def api_client():
    from rest_framework.test import APIClient
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

@pytest.mark.django_db
def test_farmer_orders(api_client, create_user, get_token):
    farmer = create_user(username='farmer1', password='password123')
    buyer = create_user(username='buyer1', password='password123', email='buyer1@example.com')
    token = get_token('farmer1', 'password123')
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    product = Product.objects.create(farmer=farmer, title='Organic Chicken', category='number', price=200.00, stock=10)
    order = Order.objects.create(buyer=buyer, total_price=400.00)
    OrderItem.objects.create(order=order, product=product, quantity=2, price=200.00)

    response = api_client.get('/api/products/orders/farmer/')
    assert response.status_code == 200
    assert len(response.data) == 1
    assert float(response.data[0]['total_price']) == 400.00  
