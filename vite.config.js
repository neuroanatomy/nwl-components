import path from 'path';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '/src'),
      '~@': path.resolve(__dirname, '/src')
    }
  },
  build: {
    // es2015: BrainBox bundles dist/ with webpack 4, whose parser (acorn 6) fails on
    // ?? and ?. (vite's default target emits them).
    target: 'es2015',
    lib: {
      entry: path.resolve(__dirname, 'src/components/index.js'),
      name: 'nwl-components',
      fileName: (format) => `nwl-components.${format}.js`
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // Add external deps here
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  plugins: [vue()]
});
