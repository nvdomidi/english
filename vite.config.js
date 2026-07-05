import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// GitHub Pages serves this project from a sub-path: nvdomidi.github.io/english/
// `base` makes every asset URL (and the PWA scope/start_url) resolve correctly.
const base = '/english/';

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon-32x32.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'فعلستان — انگلیسی با توضیح فارسی',
        short_name: 'فعلستان',
        description:
          'یادگیری گام‌به‌گام انگلیسی به زبان فارسی: فعل، گرامر، واژگان، مکالمه، فلش‌کارت و آزمون.',
        lang: 'fa',
        dir: 'rtl',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#6a4cff',
        background_color: '#f3f1fb',
        // start_url/scope are relative so they respect the /english/ base.
        start_url: '.',
        scope: base,
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Precache the app shell so it loads offline.
        globPatterns: ['**/*.{js,css,html,woff,woff2,ttf,png,svg}'],
      },
    }),
  ],
});
