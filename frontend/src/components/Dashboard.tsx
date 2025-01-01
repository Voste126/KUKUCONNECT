import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  AppShell,
  Table,
  Button,
  Group,
  Text,
  Container,
  Card,
  Grid,
  Title,
  TextInput,
  Select,
  NumberInput,
  Notification,
  rem,
} from '@mantine/core';
import {  IconCheck, IconError404 } from '@tabler/icons-react'
import { AreaChart, CompositeChart, RadarChart } from '@mantine/charts';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../config';


const Dashboard = () => {
  const navigate = useNavigate();
  const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;
  const errorIcon = <IconError404 style={{ width: rem(20), height: rem(20) }} />;
  const [notification, setNotification] = useState<{ title: string; message: string; color: string; icon: React.ReactNode } | null>(null);

  interface Product {
    id: number;
    title: string;
    description: string;
    category: string;
    stock: number;
    price: string;
    created_at: string;
  }

  interface OrderItem {
    product: string;
    quantity: number;
    price: string;
  }

  interface Order {
    id: number;
    buyer: string;
    total_price: string;
    items: OrderItem[];
    created_at: string;
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  interface AreaData {
    date: string;
    revenue: number;
  }
  
  const [areaData, setAreaData] = useState<AreaData[]>([]);
  interface CompositeData {
    date: string;
    stock: number;
    sales: number;
  }
  
  const [compositeData, setCompositeData] = useState<CompositeData[]>([]);
  interface RadarData {
    product: string;
    stock: number;
    sold: number;
  }
  
  const [radarData, setRadarData] = useState<RadarData[]>([]);

  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    category: '',
    stock: 0,
    price: '',
  });

  const token = localStorage.getItem('accessToken');

  if (!token) {
    // Redirect to login page if token is missing
    navigate('/login');
    console.log('Token missing');
  }

  // Fetch products for the logged-in farmer
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/products/my-products/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setProducts(response.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
          console.log('Unauthorized');
        } else {
          console.error('Error fetching products:', error);
        }
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/products/orders/farmer/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchProducts();
    fetchOrders();
  }, [token]);

  

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsEditing(true);
  };


  const handleSaveEdit = async () => {
    if (!editingProduct) return;

    try {
      const response = await axios.put(
        `${BASE_URL}/api/products/edit/${editingProduct.id}/`,
        editingProduct,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      // Update the products list with the edited product
      setProducts(
        products.map((product) =>
          product.id === editingProduct.id ? response.data : product
        )
      );
      setIsEditing(false);
      setEditingProduct(null);
      setNotification({
      title: 'Update Success',
      message: 'Update processed successfully!',
      color: 'green',
      icon: checkIcon,
    });
    } catch (error) {
      console.error('Error updating product:', error);
      setNotification({
      title: 'Error',
      message: 'Failed to update product. Please try again.',
      color: 'red',
      icon: errorIcon,
    });
  };
}



  const handleAddProduct = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/products/new/`,
        newProduct,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setProducts([...products, response.data]);
      setNewProduct({ title: '', description: '', category: '', stock: 0, price: '' }); // Reset the form
      setNotification({
        title: 'Product Created',
        message: 'The product has been successfully created.',
        color: 'green',
        icon: checkIcon,
      });
    } catch (error) {
      console.error('Error adding product:', error);
      setNotification({
        title: 'Error',
        message: 'Failed to create product. Please try again.',
        color: 'red',
        icon: errorIcon,
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${BASE_URL}/api/products/edit/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((product) => product.id !== id));
      setNotification({
        title: 'Product Deleted',
        message: 'The product has been successfully deleted.',
        color: 'green',
        icon: checkIcon,
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      setNotification({
        title: 'Error',
        message: 'Failed to delete product. Please try again.',
        color: 'red',
        icon: errorIcon,
        
      });
    }
  };

  useEffect(() => {
    // Calculate total revenue and sales
    const revenue = (orders ?? []).reduce((acc, order) => acc + parseFloat(order.total_price), 0);
    const sales = (orders ?? []).reduce((acc, order) => acc + order.items.reduce((sum, item) => sum + item.quantity, 0), 0);
    setTotalRevenue(revenue);
    setTotalSales(sales);

    // Update chart data
    const areaChartData = (orders ?? []).map((order) => ({
      date: new Date(order.created_at).toLocaleDateString(),
      revenue: parseFloat(order.total_price),
    }));

    const productPerformance = products.map((product) => ({
      date: new Date().toLocaleDateString(),
      stock: product.stock,
      sales: (orders ?? []).reduce((sum, order) =>
        sum + order.items.filter((item) => item.product === product.title).reduce((count, item) => count + item.quantity, 0),
      0),
    }));

    const radarChartData = products.map((product) => ({
      product: product.title,
      stock: product.stock,
      sold: (orders ?? []).reduce((sum, order) =>
        sum + order.items.filter((item) => item.product === product.title).reduce((count, item) => count + item.quantity, 0),
      0),
    }));

    setAreaData(areaChartData);
    setCompositeData(productPerformance);
    setRadarData(radarChartData);
  }, [products, orders]);

  return (
    <AppShell padding="md">
      <Container size="lg">
        {/* Revenue and Sales */}
         <Grid>
          <Grid.Col span={6}>
            <Card shadow="sm" p="lg" style={{ backgroundColor: 'darkgreen', color: '#fff' }}>
              <Title order={3}>Revenue</Title>
              <Text size="xl">${totalRevenue.toFixed(2)}</Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={6}>
            <Card shadow="sm" p="lg" style={{ backgroundColor: '#9E6D29', color: '#fff' }}>
              <Title order={3}>Sales</Title>
              <Text size="xl">{totalSales} Units</Text>
            </Card>
          </Grid.Col>
        </Grid>

        <Grid mt="xl">
          <Grid.Col span={12}>
            <Title order={4} mb="sm">Sales Trends</Title>
            <AreaChart
              h={300}
              data={areaData}
              dataKey="date"
              series={[{ name: 'Revenue', color: 'blue' }]}
            />
          </Grid.Col>
          <Grid.Col span={12} mt="xl">
            <Title order={4} mb="sm">Product Performance</Title>
            <CompositeChart
              h={300}
              data={compositeData}
              dataKey="date"
              withLegend
              maxBarWidth={30}
              series={[
                { name: 'Stock', color: 'gray', type: 'bar' },
                { name: 'Sales', color: 'green', type: 'line' },
              ]}
            />
          </Grid.Col>
          <Grid.Col span={12} mt="xl">
            <Title order={4} mb="sm">Stock vs Sold</Title>
            <RadarChart
              h={300}
              data={radarData}
              dataKey="product"
              withPolarRadiusAxis
              series={[
                { name: 'Stock', color: 'lime', opacity: 0.5 },
                { name: 'Sold', color: 'cyan', opacity: 0.5 },
              ]}
            />
          </Grid.Col>
        </Grid>

         {/* Product Table */}
        <Card shadow="sm" p="lg" mt="xl">
          <Title order={4}>Manage Products</Title>
          <Table mt="md">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Description</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product: Product) => (
                <tr key={product.id}>
                  <td>{product.title}</td>
                  <td>{product.description}</td>
                  <td>{product.category}</td>
                  <td>{product.stock}</td>
                  <td>${product.price}</td>
                  <td>
                    <Group>
                      <Button size="xs" onClick={() => handleEdit(product)}>
                        Edit
                      </Button>
                      <Button
                        size="xs"
                        color="red"
                        onClick={() => handleDelete(product.id)}
                      >
                        Delete
                      </Button>
                    </Group>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>

        {/* Edit Product Form */}
        {isEditing && editingProduct && (
          <Card shadow="sm" p="lg" mt="xl">
            <Title order={4}>Edit Product</Title>
            <TextInput
              label="Title"
              placeholder="Enter product title"
              value={editingProduct.title}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, title: e.target.value })
              }
            />
            <TextInput
              label="Description"
              placeholder="Enter product description"
              value={editingProduct.description}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  description: e.target.value,
                })
              }
            />
            <Select
              label="Category"
              placeholder="Select category"
              data={['weight', 'number']}
              value={editingProduct.category}
              onChange={(value) =>
                setEditingProduct({
                  ...editingProduct,
                  category: value || '',
                })
              }
            />
            <NumberInput
              label="Stock"
              placeholder="Enter stock quantity"
              value={editingProduct.stock}
              onChange={(value) =>
                setEditingProduct({
                  ...editingProduct,
                  stock: Number(value) || 0,
                })
              }
            />
            <TextInput
              label="Price"
              placeholder="Enter price"
              value={editingProduct.price}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, price: e.target.value })
              }
            />
            <Group mt="md">
              <Button onClick={handleSaveEdit}>Save Changes</Button>
              <Button color="red" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </Group>
            {notification && (
        <Notification icon={notification.icon} color={notification.color} title={notification.title} mt="md">
          {notification.message}
        </Notification>
      )}
          </Card>
        )}
        {/* Add New Product Form */}
        <Card shadow="sm" p="lg" mt="xl" style={{marginBottom: '8rem'}}>
          <Title order={4}>Add New Product</Title>
          <TextInput
            label="Title"
            placeholder="Enter product title"
            value={newProduct.title}
            onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
          />
          <TextInput
            label="Description"
            placeholder="Enter product description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          />
          <Select
            label="Category"
            placeholder="Select category"
            data={['weight', 'number']}
            value={newProduct.category}
            onChange={(value) => setNewProduct({ ...newProduct, category: value || '' })}
          />
          <NumberInput
            label="Stock"
            placeholder="Enter stock quantity"
            value={newProduct.stock}
            onChange={(value) => setNewProduct({ ...newProduct, stock: Number(value) || 0 })}
          />
          <TextInput
            label="Price"
            placeholder="Enter price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          />
          <Button mt="md" onClick={handleAddProduct}>
            Create Product
          </Button>
          {notification && (
        <Notification icon={notification.icon} color={notification.color} title={notification.title} mt="md">
          {notification.message}
        </Notification>
      )}
        </Card>

        {/* Orders Table */}
        <Card shadow="sm" p="lg" mt="xl" style={{marginBottom: '10rem'}}>
          <Title order={4}>Recent Orders</Title>
          <Table mt="md">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Buyer</th>
                <th>Total Price</th>
                <th>Items</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order: Order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.buyer}</td>
                  <td>${order.total_price}</td>
                  <td>
                    <ul>
                      {order.items.map((item) => (
                        <li key={item.product}>
                          {item.product} x {item.quantity} @ ${item.price}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      </Container>
      
    </AppShell>
  );
};

export default Dashboard;
