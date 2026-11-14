// The self-hosted fonts of the kit (used by vite.config.js).
//
// src/styles/fonts.css declares the faces with URLs relative to itself (`fonts/<file>.woff2`).
// The library build copies it to dist/fonts.css (`nwl-components/fonts.css` through `exports`)
// and each woff2 file it names, from its @fontsource package (devDependencies, SIL OFL 1.1), to
// dist/fonts/, with each package's licence as dist/fonts/LICENSE-<package>.txt. Storybook's
// build (same Vite config) emits the same files next to iframe.html, and its dev server serves
// them from node_modules, so the preview has its fonts with or without a built dist/.
import fs from 'fs/promises';
import path from 'path';

const root = path.resolve(__dirname, '..');
export const fontsCss = path.join(root, 'src/styles/fonts.css');
// the @fontsource packages; a file belongs to the package whose name starts it
const packages = ['source-sans-3', 'ibm-plex-mono', 'roboto'];
const packageDir = (pkg) => path.join(root, 'node_modules/@fontsource', pkg);

// published name (relative to fonts.css) -> source path
export const fontFiles = async () => {
  const css = await fs.readFile(fontsCss, 'utf8');
  const woff2 = [...css.matchAll(/url\("fonts\/([\w-]+\.woff2)"\)/gu)].map((m) => m[1]);
  const files = woff2.map((name) => {
    const pkg = packages.find((p) => name.startsWith(`${p}-`));
    if (!pkg) { throw new Error(`fonts.css: no @fontsource package for ${name}`); }

    return [`fonts/${name}`, path.join(packageDir(pkg), 'files', name)];
  });
  const licences = packages.map((pkg) => [`fonts/LICENSE-${pkg}.txt`, path.join(packageDir(pkg), 'LICENSE')]);

  return Object.fromEntries([['fonts.css', fontsCss], ...files, ...licences]);
};

const types = { '.css': 'text/css', '.woff2': 'font/woff2', '.txt': 'text/plain' };

export const libraryFonts = {
  name: 'library-fonts',
  async generateBundle () {
    const files = await fontFiles();
    const sources = await Promise.all(Object.values(files).map((file) => fs.readFile(file)));
    Object.keys(files).forEach((fileName, i) => this.emitFile({ type: 'asset', fileName, source: sources[i] }));
  },
  // the dev server (Storybook's): the same files, at the same paths from the server's root
  configureServer (server) {
    const files = fontFiles();
    server.middlewares.use(async (req, res, next) => {
      const name = decodeURIComponent((req.url || '').split('?')[0]).replace(/^\//u, '');
      const file = (await files)[name];
      if (!file) {
        next();

        return;
      }
      res.setHeader('Content-Type', types[path.extname(name)]);
      res.end(await fs.readFile(file));
    });
  }
};
