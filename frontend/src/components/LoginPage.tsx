import React from 'react';
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
import styles from './LoginPage.module.css';

export const LoginPage: React.FC = () => {
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: (value) =>
        !/^\S+@\S+\.\S+$/.test(value) ? 'Please enter a valid email address' : null,
      password: (value) =>
        value.length < 6 ? 'Password must include at least 6 characters' : null,
    },
  });

  const handleLogin = () => {
    if (!form.validate().hasErrors) {
      showNotification({
        title: 'Login Successful',
        message: `Welcome back to KukuConnect, ${form.values.email}!`,
        icon: <IconCheck size={16} />,
        color: 'teal',
      });
    }
  };

  return (
    <Container className={styles.container}>
        <Title className={styles.title} mt="md" mb="lg">
            Welcome Back to KukuConnect!
        </Title>
        <TextInput
            className={styles.textInput}
            label="Email Address"
            placeholder="yourname@example.com"
            {...form.getInputProps('email')}
        />
        <PasswordInput
            className={styles.textInput}
            mt="md"
            label="Password"
            placeholder="Enter your password"
            {...form.getInputProps('password')}
        />
        <Group className={styles.buttonGroup} mt="xl">
            <Button className={styles.button} onClick={handleLogin}>
            Log In
            </Button>
        </Group>
    </Container>
  );
};

export default LoginPage;