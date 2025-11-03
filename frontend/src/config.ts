// config.ts
// Read the backend API URL from environment variables
// Vite exposes env variables prefixed with VITE_ via import.meta.env

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default BASE_URL;
