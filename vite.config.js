import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'), 
        newsletter: resolve(__dirname, 'newsletter/index.html'),
        post: resolve(__dirname, 'newsletter/post.html'),
        subscribe: resolve(__dirname, 'newsletter/subscribe.html'),
        book: resolve(__dirname, 'book/index.html'),
      },
    },
  },
  publicDir: 'public', // 👈 Tells Vite to copy everything from /newsletter/ directly into dist/
});