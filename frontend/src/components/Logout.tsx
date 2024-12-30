import React from 'react';
import { Button, Center, Paper, Text, Stack, Image } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios for HTTP requests
import image from '../assets/logout.png';

const LogoutPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call the logout API
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        console.error('No refresh token found');
        return;
      }

      await axios.post(
        'http://localhost:8000/api/users/logout/',
        { refresh_token: refreshToken },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Include auth token if required
          },
        }
      );
      
      // Clear the local storage after successful logout
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      // Redirect to the login page
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      // Optionally, show an error message to the user
    }
  };

  return (
    <Center style={{ height: '100vh' }}>
      <Paper radius="md" p="xl" withBorder style={{ width: '400px' }}>
        <Stack align="center">
          <Image
            src={image} // Replace with a suitable image URL
            alt="Logout illustration"
            width={100}
            height={100}
          />
          <Text size="lg">Are you sure you want to log out?</Text>
          <Button fullWidth radius="md" color="red" onClick={handleLogout}>
            Logout
          </Button>
          <Button fullWidth radius="md" variant="light" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </Stack>
      </Paper>
    </Center>
  );
};

export default LogoutPage;

