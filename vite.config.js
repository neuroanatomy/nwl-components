import fs from 'fs/promises';
import path from 'path';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// The design tokens alone (src/styles/tokens.css, only `:root` custom properties), for app CSS
// and pages with no bundle: copied as they are to dist/tokens.css (`nwl-components/tokens.css`
// through `exports`) and to tokens.css (the same path for webpack 4, which ignores `exports`).
// dist/style.css carries them too (src/components/index.js imports them).
const tokensCss = path.resolve(__dirname, 'src/styles/tokens.css');
const copyTokensCss = {
  name: 'copy-tokens-css',
  async generateBundle () {
    this.emitFile({ type: 'asset', fileName: 'tokens.css', source: await fs.readFile(tokensCss, 'utf8') });
  },
  async writeBundle () {
    await fs.copyFile(tokensCss, path.resolve(__dirname, 'tokens.css'));
  }
};

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
  plugins: [vue(), copyTokensCss]
});
