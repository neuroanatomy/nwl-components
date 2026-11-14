import fs from 'fs/promises';
import path from 'path';

import { defineConfig } from 'vite';

import { inLayer, orderOnce } from './scripts/css-layers.js';

// The Vue-free resizable columns alone (src/components/common/resize.js), for pages built
// without Vue: `import { resizableColumns } from 'nwl-components/resize'`. Built after the main
// library (npm run build) into dist/resize/; no Vue. Made as vite.sort.config.js.
//
// The handle and wrapper styles alone (src/components/common/resize.css, only .nwl-resize-*,
// .nwl-col-resize, th.nwl-resizable and .nwl-resized rules), after the design tokens they read
// (src/styles/tokens.css), are written to dist/resize/style.css
// (`nwl-components/resize/style.css` through `exports`) and to resize/style.css (the same path
// for webpack 4, which ignores `exports`). The layer order comes first, then the tokens
// (unlayered), then the rules in `@layer nwl.components`, as in dist/style.css.
const tokensCss = path.resolve(__dirname, 'src/styles/tokens.css');
const resizeCss = path.resolve(__dirname, 'src/components/common/resize.css');
const resizeStyle = async () => orderOnce((await fs.readFile(tokensCss, 'utf8')) + '\n' +
  inLayer('nwl.components', await fs.readFile(resizeCss, 'utf8')));
const copyResizeCss = {
  name: 'copy-resize-css',
  async generateBundle () {
    this.emitFile({ type: 'asset', fileName: 'style.css', source: await resizeStyle() });
  },
  async writeBundle () {
    await fs.writeFile(path.resolve(__dirname, 'resize/style.css'), await resizeStyle());
  }
};

export default defineConfig({
  plugins: [copyResizeCss],
  build: {
    target: 'es2015', // as vite.config.js: BrainBox's webpack 4
    outDir: 'dist/resize',
    lib: {
      entry: path.resolve(__dirname, 'src/components/common/resize.js'),
      name: 'nwlComponentsResize',
      fileName: (format) => `nwl-components-resize.${format}.js`
    }
  }
});
