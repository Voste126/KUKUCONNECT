import React, { useEffect, useState, useMemo } from 'react';
import {
  Button,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  rem,
  Notification,
  Loader, 
  List,   
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios'; 
import BASE_URL from '../config';
import { IconCheck, IconX } from '@tabler/icons-react'; 

interface ProfileProps {
  userType: 'farmer' | 'buyer';
}

// Interface for the form's state (camelCase)
interface ProfileFormValues {
  phoneNumber: string;
  farmName?: string;
  location?: string;
  farmSize?: string;
  businessName?: string;
  preferredProducts?: string;
}

// ---
// NEW: Interface for the API payload (snake_case)
// ---
interface ProfilePayload {
  phone_number: string;
  farm_name?: string | null;
  location?: string | null;
  farm_size?: string | null;
  business_name?: string | null;
  preferred_products?: string | null;
}

const ProfileForm: React.FC<ProfileProps> = ({ userType }) => {
  const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;
  const xicon = useMemo(() => <IconX style={{ width: rem(20), height: rem(20) }} />, []);
  
  const [loading, setLoading] = useState(true); 
  const [updating, setUpdating] = useState(false); 
  
  const [notification, setNotification] = useState<{ title: string; message: React.ReactNode; color: string; icon: React.ReactNode } | null>(null);
  
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  const apiUrl = `${BASE_URL}/api/profiles/${userType === 'farmer' ? 'farmers' : 'buyers'}/`;

  const form = useForm<ProfileFormValues>({
    initialValues: {
      phoneNumber: '',
      farmName: '',
      location: '',
      farmSize: '',
      businessName: '',
      preferredProducts: '',
    },
    validate: {
      phoneNumber: (val: string) => (/^\+?\d{10,15}$/.test(val) ? null : 'A valid 10-digit phone number is required'),
      ...(userType === 'farmer' && {
        farmName: (val?: string) => (val && val.length > 0 ? null : 'Farm Name is required'),
        location: (val?: string) => (val && val.length > 0 ? null : 'Location is required'),
      }),
    },
  });

  useEffect(() => {
    if (!token) {
      console.warn('No token found, redirecting to login');
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      setNotification(null);
      try {
        const response = await axios.get(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Use setValues to populate the form with fetched data
        form.setValues({
            phoneNumber: response.data.phone_number || '',
            farmName: response.data.farm_name || '',
            location: response.data.location || '',
            farmSize: response.data.farm_size || '',
            businessName: response.data.business_name || '',
            preferredProducts: response.data.preferred_products || '',
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        setNotification({
          title: 'Profile Not Found',
          message: 'Could not find your profile. Please complete the form to create one.',
          color: 'blue', 
          icon: xicon, 
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiUrl, token, navigate, xicon]); 

  const handleUpdate = async (values: ProfileFormValues) => {
    setUpdating(true);
    setNotification(null);
    
    // ---
    // FIXED: Replaced 'any' with our new 'ProfilePayload' interface
    // ---
    const dataToSend: ProfilePayload = { 
      phone_number: values.phoneNumber 
    };

    if (userType === 'farmer') {
      dataToSend.farm_name = values.farmName || null;
      dataToSend.location = values.location || null;
      dataToSend.farm_size = values.farmSize || null; 
    } else {
      dataToSend.business_name = values.businessName || null;
      dataToSend.preferred_products = values.preferredProducts || null;
    }

    try {
      await axios.put(apiUrl, dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      setNotification({
        title: 'Profile Updated',
        message: 'Your profile has been updated successfully.',
        color: 'teal',
        icon: checkIcon,
      });
      
      setTimeout(() => setNotification(null), 3000);

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
      
      setNotification({
        title: 'Profile Update Failed',
        message: (
          <List>
            {errorMessages.map((msg, index) => <List.Item key={index}>{msg}</List.Item>)}
          </List>
        ),
        color: 'red',
        icon: xicon, 
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Paper radius="md" p="xl" withBorder>
      <Text size="lg" mb="lg">
        {userType === 'farmer' ? 'Farmer Profile' : 'Buyer Profile'}
      </Text>

      {notification && (
        <Notification 
          icon={notification.icon} 
          color={notification.color} 
          title={notification.title} 
          mt="md" 
          onClose={() => setNotification(null)}
          withCloseButton
        >
          {notification.message}
        </Notification>
      )}

      {loading ? (
        <Group justify="center" mt="xl">
          <Loader />
          <Text>Loading profile...</Text>
        </Group>
      ) : (
        <form onSubmit={form.onSubmit(handleUpdate)}>
          <Stack>
            {userType === 'farmer' && (
              <>
                <TextInput
                  label="Farm Name"
                  description="Your official farm or business name." 
                  placeholder="Farm Name"
                  {...form.getInputProps('farmName')}
                  required
                />
                <TextInput
                  label="Location"
                  description="The county or town where your farm is located." 
                  placeholder="Location"
                  {...form.getInputProps('location')}
                  required
                />
                <TextInput
                  label="Farm Size (Optional)"
                  description="e.g., 5 acres, 2000 birds" 
                  placeholder="Farm Size"
                  {...form.getInputProps('farmSize')}
                />
              </>
            )}

            {userType === 'buyer' && (
              <>
                <TextInput
                  label="Business Name (Optional)"
                  description="Your restaurant, hotel, or business name." 
                  placeholder="Business Name"
                  {...form.getInputProps('businessName')}
                />
                <TextInput
                  label="Preferred Products (Optional)"
                  description="e.g., Eggs, Broilers, Kienyeji" 
                  placeholder="Preferred Products"
                  {...form.getInputProps('preferredProducts')}
                />
              </>
            )}

            <TextInput
              label="Phone Number"
              description="A valid 10-digit phone number (e.g., 0712345678)" 
              placeholder="Phone Number"
              {...form.getInputProps('phoneNumber')}
              required
            />
          </Stack>

          <Group mt="lg">
            <Button type="submit" loading={updating}>
              {updating ? 'Updating...' : 'Update Profile'}
            </Button>
            <Button variant="outline" color="red">
              DELETE ACCOUNT
            </Button>
          </Group>
        </form>
      )}
    </Paper>
  );
};

export default ProfileForm;

