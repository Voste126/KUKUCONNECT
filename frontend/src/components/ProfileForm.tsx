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
} from '@mantine/core';
import { useForm } from '@mantine/form';
// import { showNotification} from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../config';
import { IconCheck, IconX } from '@tabler/icons-react';
interface ProfileProps {
  userType: 'farmer' | 'buyer';
}

interface FarmerProfile {
  farmName: string;
  location: string;
  phoneNumber: string;
  farmSize?: number;
}

interface BuyerProfile {
  businessName?: string;
  phoneNumber: string;
  preferredProducts?: string;
}

type ProfileData = FarmerProfile | BuyerProfile;

const ProfileForm: React.FC<ProfileProps> = ({ userType }) => {
  const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;
  const xicon = useMemo(() => <IconX style={{ width: rem(20), height: rem(20) }} />, []);

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [notification, setNotification] = useState<{
    title: string;
    message: string;
    color: string;
    icon: React.ReactNode;
  } | null>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');
  let id = null;
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    id = payload.user_id; // Assuming the token payload contains the user ID
  }
  const apiUrl = `${BASE_URL}/api/profiles/${userType === 'farmer' ? 'farmers' : 'buyers'}/${id}/`;

  const form = useForm({
    initialValues: {
      phoneNumber: '',
      ...(userType === 'farmer' && { farmName: '', location: '', farmSize: '' }),
      ...(userType === 'buyer' && { businessName: '', preferredProducts: '' }),
    },
    validate: {
      phoneNumber: (val: string) => (/^\+?\d{10,15}$/.test(val) ? null : 'Invalid phone number'),
      ...(userType === 'farmer' && {
        farmName: (val?: string) => (val && val.length > 0 ? null : 'Farm Name is required'),
        location: (val?: string) => (val && val.length > 0 ? null : 'Location is required'),
      }),
      ...(userType === 'buyer' && {
        businessName: (val?: string) => (val && val.length > 0 ? null : 'Business Name is required'),
      }),
    },
  });

  useEffect(() => {
    // if (!token) {
    //   showNotification({
    //     title: 'Authentication Required',
    //     message: 'Please log in to view your profile.',
    //     color: 'red',
    //   });
    //   navigate('/login');
    //   return;
    // }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfileData(response.data);
        form.setValues(response.data);
      } catch {
        setNotification({
          title: 'Profile Not Found',
          message: 'Could not find your profile. Please try again later.',
          color: 'red',
          icon: xicon,
        });
      }
    };

    fetchProfile();
  }, [apiUrl, token, navigate, form, xicon]);

  const handleUpdate = async (values: typeof form.values) => {
    console.log('Updating profile with values:', values); // Add logging
    try {
      await axios.put(apiUrl, values, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Profile updated successfully'); // Add logging
      setNotification({
        title: 'Profile Updated',
        message: 'Your profile has been updated successfully.',
        color: 'teal',
        icon: checkIcon,
      });
      navigate('/digital-market');
    } catch (error) {
      console.error('Error updating profile:', error); // Add logging
      setNotification({
        title: 'Profile Update Failed',
        message: 'Could not update your profile. Please try again later.',
        color: 'red',
        icon: xicon,
      });
    }
  };

  return (
    <Paper radius="md" p="xl" withBorder>
      <Text size="lg" mb="lg">
        {userType === 'farmer' ? 'Farmer Profile' : 'Buyer Profile'}
      </Text>

      {profileData ? (
        <form onSubmit={form.onSubmit(handleUpdate)}>
          <Stack>
            {userType === 'farmer' && (
              <>
                <TextInput
                  label="Farm Name"
                  placeholder="Farm Name"
                  {...form.getInputProps('farmName')}
                />
                <TextInput
                  label="Location"
                  placeholder="Location"
                  {...form.getInputProps('location')}
                />
                <TextInput
                  label="Farm Size (in acres/hectares)"
                  placeholder="Farm Size"
                  {...form.getInputProps('farmSize')}
                />
              </>
            )}

            {userType === 'buyer' && (
              <>
                <TextInput
                  label="Business Name"
                  placeholder="Business Name"
                  {...form.getInputProps('businessName')}
                />
                <TextInput
                  label="Preferred Products"
                  placeholder="Preferred Products"
                  {...form.getInputProps('preferredProducts')}
                />
              </>
            )}

            <TextInput
              label="Phone Number"
              placeholder="Phone Number"
              {...form.getInputProps('phoneNumber')}
            />
          </Stack>

          <Group mt="lg">
            <Button type="submit">Update Profile</Button>
            <Button style={{ color: 'black', backgroundColor: 'red' }}>DELETE ACCOUNT</Button>
          </Group>
        </form>
      ) : (
        <Text>Loading profile...</Text>
      )}

      {notification && (
        <Notification icon={notification.icon} color={notification.color} title={notification.title} mt="md">
          {notification.message}
        </Notification>
      )}
    </Paper>
  );
};

export default ProfileForm;


