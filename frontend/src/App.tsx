import { AppShell } from '@mantine/core';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
// ---
// THE FIX: Import DoubleNavbar instead of Navbar
// ---
import { DoubleNavbar } from './components/DoubleNavbar'; 
import { LoginPage } from './components/LoginForm'; 
import { SignupPage } from './components/SignUpPage';
import Dashboard from './components/Dashboard';
import Logout from './components/Logout';
import ProfileForm from './components/ProfileForm';
import HomeButton from './components/HomeButton';
import ProductList from './pages/ProductList'; 
import Checkout from './pages/Checkout';
import Cart from './pages/Cart';

/**
 * Helper function to get auth state from localStorage
 */
const getAuth = () => {
  const token = localStorage.getItem('accessToken');
  const role = localStorage.getItem('userRole');
  return { token, role };
};

const ProfilePage = () => {
    const role = localStorage.getItem('userRole') as 'farmer' | 'buyer';
    if (!role) return <Navigate to="/login" />;
    return (
      <div style={{ padding: '20px' }}>
        <ProfileForm userType={role} />
      </div>
    );
};

const NotFoundPage = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h1>404 - Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
  </div>
);


// ---
// App Layouts
// ---

/**
 * For GUEST pages (Home, Login, Signup).
 */
const GuestLayout = () => {
  const { token, role } = getAuth(); 

  if (!token) {
    return <Outlet />; // Not logged in, show guest page
  }
  
  // If logged in, redirect based on role
  const redirectTo = role === 'farmer' ? '/dashboard' : '/digital-market';
  return <Navigate to={redirectTo} replace />;
};

/**
 * For AUTHENTICATED pages (the main app).
 */
const AppLayout = () => {
  const { token } = getAuth();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppShell
      navbar={{
        width: 300, // This width matches the DoubleNavbar CSS
        breakpoint: 'sm',
      }}
      padding="md" // This provides the top margin
    >
      <AppShell.Navbar>
        {/* ---
          THE FIX: Render <DoubleNavbar /> here
        --- */}
        <DoubleNavbar /> 
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

/**
 * For pages ONLY a FARMER can see.
 */
const FarmerOnlyLayout = () => {
  const { role } = getAuth();
  if (role !== 'farmer') {
    return <Navigate to="/digital-market" replace />;
  }
  return <Outlet />;
};


/**
 * Main App Component
 */
function App() {
  return (
    <Routes>
      {/* === Guest-Only Routes (No Navbar) === */}
      <Route element={<GuestLayout />}>
        <Route path="/" element={<HomeButton />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      {/* === Authenticated App Routes (With Navbar) === */}
      <Route element={<AppLayout />}>
        {/* Routes for all logged-in users */}
        <Route path="/digital-market" element={<ProductList />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/logout" element={<Logout />} />
        
        {/* Farmer-Only Routes (nested) */}
        <Route element={<FarmerOnlyLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Route>

      {/* === Catch-all 404 === */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
