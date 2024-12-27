import './App.css';
import React from 'react';
// Core styles are required for all packages
import { AppShell, Title, Burger, Flex, Button, useMantineColorScheme, useComputedColorScheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { FaMoon, FaSun } from 'react-icons/fa';
import chickenLogo from './assets/KCNlogo.png';
import { DoubleNavbar } from './components/Navbar';
const RouterSwitcher = React.lazy(() => import('./components/RouterSwitcher'));
function App() {
  
  const [opened, { toggle }] = useDisclosure();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme();

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Flex
            justify="flex-start"  // Align items to the left
            align="center"
            style={{ padding: '10px 20px' }}
          >
            <img
              src={chickenLogo}
              alt="KUKUCONNECT"
              style={{ width: '50px', height: '50px', marginRight: '10px' }}
            />
            <Title order={3} style={{ marginRight: 'auto' }}>KUKUCONNECT</Title> {/* Added marginRight: 'auto' for left alignment */}
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" />
            <Button
              size="sm"
              variant="filled"
              onClick={toggleColorScheme}
              style={{ backgroundColor: 'green' }}
            >
              {computedColorScheme === 'dark' ? <FaSun /> : <FaMoon />}
            </Button>
          </Flex>
        </AppShell.Header>

        <AppShell.Navbar>
          <DoubleNavbar />
        </AppShell.Navbar>

        <AppShell.Main>
          <React.Suspense fallback="Loading...">
            <RouterSwitcher />
          </React.Suspense>
        </AppShell.Main>

        <AppShell.Footer>
          <Flex justify="center" align="center" style={{ padding: '10px 20px' }}>
            <p>&copy; 2024 KUKUCONNECT</p>
          </Flex>
        </AppShell.Footer>
      </AppShell>
    </>
  );
}

export default App;

