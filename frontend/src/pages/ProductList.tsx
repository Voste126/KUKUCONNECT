import React, { useState, useEffect } from 'react';
import { Button, TextInput, Select, Grid, Table, Card, NumberInput, Group } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '@/config';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  created_at: string;
  updated_at: string;
  farmer_name: string;
  quantity?: number;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState({ price: '', category: '', title: '' });
  const [cart, setCart] = useState<Product[]>([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  // Fetch products on initial render
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/products/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchProducts();
  }, [token]);

  // Filter products based on criteria
  const handleFilter = () => {
    const filtered = products.filter((product) => {
      const matchesTitle = filter.title
        ? product.title.toLowerCase().includes(filter.title.toLowerCase())
        : true;
      const matchesCategory = filter.category
        ? product.category.toLowerCase() === filter.category.toLowerCase()
        : true;
      const matchesPrice = filter.price
        ? product.price <= parseFloat(filter.price)
        : true;

      return matchesTitle && matchesCategory && matchesPrice;
    });
    setFilteredProducts(filtered);
  };

  // Add a product to the cart
  const addToCart = (product: Product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 0) + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Calculate the total price of items in the cart
  const getTotalPrice = () => {
    return cart
      .reduce((total, item) => total + item.price * (item.quantity || 0), 0)
      .toFixed(2);
  };

  return (
    // 1. Replaced <Container> with a <Grid> to fill the page.
    //    Added padding and gutter for spacing.
    <Grid gutter="xl" style={{ padding: '20px', marginTop: '0.25rem' }}>
      
      {/* 2. Main content column (products and filters) */}
      <Grid.Col span={{ base: 12, md: 9 }}>
        <h2 style={{ textAlign: 'center' }}>Product List</h2>

        {/* Filters Section */}
        <Card withBorder shadow="sm" padding="lg" mb="lg" style={{marginTop: '0.5rem'}}>
          <Grid>
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <TextInput
                label="Search by Title"
                placeholder="Enter product title"
                value={filter.title}
                onChange={(e) => setFilter({ ...filter, title: e.target.value })}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <Select
                label="Filter by Category"
                placeholder="Select category"
                data={[
                  { value: 'fruits', label: 'Fruits' },
                  { value: 'vegetables', label: 'Vegetables' },
                  { value: 'dairy', label: 'Dairy' },
                  { value: 'others', label: 'Others' },
                ]}
                value={filter.category}
                onChange={(value) => setFilter({ ...filter, category: value || '' })}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <NumberInput
                label="Max Price"
                placeholder="Enter maximum price"
                value={filter.price}
                onChange={(value) => setFilter({ ...filter, price: value ? value.toString() : '' })}
              />
            </Grid.Col>
          </Grid>
          <Group mt="lg">
            <Button onClick={handleFilter}>Apply Filters</Button>
          </Group>
        </Card>

        {/* Products Grid */}
        <Grid>
          {filteredProducts.map((product) => (
            // 3. Made product cards responsive
            <Grid.Col key={product.id} span={{ base: 12, sm: 6, lg: 4 }}>
              <Card withBorder shadow="sm" padding="lg">
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <p>Category: {product.category}</p>
                <p>Price: ${product.price}</p>
                <p>Stock: {product.stock}</p>
                <Button
                  fullWidth
                  mt="lg"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </Button>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Grid.Col>

      {/* 4. Cart column (sidebar) */}
      <Grid.Col span={{ base: 12, md: 3 }}>
        {/* 5. Made cart 'sticky' so it stays in view while scrolling */}
        <div style={{ position: 'sticky', top: 20, width: '100%' }}>
          <h3>Shopping Cart</h3>
          <Table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.quantity}</td>
                  <td>${(item.price * (item.quantity || 0)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <h4>Total: ${getTotalPrice()}</h4>
          <Button
            fullWidth
            onClick={() =>
              navigate('/checkout', { state: { cart, totalPrice: getTotalPrice() } })
            }
          >
            Complete Order
          </Button>
        </div>
      </Grid.Col>
    </Grid>
  );
};

export default ProductList;
