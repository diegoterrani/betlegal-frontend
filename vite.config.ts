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
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      proxy: {
        '/api': { target: 'https://api.bet-legal.org', changeOrigin: true, secure: true },
        '/entrar/enviar': { target: 'https://api.bet-legal.org', changeOrigin: true, secure: true },
        '/cadastrar/enviar': { target: 'https://api.bet-legal.org', changeOrigin: true, secure: true },
        '/contestar/enviar': { target: 'https://api.bet-legal.org', changeOrigin: true, secure: true },
        '/sair': { target: 'https://api.bet-legal.org', changeOrigin: true, secure: true },
        '/confirmar': { target: 'https://api.bet-legal.org', changeOrigin: true, secure: true },
        '/mudancas/feed.xml': { target: 'https://api.bet-legal.org', changeOrigin: true, secure: true },
        '/screenshots': { target: 'https://api.bet-legal.org', changeOrigin: true, secure: true },
        '/marca': {
          target: 'https://api.bet-legal.org',
          changeOrigin: true,
          secure: true,
          bypass(req) {
            if (req.method !== 'POST') return '/index.html';
          },
        },
      },
    },
  };
});
