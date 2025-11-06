// frontend/src/components/HomeButton.tsx (or Home.tsx)

import {
  Container,
  Grid,
  Text,
  Title,
  Button,
  Group,
  Box,
} from '@mantine/core';
// import { Carousel } from '@mantine/carousel';
// import { useMediaQuery } from '@mantine/hooks';
// import { Paper } from '@mantine/core';
// import { useMantineTheme } from '@mantine/core';
import heroImage from '../assets/chicken3.png';
// import classes from './Demo.module.css';
import { useNavigate } from 'react-router-dom';

const themeColors = {
  primary: '#006400',
  secondary: '#8B4513',
  background: '#F5F5DC',
  text: '#2F4F4F',
  Accent: '#FFD700',
};

// const data = [
//   {
//     image: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
//     title: 'Empowering Farmers with Technology',
//     category: 'AgriTech',
//   },
//   {
//     image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
//     title: 'Connecting Buyers and Suppliers',
//     category: 'Marketplace',
//   },
//   {
//     image: 'https://images.unsplash.com/photo-1556761175-59736f62325c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
//     title: 'AI & IoT for Smart Farming',
//     category: 'Innovation',
//   },
// ];

// interface CardProps {
//   image: string;
//   title: string;
//   category: string;
// }

// function Card({ image, title, category }: CardProps) {
//   return (
//     <Paper
//       shadow="md"
//       p="xl"
//       radius="md"
//       // These inline styles fix the carousel card distortion
//       style={{
//         backgroundImage: `url(${image})`,
//         height: '350px',
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'space-between',
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//       }}
//     >
//       <div>
//         <Text className={classes.category} size="xs">
//           {category}
//         </Text>
//         <Title order={4} className={classes.title}>
//           {title}
//         </Title>
//       </div>
//       <Button variant="white" color="dark" size="sm">
//         Read article
//       </Button>
//     </Paper>
//   );
// }

// function CarouselSection() {
//   const theme = useMantineTheme();
//   const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
//   const slides = data.map((item) => (
//     <Carousel.Slide key={item.title}>
//       <Card {...item} />
//     </Carousel.Slide>
//   ));

//   return (
//     <Carousel
//       slideSize={mobile ? '90%' : '33.33%'} // Shows 3 cards on desktop
//       slideGap="md"
//       align="center"
//       loop
//       withIndicators // Adds navigation dots
//       controlsOffset="xs"
//       styles={{
//         control: { color: themeColors.primary },
//         indicator: {
//           backgroundColor: themeColors.primary,
//         }
//       }}
//     >
//       {slides}
//     </Carousel>
//   );
// }


export function Home() {
  const navigate = useNavigate();
  return (
    <Box style={{ backgroundColor: 'transparent', minHeight: '90vh', padding: '2rem 0' }}>
      {/* Hero Section */}
      <Container
        fluid // Makes section full-width
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '2rem',
          marginBottom: '4rem',
        }}
      >
        <Grid justify="space-between" align="center" style={{ width: '100%' }}>
          <Grid.Col span={{ base: 12, md: 6 }} style={{ textAlign: 'left', paddingRight: '2rem' }}>
            <Title
              order={1}
              style={{
                color: '#006400',
                fontSize: '2.5rem', // Smaller font
                fontWeight: 800,
                marginBottom: '1rem',
              }}
            >
              Welcome to KukuConnect
            </Title>
            <Text size="md" style={{ color: '#333333', marginBottom: '2rem' }}> {/* Smaller text */}
              The modern AgriTech solution for farmers, suppliers, and buyers. Empowering communities
              with digital tools to connect, trade, and innovate.
            </Text>
            <Group>
              <Button
                size="md" // Smaller button
                radius="xl"
                style={{
                  backgroundColor: themeColors.primary,
                }}
                onClick={() => navigate('/login')}
              >
                Get Started
              </Button>
              <Button
                size="md" // Smaller button
                radius="xl"
                variant="outline"
                style={{
                  borderColor: themeColors.primary,
                  color: themeColors.primary,
                }}
              >
                Learn More
              </Button>
            </Group>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }} style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <img
              src={heroImage}
              alt=""
              style={{
                width: '100%',
                maxWidth: '550px', // Smaller image
                borderRadius: '10px',
                boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.3)',
              }}
            />
          </Grid.Col>
        </Grid>
      </Container>

      {/* Carousel Section */}
      {/* <CarouselSection /> */}

      {/* Features Section */}
      <Box
        style={{
          backgroundColor: themeColors.primary,
          padding: '4rem 2rem', // Reduced padding
          margin: '4rem 0', // Reduced margin
        }}
      >
        <Container fluid> 
          <Title order={3} style={{ color: themeColors.background, textAlign: 'center' }}> {/* Smaller title */}
            Why Choose KUKUCONNECT?
          </Title>
          <Grid mt="lg">
            
            {/*
              *** THIS IS THE CRITICAL FIX ***
              The 'span' prop is changed to a responsive object
              to make the columns horizontal on medium (md) screens.
            */}

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Text size="lg" style={{ color: themeColors.background, fontWeight: 700 }}>
                🌱 For Farmers
              </Text>
              <Text style={{ color: themeColors.background }}>
                Connect with buyers, access market insights, and sell your produce at the best prices.
              </Text>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Text size="lg" style={{ fontWeight: 700, color: themeColors.background }}>
                🛒 For Buyers
              </Text>
              <Text style={{ color: themeColors.background }}>
                Discover fresh produce, connect directly with suppliers, and enjoy seamless trade.
              </Text>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Text size="lg" style={{ color: themeColors.background, fontWeight: 700 }}>
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
      <Container style={{ margin: '4rem auto' }}> {/* Reduced margin */}
        <Title order={3} style={{ color: themeColors.primary, textAlign: 'center', marginBottom: '2rem' }}> {/* Smaller title */}
          What Our Users Say
        </Title>
        <Grid mt="lg">
          <Grid.Col span={12}>
            <Text style={{ color: themeColors.secondary, textAlign: 'center', fontSize: '1.1rem' }}>
              "KUKUCONNECT transformed my business. I now have access to buyers across the country!"
            </Text>
            <Text
              style={{ marginTop: '0.5rem', color: themeColors.primary, fontWeight: 700, textAlign: 'center' }}
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
          padding: '4rem 2rem', // Reduced padding
          marginTop: '4rem', // Reduced margin
        }}
      >
        <Container>
          <Title order={3} style={{ color: themeColors.background, textAlign: 'center' }}> {/* Smaller title */}
            Ready to Transform Agriculture?
          </Title> 
        </Container>
      </Box>
    </Box>
  );
}

export default Home;