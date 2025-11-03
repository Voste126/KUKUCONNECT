import { AppShell } from '@mantine/core';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Navbar } from './components/Navbar';
// Your import path for LoginPage is correct based on your previous file
import { LoginPage } from './components/LoginForm'; 
import { SignupPage } from './components/SignUpPage';
import Dashboard from './components/Dashboard';
import Logout from './components/Logout';

/**
 * Helper function to get auth state from localStorage
 */
const getAuth = () => {
  const token = localStorage.getItem('accessToken');
  const role = localStorage.getItem('userRole');
  return { token, role };
};

/**
 * For pages ONLY a guest (logged-out user) can see.
 * e.g., Login, Sign Up
 */
const GuestOnlyLayout = () => {
  const { token } = getAuth();
  // If user has a token, redirect them away from login page
  return !token ? <Outlet /> : <Navigate to="/digital-market" replace />;
};

/**
 * For pages ANY logged-in user can see.
 * e.g., Marketplace, Profile
 */
const UserLayout = () => {
  const { token } = getAuth();
  // If user has no token, redirect them to login
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

/**
 * For pages ONLY a FARMER can see.
 * e.g., Dashboard
 */
const FarmerLayout = () => {
  const { token, role } = getAuth();

  if (!token) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }
  
  // Logged in, but NOT a farmer
  if (role !== 'farmer') {
    return <Navigate to="/digital-market" replace />;
  }

  // Logged in AND is a farmer
  return <Outlet />;
};

// ---
// Placeholder Pages
// You should create these files in your pages/ directory
// ---
const HomePage = () => (
  <div style={{ padding: '20px' }}>
    <h1>Welcome to KukuConnect</h1>
    <p>Please log in or sign up to continue.</p>
  </div>
);

const DigitalMarket = () => (
  <div style={{ padding: '20px' }}>
    <h1>Digital Market</h1>
    <p>All users (farmers and buyers) can see this page.</p>
  </div>
);

// This must match the file from your repo
import ProfileForm from './components/ProfileForm';
const ProfilePage = () => {
   // This logic needs to be better, but for now:
   const role = localStorage.getItem('userRole') as 'farmer' | 'buyer';
   if (!role) return <Navigate to="/login" />;
   return <ProfileForm userType={role} />;
};

const NotFoundPage = () => (
  <div style={{ padding: '20px' }}>
    <h1>404 - Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
  </div>
);


function App() {
  return (
    // ---
    // FIXED: Removed the extra <Router> and <MantineProvider> wrappers.
    // Your main.tsx file is already handling this.
    // ---
    <AppShell
      navbar={{
        width: 300,
        breakpoint: 'sm',
      }}
      padding="md"
    >
      <AppShell.Navbar>
        <Navbar />
      </AppShell.Navbar>
      <AppShell.Main>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<HomePage />} />

          {/* Guest-Only Routes (Login, Sign Up) */}
          <Route element={<GuestOnlyLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>

          {/* Logged-In User Routes (All Roles) */}
          <Route element={<UserLayout />}>
            <Route path="/digital-market" element={<DigitalMarket />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/logout" element={<Logout />} />
          </Route>

          {/* Farmer-Only Routes */}
          <Route element={<FarmerLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* Catch-all 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AppShell.Main>
    </AppShell>
  );
}
export default App;
