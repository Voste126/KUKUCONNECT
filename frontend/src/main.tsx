import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import '@mantine/core/styles.css';
import App from './App.tsx';
import { MantineProvider, MantineThemeOverride } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';

// Define the custom theme using MantineThemeOverride
const customTheme: MantineThemeOverride = {
  colors: {
    green: [
      '#006400',
      '#006400',
      '#006400',
      '#006400',
      '#006400',
      '#006400',
      '#006400',
      '#006400',
      '#006400',
      '#006400', // Add variations for consistency

    ],
    blue: [
      '#8B4513',
      '#8C4715',
      '#8E4918',
      '#90511A',
      '#92631D',
      '#946520',
      '#986722',
      '#9A6924',
      '#9C6B27',
      '#9E6D29',
    ],
    yellow: [
      '#FFD700',
      '#FFE000',
      '#FFE500',
      '#FFEB00',
      '#FFF000',
      '#FFF500',
      '#FFFA00',
      '#FFFF00',
      '#FFFF33',
      '#FFFF66',
    ],
  },
  primaryColor: 'green', // Set the primary color for the app
  fontFamily: 'Poppins, sans-serif', // Use Poppins across the app
  headings: {
    fontFamily: 'Poppins, sans-serif', // Apply Poppins to all headings // Add consistent font weight for headings
  },
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={customTheme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MantineProvider>
  </StrictMode>
);

