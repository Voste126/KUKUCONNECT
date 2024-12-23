import { AppShell, Flex, Button, Burger } from '@mantine/core';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useMantineColorScheme } from '@mantine/core';

interface HeaderProps {
  toggle: () => void; // Assuming toggle is a function with no arguments and no return value
  opened: boolean;    // Assuming opened is a boolean
}

const Header = ({ toggle, opened }: HeaderProps) => {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  const toggleColorScheme = () => {
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <AppShell.Header>
      <Flex
        justify={'space-between'} align={'center'}
        style={{ padding: '10px 20px' }}
      >
        <Burger opened={opened} onClick={toggle} hiddenFrom='sm' size='sm' />
        <div>
          kukuconnect
        </div>
        <Button size='sm' variant='link' onClick={toggleColorScheme}>
          {colorScheme === 'dark' ? <FaSun /> : <FaMoon />}
        </Button>
      </Flex>
    </AppShell.Header>
  );
};

export default Header;