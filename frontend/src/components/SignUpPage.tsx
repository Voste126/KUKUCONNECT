import React, { useState } from 'react';
import {
  Stepper,
  Button,
  Group,
  TextInput,
  PasswordInput,
  Select,
  Container,
  Title,
  Notification,
  rem,
  Alert, 
  List,
  Box,      // <-- 1. Import Box
  Paper,    // <-- 2. Import Paper
  Text,     // <-- 3. Import Text
  Anchor,   // <-- 4. Import Anchor
} from '@mantine/core';
import { useForm } from '@mantine/form';
// 5. Import Link
import { useNavigate, Link } from 'react-router-dom'; 
import { IconCheck, IconAlertCircle } from '@tabler/icons-react';
import axios, { AxiosError } from 'axios'; 
import BASE_URL from '../config';

// Signup Page
export const SignupPage: React.FC = () => {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  
  const [error, setError] = useState<string[] | string | null>(null);
  const [loading, setLoading] = useState(false); 

  const [notification, setNotification] = useState<{ title: string; message: string; color: string; icon: React.ReactNode } | null>(null);
  const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
      email: '',
      userType: '',
      farmName: '',
      location: '',
      phoneNumber: '',
      farmSize: '',
      businessName: '',
      preferredProducts: '',
    },
    validate: (values) => {
      if (active === 0) {
        return {
          username: values.username.trim().length < 1 ? 'Username is required' : null,
          password: values.password.length < 12 ? 'Password must be at least 12 characters' : null,
        };
      }
      if (active === 1) {
        return {
          email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) ? 'Invalid email' : null,
          userType: values.userType ? null : 'Please select user type',
        };
      }
      if (active === 2 && values.userType === 'farmer') {
        return {
          farmName: values.farmName.trim().length < 1 ? 'Farm name is required' : null,
          location: values.location.trim().length < 1 ? 'Location is required' : null,
          phoneNumber: /^\+?\d{10,15}$/.test(values.phoneNumber) ? null : 'A valid phone number is required',
        };
      }
      if (active === 2 && values.userType === 'buyer') {
        return {
          phoneNumber: /^\+?\d{10,15}$/.test(values.phoneNumber) ? null : 'A valid phone number is required',
        };
      }
      return {};
    },
  });

  const nextStep = () => {
    if (!form.validate().hasErrors) {
      setActive((current) => (current < 3 ? current + 1 : current));
    }
  };

  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const handleSignup = async () => {
  const { username, password, email, userType, farmName, location, phoneNumber, farmSize, businessName } = form.values;

    setError(null); 
    setNotification(null);
    setLoading(true); 

    try {
      // Register the user with the expected backend field names.
      // The backend serializer expects `user_type` and, depending on the type,
      // the related profile fields. We send them in a single request so the
      // backend can create the profile during registration.
      await axios.post(`${BASE_URL}/api/users/register/`, {
        username,
        password,
        email,
        user_type: userType,
        // Farmer fields
        farm_name: userType === 'farmer' ? farmName : undefined,
        location: userType === 'farmer' ? location : undefined,
        phone_number: phoneNumber || undefined,
        farm_size: userType === 'farmer' ? (farmSize || undefined) : undefined,
        // Buyer fields
        business_name: userType === 'buyer' ? (businessName || undefined) : undefined,
      });

      // Optional auto-login skipped to avoid CORS credentialed preflight during signup.
      // Users will be redirected to the login page.

      setNotification({
        title: 'Signup Successful',
        message: 'Your account has been created successfully. Redirecting to login...',
        icon: checkIcon,
        color: 'teal',
      });
      navigate('/login');

    } catch (err) {
      const error = err as AxiosError;
      const errorMessages: string[] = [];
      
      if (error.response && error.response.status === 400) {
        const backendErrors = error.response.data as Record<string, string[]>;
        for (const key in backendErrors) {
          errorMessages.push(`${key}: ${backendErrors[key][0]}`);
        }
      } else {
        errorMessages.push('An unexpected error occurred. Please try again.');
      }
      
      setError(errorMessages);
      setActive(0);
    } finally {
      setLoading(false); 
    }
  };

  return (
    // 6. This Box centers everything
    <Box
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--mantine-color-gray-0)', // Light background
      }}
    >
      <Container size="sm" style={{ width: '100%', maxWidth: 500 }}>
        {/* 7. The Paper component creates the card */}
        <Paper withBorder shadow="md" p="xl" radius="md">
          <Title ta="center" mt="md" mb="lg">Create Your Account</Title>

          {error && (
            <Alert icon={<IconAlertCircle size="1rem" />} title="Registration Failed" color="red" withCloseButton onClose={() => setError(null)} mb="md">
              {Array.isArray(error) ? (
                <List>
                  {error.map((msg, index) => <List.Item key={index}>{msg}</List.Item>)}
                </List>
              ) : (
                error
              )}
            </Alert>
          )}

          <Stepper active={active} onStepClick={setActive}>
            <Stepper.Step label="Account Details" description="Set your account credentials">
              <TextInput
                label="Username"
                description="This will be your unique login name." 
                placeholder="Enter username"
                {...form.getInputProps('username')}
              />
              <PasswordInput
                mt="md"
                label="Password"
                description="Must be at least 12 characters long. Make it strong!" 
                placeholder="Enter password"
                {...form.getInputProps('password')}
              />
            </Stepper.Step>

            <Stepper.Step label="Personal Information" description="Enter your details">
              <TextInput
                mt="md"
                label="Email"
                description="We will use this to verify your account." 
                placeholder="Enter your email"
                {...form.getInputProps('email')}
              />
              <Select
                mt="md"
                label="User Type"
                placeholder="Select your user type"
                data={[
                  { value: 'farmer', label: 'Farmer' },
                  { value: 'buyer', label: 'Buyer' },
                ]}
                {...form.getInputProps('userType')}
              />
            </Stepper.Step>

            <Stepper.Step label="Profile Information" description="Enter your profile details">
              {form.values.userType === 'farmer' && (
                <>
                  <TextInput mt="md" label="Farm Name" placeholder="Enter your farm name" {...form.getInputProps('farmName')} />
                  <TextInput mt="md" label="Location" placeholder="Enter your location" {...form.getInputProps('location')} />
                  <TextInput mt="md" label="Phone Number" placeholder="e.g. 0712345678" {...form.getInputProps('phoneNumber')} />
                  <TextInput mt="md" label="Farm Size (Optional)" placeholder="e.g. 5 acres" {...form.getInputProps('farmSize')} />
                </>
              )}
              {form.values.userType === 'buyer' && (
                <>
                  <TextInput mt="md" label="Business Name (Optional)" placeholder="Enter your business name" {...form.getInputProps('businessName')} />
                  <TextInput mt="md" label="Phone Number" placeholder="e.g. 0712345678" {...form.getInputProps('phoneNumber')} />
                  <TextInput mt="md" label="Preferred Products (Optional)" placeholder="e.g. Eggs, Broilers" {...form.getInputProps('preferredProducts')} />
                </>
              )}
            </Stepper.Step>

            <Stepper.Completed>
              {notification && (
                <Notification icon={notification.icon} color={notification.color} title={notification.title} mt="md">
                  {notification.message}
                </Notification>
              )}
            </Stepper.Completed>
          </Stepper>

          <Group mt="xl">
            {active !== 0 && (
              <Button variant="default" onClick={prevStep}>Back</Button>
            )}
            {active === 3 ? (
              <Button onClick={handleSignup} loading={loading}>
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
            ) : (
              <Button onClick={nextStep}>Next</Button>
            )}
          </Group>

          {/* 8. This is the new "Log in" link */}
          <Text ta="center" mt="lg">
            Already have an account?{' '}
            <Anchor component={Link} to="/login">
              Log in
            </Anchor>
          </Text>
          
        </Paper>
      </Container>
    </Box>
  );
};

export default SignupPage;