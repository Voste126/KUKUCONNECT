import pytest
from rest_framework import status
from django.urls import reverse
from django.contrib.auth import get_user_model
from products.models import Product, Order, OrderItem
from django.utils.crypto import get_random_string

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
def test_marketplace_view(api_client, create_user):
    user = create_user(username='farmer1', password='password123')
    Product.objects.create(farmer=user, title='Organic Chicken', description='Freshly farmed organic chicken.', category='number', price=200.00, stock=10)
    
    response = api_client.get('/api/products/marketplace/')
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 1
    assert response.data[0]['title'] == 'Organic Chicken'

@pytest.mark.django_db
def test_create_order(api_client, create_user, get_token):
    farmer = create_user(username='farmer1', password='password123')
    buyer = create_user(username='buyer1', password='password123', email='buyer1@example.com')
    token = get_token('buyer1', 'password123')
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    product = Product.objects.create(farmer=farmer, title='Organic Chicken', description='Freshly farmed organic chicken.', category='number', price=200.00, stock=10)
    order_data = {
        'buyer': buyer.id,
        'items': [
            {
                'product': product.id,
                'quantity': 2
            }
        ]
    }
    response = api_client.post('/api/products/orders/', order_data, format='json')
    assert response.status_code == status.HTTP_201_CREATED
    assert response.data['total_price'] == 400.00  # 200.00 * 2 (quantity)


@pytest.mark.django_db
def test_get_order_detail(api_client, create_user, get_token):
    farmer = create_user(username='farmer1', password='password123')
    buyer = create_user(username='buyer1', password='password123', email='buyer1@example.com')
    token = get_token('buyer1', 'password123')
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    product = Product.objects.create(farmer=farmer, title='Organic Chicken', description='Freshly farmed organic chicken.', category='number', price=200.00, stock=10)
    order = Order.objects.create(buyer=buyer, total_price=400.00)
    OrderItem.objects.create(order=order, product=product, quantity=2)

    response = api_client.get(f'/api/products/orders/{order.id}/')
    assert response.status_code == status.HTTP_200_OK
    assert response.data['id'] == order.id

@pytest.mark.django_db
def test_delete_order(api_client, create_user, get_token):
    buyer = create_user(username='buyer1', password='password123', email='buyer1@example.com')
    token = get_token('buyer1', 'password123')
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    # Create an order
    order = Order.objects.create(buyer=buyer, total_price=200.00)

    # Perform DELETE request
    response = api_client.delete(f'/api/products/orders/{order.id}/')

    # Assert deletion was successful
    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert not Order.objects.filter(id=order.id).exists()

@pytest.mark.django_db
def test_buyer_orders(api_client, create_user, get_token):
    farmer = create_user(username='farmer1', password='password123')
    buyer = create_user(username='buyer1', password='password123', email='buyer1@example.com')
    token = get_token('buyer1', 'password123')
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    product = Product.objects.create(farmer=farmer, title='Organic Chicken', category='number', price=200.00, stock=10)
    order = Order.objects.create(buyer=buyer, total_price=400.00)
    OrderItem.objects.create(order=order, product=product, quantity=2, price=200.00)

    response = api_client.get('/api/products/orders/buyer/')
    assert response.status_code == 200
    assert len(response.data) == 1
    assert float(response.data[0]['total_price']) == 400.00  

