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
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { IconCheck, IconX } from '@tabler/icons-react';
import axios from 'axios';

// Signup Page
export const SignupPage: React.FC = () => {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
      email: '',
      userType: '',
    },

    validate: (values) => {
      if (active === 0) {
        return {
          username: values.username.trim().length < 1 ? 'Username is required and must include valid characters' : null,
          password: values.password.length < 6 ? 'Password must include at least 6 characters' : null,
        };
      }

      if (active === 1) {
        return {
          email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) ? 'Invalid email' : null,
          userType: values.userType ? null : 'Please select user type',
        };
      }

      return {};
    },
  });

  const nextStep = () => {
    if (!form.validate().hasErrors) {
      setActive((current) => (current < 2 ? current + 1 : current));
    }
  };

  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const handleSignup = async () => {
    const { username, password, email, userType } = form.values;

    try {
      await axios.post('http://localhost:8000/api/users/register/', {
        username,
        password,
        email,
        user_type: userType,
      });

      showNotification({
        title: 'Signup Successful',
        message: 'Redirecting to login page...',
        icon: <IconCheck size={16} />,
        color: 'teal',
      });

      navigate('/login');
    } catch (error) {
      showNotification({
        title: 'Signup Failed',
        message: axios.isAxiosError(error) && error.response?.data?.detail ? error.response.data.detail : 'An error occurred during signup.',
        icon: <IconX size={16} />,
        color: 'red',
      });
    }
  };

  return (
    <Container size="sm">
      <Title mt="md" mb="lg">Sign Up</Title>
      <Stepper active={active} onStepClick={setActive} >
        <Stepper.Step label="Account Details" description="Set your account credentials">
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
        </Stepper.Step>

        <Stepper.Step label="Personal Information" description="Enter your details">
          <TextInput
            mt="md"
            label="Email"
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

        <Stepper.Completed>
          <Notification title="All steps completed!" color="teal" mt="md">
            Review your information and submit to complete signup.
          </Notification>
        </Stepper.Completed>
      </Stepper>

      <Group mt="xl">
        {active !== 0 && (
          <Button variant="default" onClick={prevStep}>Back</Button>
        )}
        {active === 2 ? (
          <Button onClick={handleSignup}>Submit</Button>
        ) : (
          <Button onClick={nextStep}>Next</Button>
        )}
      </Group>
    </Container>
  );
};

export default SignupPage;
