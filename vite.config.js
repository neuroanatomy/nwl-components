import fs from 'fs/promises';
import path from 'path';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

import { cssLayers, inLayer, orderOnce } from './scripts/css-layers.js';
import { libraryFonts } from './scripts/fonts.js';

// The design tokens alone (src/styles/tokens.css, only `:root` custom properties), for app CSS
// and pages with no bundle: copied as they are to dist/tokens.css (`nwl-components/tokens.css`
// through `exports`) and to tokens.css (the same path for webpack 4, which ignores `exports`).
// The base styles alone (src/styles/base.css), in `@layer nwl.base` after the layer order, the
// same way: dist/base.css (`nwl-components/base.css`) and base.css.
// The widgets alone (src/styles/widgets.css), in `@layer nwl.widgets` after the layer order, the
// same way: dist/widgets.css (`nwl-components/widgets.css`) and widgets.css.
// dist/style.css carries all three (src/components/index.js imports them); every stylesheet in it is
// in its layer (cssLayers), and the layer order is declared once, at its top (orderOnce).
// The fonts (dist/fonts.css and dist/fonts/, `nwl-components/fonts.css`), linked by each page
// and not in dist/style.css: see scripts/fonts.js.
const tokensCss = path.resolve(__dirname, 'src/styles/tokens.css');
const baseCss = path.resolve(__dirname, 'src/styles/base.css');
const baseStyle = async () => orderOnce(inLayer('nwl.base', await fs.readFile(baseCss, 'utf8')));
const widgetsCss = path.resolve(__dirname, 'src/styles/widgets.css');
const widgetsStyle = async () => orderOnce(inLayer('nwl.widgets', await fs.readFile(widgetsCss, 'utf8')));
const styleCss = path.resolve(__dirname, 'dist/style.css');
// The icons (src/icons/*.svg, one per meaning, see src/icons/README.md), copied as they are to
// dist/icons/ for the apps' <img> and CSS URLs (`nwl-components/icons/<name>.svg` through `exports`,
// `nwl-components/dist/icons/<name>.svg` for webpack 4). The components still inline theirs.
const iconsDir = path.resolve(__dirname, 'src/icons');
const libraryIcons = {
  name: 'library-icons',
  async generateBundle () {
    const names = (await fs.readdir(iconsDir)).filter((name) => name.endsWith('.svg'));
    const sources = await Promise.all(names.map((name) => fs.readFile(path.join(iconsDir, name))));
    names.forEach((name, i) => this.emitFile({ type: 'asset', fileName: `icons/${name}`, source: sources[i] }));
  }
};
const libraryCss = {
  name: 'library-css',
  async generateBundle () {
    this.emitFile({ type: 'asset', fileName: 'tokens.css', source: await fs.readFile(tokensCss, 'utf8') });
    this.emitFile({ type: 'asset', fileName: 'base.css', source: await baseStyle() });
    this.emitFile({ type: 'asset', fileName: 'widgets.css', source: await widgetsStyle() });
  },
  async writeBundle () {
    await fs.copyFile(tokensCss, path.resolve(__dirname, 'tokens.css'));
    await fs.writeFile(path.resolve(__dirname, 'base.css'), await baseStyle());
    await fs.writeFile(path.resolve(__dirname, 'widgets.css'), await widgetsStyle());
    await fs.writeFile(styleCss, orderOnce(await fs.readFile(styleCss, 'utf8')));
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
  css: {
    postcss: {
      plugins: [cssLayers()]
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
  plugins: [vue(), libraryCss, libraryIcons, libraryFonts]
});
