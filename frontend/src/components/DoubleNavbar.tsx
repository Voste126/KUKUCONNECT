// src/components/DoubleNavbar.tsx
import { useState } from 'react';
import { Box, Stack } from '@mantine/core';
import {
  IconTruckDelivery,
  IconDashboard,
  IconUserCircle,
  IconLogout,
  IconShoppingCart, // <-- ADDED for Checkout
} from '@tabler/icons-react';
import classes from './DoubleNavbar.module.css';
// import KCNlogo from '../assets/KCNlogo.png';
import { Link, useLocation } from 'react-router-dom';

// Main categories (Icon Bar)
const mainLinksData = [
  { icon: IconTruckDelivery, label: 'Market' },
  { icon: IconDashboard, label: 'Dashboard', role: 'farmer' }, // Farmer only
  { icon: IconUserCircle, label: 'Account' },
];

// Sub-links for each category (Text Links)
const linksData: Record<string, { label: string; link: string; icon: typeof IconTruckDelivery }[]> = {
  Market: [
    { link: '/digital-market', label: 'Digital Market', icon: IconTruckDelivery },
    { link: '/checkout', label: 'Checkout', icon: IconShoppingCart }, // <-- ADDED
  ],
  Dashboard: [
    { link: '/dashboard', label: 'Dashboard', icon: IconDashboard },
  ],
  Account: [
    { link: '/profile', label: 'My Profile', icon: IconUserCircle },
  ],
};

/**
 * This function finds the default active tab based on the current URL
 * so the correct sub-links are showing when you load the page.
 */
const getDefaultActiveTab = (pathname: string, role: string | null) => {
  if (pathname.startsWith('/dashboard') && role === 'farmer') {
    return 'Dashboard';
  }
  if (pathname.startsWith('/profile')) {
    return 'Account';
  }
  // Default
  return 'Market';
};

export function DoubleNavbar() {
  const { pathname } = useLocation();
  const role = localStorage.getItem('userRole');
  
  // Set the active tab based on the current URL
  const [active, setActive] = useState(getDefaultActiveTab(pathname, role));

  // Filter main links based on role
  const mainLinks = mainLinksData
    .filter(item => !item.role || item.role === role)
    .map((link) => (
    <Box
      component="button"  
      className={classes.mainLink}
      data-active={link.label === active || undefined}
      key={link.label}
      onClick={() => setActive(link.label)}
    >
      <link.icon style={{ width: 24, height: 24 }} stroke={1.5} /> {/* <-- UPDATED size */}
    </Box>
  ));

  // Get links for the active section.
  const activeLinks = linksData[active] || [];
  const links = activeLinks.map((item) => (
    <Link
      className={classes.link}
      data-active={pathname === item.link || undefined}
      to={item.link}
      key={item.label}
    >
      {/* <-- UPDATED size via style prop --> */}
      <item.icon className={classes.linkIcon} style={{ width: 24, height: 24 }} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.wrapper}>
        {/* Logo and Version Header */}
        {/* <div className={classes.header}>
          <Group justify="space-between">
            <Image src={KCNlogo} alt="Kukuconnect Logo" w={150} />
            <Code fw={700}>v1.0.0</Code>
          </Group>
        </div>
         */}
        {/* Main Navbar (Icons) */}
        <div className={classes.main}>
          <Stack justify="center" gap={0}>
            {mainLinks}
          </Stack>
        </div>

        {/* Active Links Navbar (Text) */}
        <div className={classes.links}>
          <div className={classes.linksInner}>
            <Stack>
             {links}
            </Stack>
          </div>
        </div>
      </div>
      
      {/* Footer (Logout) */}
      <div className={classes.footer}>
        <Link to="/logout" className={classes.footerLink}>
          <IconLogout style={{ width: 24, height: 24 }} stroke={1.5} /> {/* <-- UPDATED size */}
          <span>Logout</span>
        </Link>
      </div>
    </nav>
  );
}

export default DoubleNavbar;