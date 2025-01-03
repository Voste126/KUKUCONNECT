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
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import { IconCheck, IconX } from '@tabler/icons-react';
import axios from 'axios';
import BASE_URL from '../config';

// Signup Page
export const SignupPage: React.FC = () => {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const [notification, setNotification] = useState<{ title: string; message: string; color: string; icon: React.ReactNode } | null>(null);
  const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;
  const xicon = <IconX style={{ width: rem(20), height: rem(20) }} />;

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

      if (active === 2 && values.userType === 'farmer') {
        return {
          farmName: values.farmName.trim().length < 1 ? 'Farm name is required' : null,
          location: values.location.trim().length < 1 ? 'Location is required' : null,
          phoneNumber: values.phoneNumber.trim().length < 1 ? 'Phone number is required' : null,
        };
      }

      if (active === 2 && values.userType === 'buyer') {
        return {
          phoneNumber: values.phoneNumber.trim().length < 1 ? 'Phone number is required' : null,
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
    const { username, password, email, userType, farmName, location, phoneNumber, farmSize, businessName, preferredProducts } = form.values;

    try {
      // Register the user
      const userResponse = await axios.post(`${BASE_URL}/api/users/register/`, {
        username,
        password,
        email,
        user_type: userType,
      });

      const userId = userResponse.data.id;

      // Log in the user to get the authentication token
      const loginResponse = await axios.post(`${BASE_URL}/api/users/login/`, {
        username,
        password,
      });

      const token = loginResponse.data.access;

      // Create the profile using the authentication token
      if (userType === 'farmer') {
        await axios.post(`${BASE_URL}/api/profiles/farmers/`, {
          user_id: userId,
          farm_name: farmName,
          location,
          phone_number: phoneNumber,
          farm_size: farmSize,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else if (userType === 'buyer') {
        await axios.post(`${BASE_URL}/api/profiles/buyers/`, {
          user_id: userId,
          business_name: businessName,
          phone_number: phoneNumber,
          preferred_products: preferredProducts,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      setNotification({
        title: 'Signup Successful',
        message: 'Your account has been created successfully. Redirecting to login...',
        icon: checkIcon,
        color: 'teal',
      });

      navigate('/login');
    } catch (error) {
      setNotification({
        title: 'Signup Failed',
        message: 'An error occurred while creating your account. Please try again. If the problem persists, contact supportwith the following complaint:'+ error,
        icon: xicon,
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

        <Stepper.Step label="Profile Information" description="Enter your profile details">
          {form.values.userType === 'farmer' && (
            <>
              <TextInput
                mt="md"
                label="Farm Name"
                placeholder="Enter your farm name"
                {...form.getInputProps('farmName')}
              />
              <TextInput
                mt="md"
                label="Location"
                placeholder="Enter your location"
                {...form.getInputProps('location')}
              />
              <TextInput
                mt="md"
                label="Phone Number"
                placeholder="Enter your phone number"
                {...form.getInputProps('phoneNumber')}
              />
              <TextInput
                mt="md"
                label="Farm Size"
                placeholder="Enter your farm size"
                {...form.getInputProps('farmSize')}
              />
            </>
          )}
          {form.values.userType === 'buyer' && (
            <>
              <TextInput
                mt="md"
                label="Business Name"
                placeholder="Enter your business name"
                {...form.getInputProps('businessName')}
              />
              <TextInput
                mt="md"
                label="Phone Number"
                placeholder="Enter your phone number"
                {...form.getInputProps('phoneNumber')}
              />
              <TextInput
                mt="md"
                label="Preferred Products"
                placeholder="Enter your preferred products"
                {...form.getInputProps('preferredProducts')}
              />
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
          <Button onClick={handleSignup}>Submit</Button>
        ) : (
          <Button onClick={nextStep}>Next</Button>
        )}
      </Group>
    </Container>
  );
};

export default SignupPage;