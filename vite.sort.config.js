import fs from 'fs/promises';
import path from 'path';

import { defineConfig } from 'vite';

import { inLayer, orderOnce } from './scripts/css-layers.js';

// The Vue-free sorting helpers alone (src/components/common/sort.js), for pages built without
// Vue: `import { sortRows, sortableHeader } from 'nwl-components/sort'`. Built after the main
// library (npm run build) into dist/sort/; no Vue.
//
// The header styles alone (src/components/common/sortable.css, only th.nwl-sortable and
// .nwl-sort-* rules), after the design tokens they read (src/styles/tokens.css, only `:root`
// custom properties), are written to dist/sort/style.css (`nwl-components/sort/style.css`
// through `exports`) and to sort/style.css (the same path for webpack 4, which ignores
// `exports`). The layer order comes first, then the tokens (unlayered), then the header rules in
// `@layer nwl.components`, as in dist/style.css.
const tokensCss = path.resolve(__dirname, 'src/styles/tokens.css');
const sortableCss = path.resolve(__dirname, 'src/components/common/sortable.css');
const sortStyle = async () => orderOnce((await fs.readFile(tokensCss, 'utf8')) + '\n' +
  inLayer('nwl.components', await fs.readFile(sortableCss, 'utf8')));
const copySortableCss = {
  name: 'copy-sortable-css',
  async generateBundle () {
    this.emitFile({ type: 'asset', fileName: 'style.css', source: await sortStyle() });
  },
  async writeBundle () {
    await fs.writeFile(path.resolve(__dirname, 'sort/style.css'), await sortStyle());
  }
};

export default defineConfig({
  plugins: [copySortableCss],
  build: {
    target: 'es2015', // as vite.config.js: BrainBox's webpack 4
    outDir: 'dist/sort',
    lib: {
      entry: path.resolve(__dirname, 'src/components/common/sort.js'),
      name: 'nwlComponentsSort',
      fileName: (format) => `nwl-components-sort.${format}.js`
    }
  }
});
