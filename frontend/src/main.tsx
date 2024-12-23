import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createTheme, MantineProvider } from '@mantine/core';
import {BrowserRouter} from 'react-router-dom';
const theme = createTheme({
  /** Put your mantine theme override here */
});

createRoot(document.getElementById('root')!).render(
  <MantineProvider theme={theme} defaultColorScheme='light'>
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  </MantineProvider>
  
)
