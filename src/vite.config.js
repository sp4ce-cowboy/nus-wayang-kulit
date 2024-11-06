import { defineConfig } from 'vite';

export default defineConfig({
  base: '/nus-wayang-kulit/', // Replace with your GitHub repo name
  server: {
    host: '0.0.0.0', // Listen on all available network interfaces
    port: 5174 // Specify your port here
  },
});
