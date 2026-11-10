import fs from 'fs/promises';
import path from 'path';

import { defineConfig } from 'vite';

// The Vue-free sorting helpers alone (src/components/common/sort.js), for pages built without
// Vue: `import { sortRows, sortableHeader } from 'nwl-components/sort'`. Built after the main
// library (npm run build) into dist/sort/; no Vue.
//
// The header styles alone (src/components/common/sortable.css, only th.nwl-sortable and
// .nwl-sort-* rules) are copied as they are to dist/sort/style.css (`nwl-components/sort/style.css`
// through `exports`) and to sort/style.css (the same path for webpack 4, which ignores
// `exports`). Pages without Vue load only this file: dist/style.css has global rules.
const sortableCss = path.resolve(__dirname, 'src/components/common/sortable.css');
const copySortableCss = {
  name: 'copy-sortable-css',
  async generateBundle () {
    this.emitFile({ type: 'asset', fileName: 'style.css', source: await fs.readFile(sortableCss, 'utf8') });
  },
  async writeBundle () {
    await fs.copyFile(sortableCss, path.resolve(__dirname, 'sort/style.css'));
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
