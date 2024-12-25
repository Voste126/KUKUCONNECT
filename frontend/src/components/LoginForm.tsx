import { TextInput, PasswordInput, Button, Group, Box, Title } from '@mantine/core';
import { useForm } from '@mantine/form';

const LoginForm = () => {
  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },

    validate: {
      username: (value) => (value.length < 2 ? 'Username must have at least 2 characters' : null),
      password: (value) => (value.length < 6 ? 'Password must have at least 6 characters' : null),
    },
  });

  const handleSubmit = () => {
    // e.preventDefault();
    // console.log(form.values); // Handle form submission
  };

  return (
    <Box style={{ maxWidth: 400 }} mx="auto">
      <Title order={2}  style={{ color: '#2F4F4F'}}>Login</Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Username"
          placeholder="Enter your username"
          {...form.getInputProps('username')}
          required
          mb="md"
        />
        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          {...form.getInputProps('password')}
          required
          mb="md"
        />
        <Group  mt="lg">
          <Button type="submit" style={{ backgroundColor: '#8B4513', color: 'white', width: '100%' }}>
            Login
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default LoginForm;
