import { useState } from 'react';
import {
  IconFingerprint,
  IconShoppingCart,
  IconBrain,
  IconGauge,
  IconHome2,
  IconSettings,
  IconUser,
  IconLogout,
  IconCheck,
} from '@tabler/icons-react';
import { Title, Tooltip, UnstyledButton } from '@mantine/core';
// import { MantineLogo } from '@mantinex/mantine-logo';
import classes from './DoubleNavbar.module.css';
import { useNavigate } from 'react-router-dom';

const mainLinksMockdata = [
  { icon: IconHome2, label: 'Home', path: '/' },
  { icon: IconGauge, label: 'Dashboard', path: '/dashboard' },
  { icon: IconShoppingCart, label: 'Digital Market', path: '/digital-market' },
  { icon: IconBrain, label: 'AI/IoT', path: '/ai-iot' },
  { icon: IconUser, label: 'Account', path: '/account' },
  { icon: IconFingerprint, label: 'SignUp', path: '/signup' },
  { icon: IconFingerprint, label: 'SignUp', path: '/login' },
  { icon: IconSettings, label: 'Settings', path: '/settings' },
  { icon: IconCheck, label: 'Checkout', path: '/checkout' },
  { icon: IconLogout, label: 'Logout', path: '/logout' },
];

const linksMockdata = [
  { label: 'Home', path: '/' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Digital Market', path: '/digital-market' },
  { label: 'AI support', path: '/ai-iot' },
  { label: 'Account', path: '/account' },
  { label: 'SignUp', path: '/signup' },
  { label: 'Login', path: '/login' },
  { label: 'Settings', path: '/settings' },
  { label: 'Checkout', path: '/checkout' },
  { label: 'Logout', path: '/logout' },
];

export function DoubleNavbar() {
  const [active, setActive] = useState('Menu');
  const [activeLink, setActiveLink] = useState('Home');
  const navigate = useNavigate();

  const mainLinks = mainLinksMockdata.map((link) => (
  <Tooltip
    label={link.label}
    position="right"
    withArrow
    transitionProps={{ duration: 0 }}
    key={link.label + link.path} // Ensure unique key by combining label and path
  >
    <UnstyledButton
      onClick={() => {
        setActive(link.label);
        navigate(link.path);
      }}
      className={classes.mainLink}
      data-active={link.label === active || undefined}
    >
      <link.icon size={22} stroke={1.5} />
    </UnstyledButton>
  </Tooltip>
));

  const links = linksMockdata.map((link) => (
  <a
    className={classes.link}
    data-active={activeLink === link.label || undefined}
    href="#"
    onClick={(event) => {
      event.preventDefault();
      setActiveLink(link.label);
      navigate(link.path);
    }}
    key={link.label + link.path} // Ensure unique key by combining label and path
  >
    {link.label}
  </a>
));

  return (
    <nav className={classes.navbar}>
      <div className={classes.wrapper}>
        <div className={classes.aside}>
          <div className={classes.logo}>
            {/* <MantineLogo type="mark" size={30} /> */}
          </div>
          {mainLinks}
        </div>
        <div className={classes.main}>
          <Title order={4} className={classes.title}>
            {active}
          </Title>

          {links}
        </div>
      </div>
    </nav>
  );
}