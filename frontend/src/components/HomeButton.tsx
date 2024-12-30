import {
  Container,
  Grid,
  Text,
  Title,
  Button,
  Group,
  Box,
} from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { useMediaQuery } from '@mantine/hooks';
import { Paper } from '@mantine/core';
import { useMantineTheme } from '@mantine/core';
import heroImage from '../assets/chicken3.png';
import classes from './Demo.module.css';
import { useNavigate } from 'react-router-dom';

const themeColors = {
  primary: '#006400',
  secondary: '#8B4513',
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
      slideSize={mobile ? '90%' : '20%'}
      slideGap="md"
      align="center"
      loop
      controlsOffset="xs"
      styles={{
        control: { color: themeColors.primary },
      }}
    >
      {slides}
    </Carousel>
  );
}

export function Home() {
  const navigate = useNavigate();
  return (
    <Box style={{ backgroundColor: 'transparent', minHeight: '90vh', padding: '2rem' }}>
      {/* Hero Section */}
      <Container
        style={{
          height: '45vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '2rem 2rem',
          marginBottom: '20rem', // Added spacing here
        }}
      >
        <Grid justify="space-between" align="center" style={{ width: '100%' }}>
          <Grid.Col span={6} style={{ textAlign: 'left', paddingRight: '8rem' }}>
            <Title
              order={1}
              style={{
                color: '#006400',
                fontSize: '3rem',
                fontWeight: 800,
                marginBottom: '1rem',
              }}
            >
              Welcome to KukuConnect
            </Title>
            <Text size="lg" style={{ color: '#333333', marginBottom: '2rem' }}>
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
                onClick={() => navigate('/login')}
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

      {/* Carousel Section */}
      <CarouselSection />

      {/* Features Section */}
      <Box
        style={{
          backgroundColor: themeColors.primary,
          padding: '14rem 2rem',
          margin: '10rem 0', // Added margin for spacing
        }}
      >
        <Container>
          <Title order={2} style={{ color: themeColors.background, textAlign: 'center' }}>
            Why Choose KUKUCONNECT?
          </Title>
          <Grid mt="lg">
            <Grid.Col span={12}>
              <Text size="xl" style={{ color: themeColors.background, fontWeight: 700 }}>
                🌱 For Farmers
              </Text>
              <Text style={{ color: themeColors.background }}>
                Connect with buyers, access market insights, and sell your produce at the best prices.
              </Text>
            </Grid.Col>
            <Grid.Col span={12}>
              <Text size="xl" style={{ fontWeight: 700, color: themeColors.background }}>
                🛒 For Buyers
              </Text>
              <Text style={{ color: themeColors.background }}>
                Discover fresh produce, connect directly with suppliers, and enjoy seamless trade.
              </Text>
            </Grid.Col>
            <Grid.Col span={12}>
              <Text size="xl" style={{ color: themeColors.background }}>
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
      <Container style={{ marginBottom: '6rem', marginTop: '6rem' }}>
        <Title order={2} style={{ color: themeColors.primary, textAlign: 'center', marginBottom: '2rem' }}>
          What Our Users Say
        </Title>
        <Grid mt="lg">
          <Grid.Col span={12}>
            <Text style={{ color: themeColors.secondary }}>
              "KUKUCONNECT transformed my business. I now have access to buyers across the country!"
            </Text>
            <Text
              style={{ marginTop: '0.5rem', color: themeColors.primary, fontWeight: 700 }}
            >
              – Jane, Poultry Farmer
            </Text>
          </Grid.Col>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        style={{
          backgroundColor: themeColors.secondary,
          padding: '3rem 2rem',
          marginTop: '6rem', // Added spacing
        }}
      >
        <Container>
          <Title order={2} style={{ color: themeColors.background, textAlign: 'center' }}>
            Ready to Transform Agriculture?
          </Title>
        </Container>
      </Box>
    </Box>
  );
}

export default Home;