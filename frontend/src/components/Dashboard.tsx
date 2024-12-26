// Dashboard.tsx
import  { useState } from 'react';
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
} from '@mantine/core';
import { AreaChart, CompositeChart, RadarChart } from '@mantine/charts';
import { data as areaData } from './areaData.ts';
import { data as compositeData } from './compositeData.ts';
import { data as radarData } from './radarData.ts';

const Dashboard = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Chicken Meat', category: 'Meat', stock: 200, price: '$5/kg' },
    { id: 2, name: 'Eggs', category: 'Poultry', stock: 300, price: '$2/dozen' },
    { id: 3, name: 'Organic Sawdust', category: 'Byproduct', stock: 100, price: '$1/bag' },
  ]);

  const handleEdit = (id: number) => {
    alert(`Edit product with ID: ${id}`);
  };

  const handleDelete = (id: number) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const handleAddProduct = () => {
    const newProduct = { id: Date.now(), name: 'New Product', category: 'Category', stock: 50, price: '$10' };
    setProducts([...products, newProduct]);
  };

  return (
    <AppShell
      padding="md"
    //   navbar={
    //     <Navbar width={{ base: 300 }} p="xs">
    //       <Title order={3} style={{ color: '#9E6D29' }}>
    //         Admin Panel
    //       </Title>
    //       <Text>Manage products and view insights.</Text>
    //     </Navbar>
    //   }
    //   header={
    //     <Header height={60} p="xs">
    //       <Title order={2} style={{ color: '#FFE000' }}>
    //         Poultry Dashboard
    //       </Title>
    //     </Header>
    //   }
    >
      <Container size="lg">
        {/* Revenue and Sales */}
        <Grid>
          <Grid.Col span={6}>
            <Card shadow="sm" p="lg" style={{ backgroundColor: 'darkgreen', color: '#fff' }}>
              <Title order={3}>Revenue</Title>
              <Text size="xl">$12,340</Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={6}>
            <Card shadow="sm" p="lg" style={{ backgroundColor: '#9E6D29', color: '#fff' }}>
              <Title order={3}>Sales</Title>
              <Text size="xl">450 Units</Text>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Charts */}
        <Grid mt="xl">
          <Grid.Col span={12}>
            <Title order={4} mb="sm">Sales Trends</Title>
            <AreaChart
              h={300}
              data={areaData}
              dataKey="date"
              series={[{ name: 'Apples', color: 'indigo.6' }]}
              curveType="linear"
              connectNulls
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
                { name: 'Tomatoes', color: 'rgba(18, 120, 255, 0.2)', type: 'bar' },
                { name: 'Apples', color: 'red.8', type: 'line' },
                { name: 'Oranges', color: 'yellow.8', type: 'area' },
              ]}
            />
          </Grid.Col>
          <Grid.Col span={12} mt="xl">
            <Title order={4} mb="sm">Monthly Comparisons</Title>
            <RadarChart
              h={300}
              data={radarData}
              dataKey="product"
              withPolarRadiusAxis
              series={[
                { name: 'Sales January', color: 'lime.4', opacity: 0.1 },
                { name: 'Sales February', color: 'cyan.4', opacity: 0.1 },
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
                <th>Category</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.stock}</td>
                  <td>{product.price}</td>
                  <td>
                    <Group>
                      <Button size="xs" onClick={() => handleEdit(product.id)}>
                        Edit
                      </Button>
                      <Button size="xs" color="red" onClick={() => handleDelete(product.id)}>
                        Delete
                      </Button>
                    </Group>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button mt="md" onClick={handleAddProduct}>
            Add Product
          </Button>
        </Card>
      </Container>
    </AppShell>
  );
};

export default Dashboard;

