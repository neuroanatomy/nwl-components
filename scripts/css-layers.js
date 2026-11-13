// Cascade layers for the library's CSS (used by vite.config.js and vite.sort.config.js).
//
// All the library's CSS is in `@layer nwl.base, nwl.widgets, nwl.components`, so unlayered app
// CSS always wins over it, whatever the load order or specificity. src/styles/base.css goes into
// nwl.base, src/styles/widgets.css into nwl.widgets; every other stylesheet (the SFCs' <style>
// blocks, scoped or not, sortable.css and the CSS of bundled dependencies) into nwl.components.
// src/styles/tokens.css stays unlayered: it only defines custom properties.
import path from 'path';

export const LAYER_NAMES = 'nwl.base, nwl.widgets, nwl.components';
// the order statement, declared once at the top of each built stylesheet
export const LAYER_ORDER = `@layer ${LAYER_NAMES};`;

const styles = path.resolve(__dirname, '../src/styles');
const layerOf = (file) => {
  if (file === path.join(styles, 'tokens.css')) { return null; }
  if (file === path.join(styles, 'base.css')) { return 'nwl.base'; }
  if (file === path.join(styles, 'widgets.css')) { return 'nwl.widgets'; }

  return 'nwl.components';
};

// PostCSS plugin: wraps each stylesheet in its layer, after the order statement (so the order
// also holds in the Storybook dev server, where each module is its own <style>)
export const cssLayers = () => ({
  postcssPlugin: 'nwl-css-layers',
  Once (root, { AtRule, result }) {
    const from = (root.source && root.source.input.file) || result.opts.from || '';
    const layer = layerOf(from.split('?')[0]);
    if (layer === null || root.nodes.length === 0) { return; }
    const block = new AtRule({ name: 'layer', params: layer });
    block.append(root.nodes);
    root.append(new AtRule({ name: 'layer', params: LAYER_NAMES }), block);
  }
});
cssLayers.postcss = true;

// the order statement is repeated in every stylesheet's output; keep one, at the top
const statement = new RegExp('@layer\\s*nwl\\.base\\s*,\\s*nwl\\.widgets\\s*,\\s*nwl\\.components\\s*;\\s*', 'gu');
export const orderOnce = (css) => `${LAYER_ORDER}\n${css.replace(statement, '')}`;

// a plain stylesheet (not processed by PostCSS) in one layer
export const inLayer = (layer, css) => `@layer ${layer} {\n${css}}\n`;
