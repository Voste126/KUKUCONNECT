import React, { useState } from 'react';
import {
  Stepper,
  Button,
  Group,
  TextInput,
  PasswordInput,
  Container,
  Title,
  Notification,
  rem,
  Alert, // <-- Import Alert
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios'; // <-- Import AxiosError
import { IconCheck, IconAlertCircle } from '@tabler/icons-react';
import BASE_URL from '../config';

// Login Page
export const LoginPage: React.FC = () => {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); 

  const [notification, setNotification] = useState<{ title: string; message: string; color: string; icon: React.ReactNode } | null>(null);
  const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;
  // const xicon = <IconX style={{ width: rem(20), height: rem(20) }} />; // <-- This was unused

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
    validate: (values) => {
      if (active === 0) {
        return {
          username: values.username.trim().length < 1 ? 'Username is required' : null,
          password: values.password.length < 1 ? 'Password is required' : null,
        };
      }
      return {};
    },
  });

  const nextStep = () => {
    if (!form.validate().hasErrors) {
      setActive((current) => (current < 1 ? current + 1 : current));
    }
  };

  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const handleLogin = async () => {
    setError(null); 
    setNotification(null);
    setLoading(true); 

    try {
      const response = await axios.post(
        `${BASE_URL}/api/users/login/`,
        {
          username: form.values.username,
          password: form.values.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const { access, refresh } = response.data;
      
      // ---
      // ADDED: Parse token and save role to localStorage
      // ---
      let userRole = 'buyer'; // Default to buyer
      try {
        // Decode the payload (the middle part of the JWT)
        const payload = JSON.parse(atob(access.split('.')[1]));
        if (payload.role) {
          userRole = payload.role; // Get the role from the token
        }
      } catch (e) {
        console.error("Failed to parse access token:", e);
        // Will proceed with default 'buyer' role
      }

      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('userRole', userRole); // <-- STORE THE ROLE

      setNotification({
        title: 'Login Successful',
        message: 'Welcome back! Redirecting to the digital market...',
        icon: checkIcon,
        color: 'teal',
      });
      navigate('/digital-market');

    } catch (err) {
      const error = err as AxiosError;
      if (error.response && error.response.status === 401) {
        setError('Invalid username or password. Please check your credentials and try again.');
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setLoading(false); 
    }
  };

  return (
    <Container size="sm">
      <Title mt="md" mb="lg">Login to KukuConnect</Title>
      <Stepper active={active} onStepClick={setActive}>
        <Stepper.Step label="Account Details" description="Enter your login credentials">
          
          {error && (
            <Alert icon={<IconAlertCircle size="1rem" />} title="Login Failed" color="red" withCloseButton onClose={() => setError(null)} mb="md">
              {error}
            </Alert>
          )}

          <TextInput
            label="Username"
            description="Enter the username you registered with." 
            placeholder="Enter your username"
            {...form.getInputProps('username')}
          />
          <PasswordInput
            mt="md"
            label="Password"
            description="Passwords are case-sensitive." 
            placeholder="Enter your password"
            {...form.getInputProps('password')}
          />
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
        {active === 1 ? (
          <Button onClick={handleLogin} loading={loading}>
            {loading ? 'Logging in...' : 'Submit'}
          </Button>
        ) : (
          <Button onClick={nextStep}>Next</Button>
        )}
      </Group>
    </Container>
  );
};

export default LoginPage;

