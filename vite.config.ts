import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// numeo-project/src/components/ -> @components

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      '@components': path.resolve(__dirname, '/src/components/'),
      '@features': path.resolve(__dirname, '/src/features/'),
      '@lib': path.resolve(__dirname, '/src/lib/'),
      '@pages': path.resolve(__dirname, '/src/pages/'),
      '@router': path.resolve(__dirname, 'src/router/'),
      '@services': path.resolve(__dirname, '/src/services/'),
      '@contexts': path.resolve(__dirname, '/src/contexts/'),
      '@app-types': path.resolve(__dirname, '/src/app-types/'),
    },
  },
});
