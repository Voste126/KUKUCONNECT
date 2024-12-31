import React, { useState } from 'react';
import { Container, Grid, Card, TextInput, Button, Table, RadioGroup, Radio } from '@mantine/core';
import { useLocation } from 'react-router-dom';
import { IconCheck } from '@tabler/icons-react';
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
  const [notification, setNotification] = useState<{
    title: string;
    message: string;
    color: string;
    icon: React.ReactNode;
  } | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [paymentDetails, setPaymentDetails] = useState({ cardNumber: '', expiryDate: '', cvv: '', phoneNumber: '', email: '' });

  const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;
  const location = useLocation();
  const { cart, totalPrice } = location.state || { cart: [], totalPrice: 0 };

  const handlePaymentSubmit = () => {
    // Placeholder for payment integration logic
    setNotification({
      title: 'Payment Success',
      message: 'Payment processed successfully!',
      color: 'green',
      icon: checkIcon,
    });
    setTimeout(() => {
      navigate('/digital-market');
    }, 5000);
  };

  const renderPaymentForm = () => {
    switch (selectedPayment) {
      case 'credit':
        return (
          <>
            <TextInput
              label="Card Number"
              placeholder="1234 5678 9012 3456"
              required
              mb="md"
              value={paymentDetails.cardNumber}
              onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
            />
            <TextInput
              label="Expiry Date"
              placeholder="MM/YY"
              required
              mb="md"
              value={paymentDetails.expiryDate}
              onChange={(e) => setPaymentDetails({ ...paymentDetails, expiryDate: e.target.value })}
            />
            <TextInput
              label="CVV"
              placeholder="123"
              required
              mb="md"
              value={paymentDetails.cvv}
              onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
            />
          </>
        );
      case 'mpesa':
        return (
          <TextInput
            label="Phone Number"
            placeholder="e.g., 254700123456"
            required
            mb="md"
            value={paymentDetails.phoneNumber}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, phoneNumber: e.target.value })}
          />
        );
      case 'paypal':
        return (
          <TextInput
            label="PayPal Email"
            placeholder="example@email.com"
            required
            mb="md"
            value={paymentDetails.email}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, email: e.target.value })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container style={{marginBottom: '15rem'}}>
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
        <RadioGroup
          label="Select Payment Method"
          required
          value={selectedPayment}
          onChange={setSelectedPayment}
        >
          <Radio value="credit" label="Credit Card" />
          <Radio value="paypal" label="PayPal" />
          <Radio value="mpesa" label="MPESA" />
        </RadioGroup>

        {/* Render Dynamic Payment Form */}
        {renderPaymentForm()}

        <Button mt="lg" fullWidth onClick={handlePaymentSubmit} disabled={!selectedPayment}>
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

