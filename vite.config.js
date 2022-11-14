import react from '@vitejs/plugin-react';
import fullReload from 'vite-plugin-full-reload'
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [fullReload('**'), react()],
});
