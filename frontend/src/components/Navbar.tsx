import { Group, Code, Image } from '@mantine/core';
import {
  IconKey,
  IconHome,
  IconTruckDelivery,
  IconDashboard,
  IconUserPlus,
  IconLogout,
  IconUserCircle,
} from '@tabler/icons-react';
import classes from './Navbar.module.css';
import KCNlogo from '../assets/KCNlogo.png';
import { Link, useLocation } from 'react-router-dom';

// Links for GUESTS (not logged in)
const guestLinks = [
  { link: '/', label: 'Home', icon: IconHome },
  { link: '/login', label: 'Login', icon: IconKey },
  { link: '/signup', label: 'Signup', icon: IconUserPlus },
];

// Links for LOGGED IN users (Buyers and Farmers)
const userLinks = [
  { link: '/digital-market', label: 'Digital Market', icon: IconTruckDelivery },
  { link: '/profile', label: 'My Profile', icon: IconUserCircle }, 
];

// Links for FARMERS ONLY
const farmerLinks = [
  { link: '/dashboard', label: 'Dashboard', icon: IconDashboard },
];

export function Navbar() {
  // Get the current URL path
  const { pathname } = useLocation();

  // Get auth state directly from localStorage
  const token = localStorage.getItem('accessToken');
  const role = localStorage.getItem('userRole');

  // Build the links to show based on auth state
  let linksToShow = guestLinks; // Default to guest

  if (token) {
    if (role === 'farmer') {
      // Farmer sees user links + farmer links
      linksToShow = [...userLinks, ...farmerLinks];
    } else {
      // Buyer (or other roles) just sees user links
      linksToShow = userLinks;
    }
  }

  const links = linksToShow.map((item) => (
    <Link
      className={classes.link}
      // THE FIX: This logic must be an exact match (pathname === item.link)
      // Your old code might have used .startsWith(), which causes this bug.
      data-active={pathname === item.link || undefined}
      to={item.link}
      key={item.label}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          <Image src={KCNlogo} alt="Kukuconnect Logo" w={150} />
          <Code fw={700}>v1.0.0</Code>
        </Group>
        {links}
      </div>

      <div className={classes.footer}>
        {/* Show Logout link only if logged in */}
        {token ? (
          <Link to="/logout" className={classes.link}>
            <IconLogout className={classes.linkIcon} stroke={1.5} />
            <span>Logout</span>
          </Link>
        ) : null}
      </div>
    </nav>
  );
}

export default Navbar;