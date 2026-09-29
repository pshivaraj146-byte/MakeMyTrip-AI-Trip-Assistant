import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      // The deployed preview does not provide a Vite WebSocket endpoint. Keep
      // the Vite client from opening a connection that immediately closes.
      hmr: process.env.DISABLE_HMR !== 'true' && process.env.VERCEL !== '1' && process.env.NODE_ENV !== 'production',
      // Disable file watching when HMR is disabled to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' || process.env.VERCEL === '1' || process.env.NODE_ENV === 'production' ? null : {},
    },
  };
});
