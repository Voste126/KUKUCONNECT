import { useEffect, useState } from 'react';
import { Route, Navigate, Routes } from 'react-router-dom';
import axios from 'axios';
import ProfileForm from './ProfileForm';
import { showNotification } from '@mantine/notifications';
import { Loader } from '@mantine/core';
import BASE_URL from '../config';

const AccountRoute = () => {
  const [userType, setUserType] = useState(null); // Store user type ('farmer' or 'buyer')
  const [loading, setLoading] = useState(true);  // Track loading state

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          showNotification({
            title: 'Unauthorized',
            message: 'Please log in to access your account.',
            color: 'red',
          });
          return;
        }

        const response = await axios.get(`${BASE_URL}/api/users/me/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserType(response.data.userType); // Assuming the API returns userType
        setLoading(false);
      } catch{
        showNotification({
          title: 'Error',
          message: 'Unable to fetch user details. Please log in again.',
          color: 'red',
        });
        setLoading(false);
        window.location.href = '/login'; // Redirect to login
      }
    };

    fetchUserType();
  }, []);

  if (loading) {
    return <Loader size="xl" />;
  }

  if (!userType) {
    return <Navigate to="/login" />;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProfileForm
            userType={userType} // Dynamically pass the userType
          />
        }
      />
    </Routes>
  );
};

export default AccountRoute;
