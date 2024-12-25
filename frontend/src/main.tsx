import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@mantine/core/styles.css';
import App from './App.tsx'
import { createTheme, MantineProvider } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';

const theme = createTheme({
  colors: {
    green: ['#006400', '#006400', '#006400', '#006400', '#006400', '#006400', '#006400', '#006400', '#006400', '#006400'],
    blue: ['#8B4513', '#8B4513', '#8B4513', '#8B4513', '#8B4513', '#8B4513', '#8B4513', '#8B4513', '#8B4513', '#8B4513'],
    yellow: ['#FFD700', '#FFD700', '#FFD700', '#FFD700', '#FFD700', '#FFD700', '#FFD700', '#FFD700', '#FFD700', '#FFD700'],
    //gray: ['#F5F5DC', '#F5F5DC', '#F5F5DC', '#F5F5DC', '#F5F5DC', '#F5F5DC', '#F5F5DC', '#F5F5DC', '#F5F5DC', '#F5F5DC'],
    //text: ['#2F4F4F', '#2F4F4F', '#2F4F4F', '#2F4F4F', '#2F4F4F', '#2F4F4F', '#2F4F4F', '#2F4F4F', '#2F4F4F', '#2F4F4F'],
  },
  primaryColor: 'green',
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
    </MantineProvider>
  </StrictMode>
)
