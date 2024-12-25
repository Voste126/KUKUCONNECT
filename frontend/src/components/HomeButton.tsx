import { Container, Grid, Text, Title, Button,  Group, Box, Center } from '@mantine/core';

import heroImage from '../assets/hero3.jpg';

const themeColors = {
  primary: '#006400',  // Green
  secondary: '#8B4513', // Blue
  background: '#F5F5DC',
  text: '#2F4F4F' ,
  Accent: '#FFD700 ',
};

export function Home() {
  return (
    <Box style={{ backgroundColor: 'transparent', minHeight: '100vh', padding: '2rem' }}>
      {/* Hero Section */}
      <Container
  style={{
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '2rem 4rem', // Adds padding around the container
  }}
>
  <Grid justify="space-between" align="center" style={{ width: '100%' }}>
    {/* Left Column: Text */}
    <Grid.Col span={6} style={{ textAlign: 'left', paddingRight: '2rem' }}>
      <Title
        order={1}
        style={{
          color: '#006400', // Dark Green
          fontSize: '3rem',
          fontWeight: 800,
          marginBottom: '1rem', // Adds spacing below the title
        }}
      >
        Welcome to KUKUCONNECT
      </Title>
      <Text
        size="lg"
        style={{
          color: '#333333', // Dark Gray
          marginBottom: '2rem', // Adds spacing below the description
        }}
      >
        The modern AgriTech solution for farmers, suppliers, and buyers. Empowering communities
        with digital tools to connect, trade, and innovate.
      </Text>
      <Group>
        <Button
          size="lg"
          radius="xl"
          style={{
            backgroundColor: themeColors.primary,
            padding: '0.75rem 2rem', // Enlarges button for better appearance
          }}
        >
          Get Started
        </Button>
        <Button
          size="lg"
          radius="xl"
          variant="outline"
          style={{
            borderColor: themeColors.primary,
            color: themeColors.primary,
            padding: '0.75rem 2rem', // Enlarges button for better appearance
          }}
        >
          Learn More
        </Button>
      </Group>
    </Grid.Col>

    {/* Right Column: Main Image */}
    <Grid.Col span={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <img
        src={heroImage} // Replace with your actual image URL
        alt="Hero Image"
        style={{
          width: '100%',
          maxWidth: '650px', // Enlarged the image slightly
          borderRadius: '10px',
          boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.3)', // Enhanced shadow for depth
        }}
      />
    </Grid.Col>
  </Grid>
</Container>


      {/* Features Section */}
      <Box style={{ backgroundColor: themeColors.primary, padding: '4rem 2rem', marginTop: '3rem' }}>
        <Container>
          <Title order={2} style={{ color: themeColors.background, textAlign: 'center' }}>
            Why Choose KUKUCONNECT?
          </Title>
          <Grid mt="lg">
            <Grid.Col span={12} >
              <Text size="xl" style={{ color: themeColors.background, fontWeight: 700 }}>
                🌱 For Farmers
              </Text>
              <Text style={{ color: themeColors.background }}>
                Connect with buyers, access market insights, and sell your produce at the best prices.
              </Text>
            </Grid.Col>
            <Grid.Col span={12} >
              <Text size="xl" style={{ fontWeight: 700, color: themeColors.background }}>
                🛒 For Buyers
              </Text>
              <Text style={{ color: themeColors.background }}>
                Discover fresh produce, connect directly with suppliers, and enjoy seamless trade.
              </Text>
            </Grid.Col>
            <Grid.Col span={12}>
              <Text size="xl"  style={{ color: themeColors.background }}>
                📈 For Innovators
              </Text>
              <Text style={{ color: themeColors.background }}>
                Leverage AI and IoT for smarter farming and supply chain management.
              </Text>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Container style={{ marginTop: '3rem' }}>
        <Title order={2} style={{ color: themeColors.primary, textAlign: 'center' }}>
          What Our Users Say
        </Title>
        <Grid mt="lg">
          <Grid.Col span={12} >
            <Text style={{ color: themeColors.secondary }}>
              "KUKUCONNECT transformed my business. I now have access to buyers across the country!"
            </Text>
            <Text style={{ marginTop: '0.5rem', color: themeColors.primary, fontWeight: 700 }}>
              – Jane, Poultry Farmer
            </Text>
          </Grid.Col>
          <Grid.Col span={12} >
            <Text style={{ color: themeColors.secondary }}>
              "The IoT tools helped me monitor my greenhouse efficiently!"
            </Text>
            <Text  style={{ marginTop: '0.5rem', color: themeColors.primary }}>
              – John, AgriTech Enthusiast
            </Text>
          </Grid.Col>
          <Grid.Col span={12} >
            <Text style={{ color: themeColors.secondary }}>
              "As a supplier, I can now reach more customers effortlessly."
            </Text>
            <Text  style={{ marginTop: '0.5rem', color: themeColors.primary }}>
              – Mary, Produce Supplier
            </Text>
          </Grid.Col>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box style={{ backgroundColor: themeColors.secondary, padding: '3rem 2rem', marginTop: '3rem' }}>
        <Container>
          <Title order={2} style={{ color: themeColors.background, textAlign: 'center' }}>
            Ready to Transform Agriculture?
          </Title>
          <Text size="lg" style={{ color: themeColors.background, textAlign: 'center', marginTop: '1rem' }}>
            Join thousands of users on KUKUCONNECT today.
          </Text>
          <Center mt="lg">
            <Button size="lg" radius="xl" style={{ backgroundColor: themeColors.background, color: themeColors.primary }}>
              Sign Up Now
            </Button>
          </Center>
        </Container>
      </Box>
    </Box>
  );
}

export default Home;
