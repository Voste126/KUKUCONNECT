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
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IconCheck, IconX } from '@tabler/icons-react';

// Login Page
export const LoginPage: React.FC = () => {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

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
    try {
      const response = await axios.post(
        'http://localhost:8000/api/users/login/',
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

      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);

      showNotification({
        title: 'Login Successful',
        message: 'Redirecting to the digital market...',
        icon: <IconCheck size={16} />,
        color: 'teal',
      });

      navigate('/digital-market');
    } catch {
      showNotification({
        title: 'Login Failed',
        message: 'Invalid credentials, please try again.',
        icon: <IconX size={16} />,
        color: 'red',
      });
    }
  };

  return (
    <Container size="sm">
      <Title mt="md" mb="lg">Login to KukuConnect</Title>
      <Stepper active={active} onStepClick={setActive}>
        <Stepper.Step label="Account Details" description="Enter your login credentials">
          <TextInput
            label="Username"
            placeholder="Enter your username"
            {...form.getInputProps('username')}
          />
          <PasswordInput
            mt="md"
            label="Password"
            placeholder="Enter your password"
            {...form.getInputProps('password')}
          />
        </Stepper.Step>

        <Stepper.Completed>
          <Notification title="All steps completed!" color="teal" mt="md">
            Review your information and submit to complete login.
          </Notification>
        </Stepper.Completed>
      </Stepper>

      <Group mt="xl">
        {active !== 0 && (
          <Button variant="default" onClick={prevStep}>Back</Button>
        )}
        {active === 1 ? (
          <Button onClick={handleLogin}>Submit</Button>
        ) : (
          <Button onClick={nextStep}>Next</Button>
        )}
      </Group>
    </Container>
  );
};

export default LoginPage;

