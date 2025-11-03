import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear ALL authentication tokens from storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole'); // <-- ADDED: Clear the role

    // Redirect to login page
    navigate('/login');
  }, [navigate]);

  return null; // This component doesn't render anything
};

export default Logout;

