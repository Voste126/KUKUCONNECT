// import React, { useState } from 'react';
import {
  Button,
  Group,
  TextInput,
  PasswordInput,
  
  Container,
  Title,
  
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';

export const LoginPage: React.FC = () => {
  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },

    validate: {
      username: (value) => (value.trim().length < 6 ? 'Username must include at least 6 characters' : null),
      password: (value) => (value.length < 6 ? 'Password must include at least 6 characters' : null),
    },
  });

  const handleLogin = () => {
    // Simulate API login call
    showNotification({
      title: 'Login Successful',
      message: 'Welcome back to KukuConnect!',
      icon: <IconCheck size={16} />,
      color: 'teal',
    });
  };

  return (
    <Container size="sm">
      <Title mt="md" mb="lg">Login to KukuConnect</Title>
      <TextInput
        label="Username"
        placeholder="Enter username"
        {...form.getInputProps('username')}
      />
      <PasswordInput
        mt="md"
        label="Password"
        placeholder="Enter password"
        {...form.getInputProps('password')}
      />
      <Group  mt="xl">
        <Button onClick={handleLogin}>Login</Button>
      </Group>
    </Container>
  );
};
