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
  Alert,
  Box,      // <-- 1. Import Box for centering
  Paper,    // <-- 2. Import Paper for the card UI
  Text,     // <-- 3. Import Text
  Anchor,   // <-- 4. Import Anchor
} from '@mantine/core';
import { useForm } from '@mantine/form';
// 5. Import Link
import { useNavigate, Link } from 'react-router-dom'; 
import axios, { AxiosError } from 'axios';
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

      // Prefer role from response body, fallback to JWT payload, then default to buyer
      const access: string | undefined = response.data?.access;
      const refresh: string | undefined = response.data?.refresh;
      const roleFromBody: string | undefined = response.data?.user?.user_type || response.data?.user_type;

      let userRole = roleFromBody ?? 'buyer';
      if (!roleFromBody && access) {
        try {
          const payload = JSON.parse(atob(access.split('.')[1]));
          userRole = (payload.user_type || payload.role || 'buyer') as string;
        } catch {
          // ignore parse errors; keep default
        }
      }

      if (access) localStorage.setItem('accessToken', access);
      if (refresh) localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('userRole', userRole);

      setNotification({
        title: 'Login Successful',
        message: 'Welcome back! Redirecting...',
        icon: checkIcon,
        color: 'teal',
      });
      
      // Redirect based on role
      if (userRole === 'farmer') {
        navigate('/dashboard');
      } else {
        navigate('/digital-market');
      }

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
    // 6. This Box centers everything vertically and horizontally
    <Box
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--mantine-color-gray-0)', // A light background
      }}
    >
      <Container size="sm" style={{ width: '100%', maxWidth: 500 }}>
        {/* 7. The Paper component creates the form card */}
        <Paper withBorder shadow="md" p="xl" radius="md">
          <Title ta="center" mt="md" mb="lg">Login to KukuConnect</Title>
          
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

          {/* 8. This is the new "Sign up" link */}
          <Text ta="center" mt="lg">
            Don't have an account?{' '}
            <Anchor component={Link} to="/signup">
              Sign up
            </Anchor>
          </Text>

        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;

