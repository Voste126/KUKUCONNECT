import React from 'react';
import { Button, Center, Paper, Text, Stack, Image } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import image from '../assets/logout.png';

const LogoutPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Logic to clear user session, e.g., localStorage or cookies
    localStorage.removeItem('authToken');
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <Center style={{ height: '100vh' }}>
      <Paper radius="md" p="xl" withBorder style={{ width: '400px' }}>
        <Stack align="center" >
          <Image
            src={image} // Replace with a suitable image URL
            alt="Logout illustration"
            width={100}
            height={100}
          />
          <Text size="lg">
            Are you sure you want to log out?
          </Text>
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

