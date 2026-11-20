import path from 'path';

import { defineConfig } from 'vite';

// The apps' embeddable viewer helpers alone (src/embed/index.js): the embed page's sizing
// (desiredEmbedHeight, positiveIntParam) and the /embed.js builder (embedScript), which carries
// src/embed/loader.js as text (`?raw`), unminified. `import { embedScript } from
// 'nwl-components/embed'` (the server), `import { desiredEmbedHeight } from ...` (a bundled embed
// page), or, on a page with no bundle, dist/embed/nwl-components-embed.umd.js in a <script>, as
// the global `nwlComponentsEmbed`. Built after the main library (npm run build) into
// dist/embed/; no Vue, no CSS. Made as vite.panel.config.js.
export default defineConfig({
  build: {
    target: 'es2015', // as vite.config.js: BrainBox's webpack 4
    outDir: 'dist/embed',
    lib: {
      entry: path.resolve(__dirname, 'src/embed/index.js'),
      name: 'nwlComponentsEmbed',
      fileName: (format) => `nwl-components-embed.${format}.js`
    }
  }
});
