import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue()
  ],
  build: {
    rollupOptions: {
      output: {
        // Customize the output paths for assets, CSS, and JS
        assetFileNames: ({ name }) => {
          if (/\.(gif|jpg|png|svg|webp)$/.test(name ?? '')) {
            return 'assets/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        cssFileNames: 'css/[name]-[hash].css',
      },
    },
  },
});

