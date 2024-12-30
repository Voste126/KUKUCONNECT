import React, { useState } from 'react';
import { Container, Grid, Card, TextInput, Button, Table, RadioGroup, Radio } from '@mantine/core';
import { useLocation } from 'react-router-dom';
import {  IconCheck } from '@tabler/icons-react';
import { Notification, rem } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  title: string;
  price: number;
  quantity: number;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [notification, setNotification] = useState<{ title: string; message: string; color: string; icon: React.ReactNode } | null>(null);
  const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;
  const location = useLocation();
  const { cart, totalPrice } = location.state || { cart: [], totalPrice: 0 };

  const handlePayment = () => {
    // Placeholder for payment integration logic
    setNotification({
      title: 'Payment Success',
      message: 'Payment processed successfully!',
      color: 'green',
      icon: checkIcon,
    });
    navigate('/digital-market');
  };

  return (
    <Container>
      <h2>Checkout</h2>
      <Grid>
        {/* Order Summary */}
        <Grid.Col span={6}>
          <h3>Order Summary</h3>
          <Table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item: Product) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.quantity}</td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <h4>Total: ${totalPrice}</h4>
        </Grid.Col>

        {/* Shipping Information */}
        <Grid.Col span={6}>
          <h3>Shipping Information</h3>
          <Card withBorder shadow="sm" padding="lg">
            <TextInput placeholder="Full Name" label="Full Name" required mb="md" />
            <TextInput placeholder="Email" label="Email" required mb="md" />
            <TextInput placeholder="Address" label="Address" required mb="md" />
          </Card>
        </Grid.Col>
      </Grid>

      {/* Payment Section */}
      <h3>Payment Information</h3>
      <Card withBorder shadow="sm" padding="lg">
        <RadioGroup label="Select Payment Method" required>
          <Radio value="credit" label="Credit Card" />
          <Radio value="paypal" label="PayPal" />
          <Radio value="mpesa" label="MPESA" />
        </RadioGroup>
        <Button mt="lg" fullWidth onClick={handlePayment}>
          Confirm and Pay
        </Button>
      </Card>

      {notification && (
        <Notification icon={notification.icon} color={notification.color} title={notification.title} mt="md">
          {notification.message}
        </Notification>
      )}
    </Container>
  );
};

export default Checkout;
