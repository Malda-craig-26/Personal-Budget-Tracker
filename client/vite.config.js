// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const API_PORT = 5000;


export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/login': `http://localhost:${API_PORT}`,
      '/register': `http://localhost:${API_PORT}`,
      '/categories': `http://localhost:${API_PORT}`,
      '/items': `http://localhost:${API_PORT}`,
      '/shared': `http://localhost:${API_PORT}`,
    },
  },
});
