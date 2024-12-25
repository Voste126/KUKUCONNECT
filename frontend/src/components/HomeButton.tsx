import { Container, Grid, Text, Title, Button, Group, Box, Center } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { useMediaQuery } from '@mantine/hooks';
import { Paper } from '@mantine/core';
import { useMantineTheme } from '@mantine/core';
import heroImage from '../assets/hero3.jpg';
import classes from './Demo.module.css';

const themeColors = {
  primary: '#006400',  // Green
  secondary: '#8B4513', // Blue
  background: '#F5F5DC',
  text: '#2F4F4F',
  Accent: '#FFD700',
};

const data = [
  {
    image: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
    title: 'Empowering Farmers with Technology',
    category: 'AgriTech',
  },
  // {
  //   image: 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
  //   title: 'Connecting Suppliers to the Market',
  //   category: 'Marketplaces',
  // },
  // {
  //   image: 'https://images.unsplash.com/photo-1608481337062-4093bf3ed404?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
  //   title: 'Smart Farming Solutions',
  //   category: 'Innovation',
  // },
  // {
  //   image: 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
  //   title: 'AI and IoT for Better Agriculture',
  //   category: 'Technology',
  // },
  // {
  //   image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
  //   title: 'Innovating the Agricultural Supply Chain',
  //   category: 'Supply Chain',
  // },
  // {
  //   image: 'https://images.unsplash.com/photo-1582721478779-0ae163c05a60?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
  //   title: 'Sustainable Farming Practices',
  //   category: 'Sustainability',
  // },
];

interface CardProps {
  image: string;
  title: string;
  category: string;
}

function Card({ image, title, category }: CardProps) {
  return (
    <Paper
      shadow="md"
      p="xl"
      radius="md"
      style={{ backgroundImage: `url(${image})` }}
      className={classes.card}
    >
      <div>
        <Text className={classes.category} size="xs">
          {category}
        </Text>
        <Title order={3} className={classes.title}>
          {title}
        </Title>
      </div>
      <Button variant="white" color="dark">
        Read article
      </Button>
    </Paper>
  );
}

function CarouselSection() {
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const slides = data.map((item) => (
    <Carousel.Slide key={item.title}>
      <Card {...item} />
    </Carousel.Slide>
  ));

  return (
    <Carousel
      slideSize={mobile ? "90%" : "20%"} // Adjust size for horizontal alignment
      slideGap="md"                     // Adjust gap between slides
      align="center"                    // Center the slides horizontally
      loop                              // Enable infinite looping
      controlsOffset="xs"               // Offset controls slightly
      styles={{
        control: { color: themeColors.primary },
      }}
    >
      {slides}
    </Carousel>
  );
}

export function Home() {
  return (
      <Box style={{ backgroundColor: 'transparent', minHeight: '100vh', padding: '2rem' }}>
        {/* Carousel Section */}
        

        {/* Hero Section */}
        <Container
          style={{
            height: '45vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '2rem 2rem',
            marginTop: '10rem',
            marginBottom: '10rem',
          }}
        >
          <Grid justify="space-between" align="center" style={{ width: '100%' }}>
            <Grid.Col span={6} style={{ textAlign: 'left', paddingRight: '8rem' }}>
              <Title
                order={1}
                style={{
                  color: '#006400', // Dark Green
                  fontSize: '3rem',
                  fontWeight: 800,
                  marginBottom: '1rem',
                }}
              >
                Welcome to KukuConnect
              </Title>
              <Text
                size="lg"
                style={{
                  color: '#333333', // Dark Gray
                  marginBottom: '2rem',
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
                    padding: '0.75rem 2rem',
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
                    padding: '0.75rem 2rem',
                  }}
                >
                  Learn More
                </Button>
              </Group>
            </Grid.Col>

            <Grid.Col span={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <img
                src={heroImage}
                alt=""
                style={{
                  width: '100%',
                  maxWidth: '650px',
                  borderRadius: '10px',
                  boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.3)',
                }}
              />
            </Grid.Col>
            </Grid>
        </Container>

        <Container style={{ marginBottom: '5rem'}}>
            <Grid>
                <Grid.Col span={5}>
                  <CarouselSection />
                </Grid.Col>
              </Grid>
            </Container>

        {/* Features Section */}
        <Box style={{ backgroundColor: themeColors.primary, padding: '4rem 2rem', marginTop: '3rem' }}>        <Container>
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
        <Container style={{ marginBottom: '5rem' }}>
          <Title order={2} style={{ color: themeColors.primary, textAlign: 'center' , marginBottom: '2rem', marginTop:'5rem'}}>
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
        <Box style={{ backgroundColor: themeColors.secondary, padding: '3rem 2rem', marginTop: '5rem' }}>
          <Container style={{ marginBottom: '5rem' }}>
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

