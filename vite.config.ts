import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// 開發模式以 dev server 代理繞過各來源 API 的 CORS 限制；
// 正式部署時應以自己的後端 / edge function 提供同樣的路由。
export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api/reddit': {
        target: 'https://www.reddit.com',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/reddit/, ''),
        headers: { 'User-Agent': 'us-market-sentiment-monitor/1.0' },
      },
      '/api/stocktwits': {
        target: 'https://api.stocktwits.com',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/stocktwits/, ''),
      },
      '/api/x': {
        target: 'https://api.twitter.com',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/x/, ''),
      },
    },
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
