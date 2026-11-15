import path from 'path';

import { defineConfig } from 'vite';

// The Vue-free floating panel helper alone (src/components/common/panel.js), for pages built
// without Vue: `import { floatingPanel } from 'nwl-components/panel'`, or, on a page with no
// bundle, dist/panel/nwl-components-panel.umd.js in a <script>, as the global
// `nwlComponentsPanel`. Built after the main library (npm run build) into dist/panel/; no Vue,
// no CSS (the panel's CSS is in widgets.css). Made as vite.resize.config.js.
export default defineConfig({
  build: {
    target: 'es2015', // as vite.config.js: BrainBox's webpack 4
    outDir: 'dist/panel',
    lib: {
      entry: path.resolve(__dirname, 'src/components/common/panel.js'),
      name: 'nwlComponentsPanel',
      fileName: (format) => `nwl-components-panel.${format}.js`
    }
  }
});
