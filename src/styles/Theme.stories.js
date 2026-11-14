import { expect } from '@storybook/test';

import TwoCols from '@/components/layout/TwoCols.vue';
import tokensCss from '@/styles/tokens.css?raw';

// The look of the kit (3.0.0; first shipped in 2.4 as the opt-in 2027 theme, decisions U11–U17):
// every tier 2 token with its value, the contrast of the text/background pairs computed in the
// page, and the type scale in the three fonts. The play tests read getComputedStyle (no
// screenshots): the contrasts, the 3.0.0 values, and the self-hosted fonts loaded. The preview
// links fonts.css (.storybook/preview-head.html), as every page using the kit does.
export default {
  title: 'Styles/Theme'
};

const html = document.documentElement;
const names = (text) => [...text.matchAll(/(--nwl-[\w-]+)\s*:/gu)].map((m) => m[1]);
// tier 2: the second `:root` block
const tier2 = names([...tokensCss.matchAll(/:root\s*\{([^}]*)\}/gu)][1][1]);

// every tier 2 token's computed value
const readTokens = () => {
  const style = getComputedStyle(html);

  return Object.fromEntries(tier2.map((name) => [name, style.getPropertyValue(name).trim()]));
};

// WCAG 2 contrast. Colours come from getComputedStyle (rgb or rgba); a translucent foreground is
// composited over its background first.
const rgba = (css) => {
  const [r, g, b, a = 1] = css.match(/[\d.]+/gu).map(Number);

  return { r, g, b, a };
};
const over = (fg, bg) => ({
  r: fg.r * fg.a + bg.r * (1 - fg.a),
  g: fg.g * fg.a + bg.g * (1 - fg.a),
  b: fg.b * fg.a + bg.b * (1 - fg.a)
});
const luminance = ({ r, g, b }) => {
  const [lr, lg, lb] = [r, g, b].map((c) => {
    const s = c / 255;

    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
};
const contrast = (fgCss, bgCss) => {
  const bg = rgba(bgCss);
  const [l1, l2] = [luminance(over(rgba(fgCss), bg)), luminance(bg)].sort((x, y) => y - x);

  return (l1 + 0.05) / (l2 + 0.05);
};

// the computed colour of `var(token)`, through a probe element in the page
const colourOf = (token) => {
  const probe = document.createElement('span');
  probe.style.color = `var(${token})`;
  document.body.appendChild(probe);
  const colour = getComputedStyle(probe).color;
  probe.remove();

  return colour;
};

// the pairs the tests hold to WCAG AA: text 4.5:1, controls and focus 3:1 (1.4.3, 1.4.11)
const texts = ['--nwl-text', '--nwl-text-2', '--nwl-text-3', '--nwl-text-placeholder'];
const backgrounds = ['--nwl-bg', '--nwl-bg-surface', '--nwl-bg-elevated'];
const testedPairs = [
  ...texts.flatMap((fg) => backgrounds.map((bg) => [fg, bg, 4.5])),
  ...['--nwl-bg', '--nwl-bg-surface'].map((bg) => ['--nwl-border', bg, 3]),
  // focus and links are the text colour (no accent, U12 revised)
  ...['--nwl-bg', '--nwl-bg-surface'].map((bg) => ['--nwl-focus', bg, 3]),
  ...['--nwl-bg', '--nwl-bg-surface'].map((bg) => ['--nwl-link', bg, 4.5])
];
// shown on the page only
const shownPairs = [
  ...testedPairs,
  ...backgrounds.map((bg) => ['--nwl-text-button', bg, 4.5]),
  ['--nwl-border', '--nwl-bg-elevated', 3],
  ['--nwl-link-hover', '--nwl-bg', 4.5]
];
const ratios = (pairs) => pairs.map(([fg, bg, min]) => ({ fg, bg, min, ratio: contrast(colourOf(fg), colourOf(bg)) }));

const isColour = (name, value) => value !== '' && !(/^--nwl-(?:font|shadow)/u).test(name) && CSS.supports('color', value);
const cell = (name, value) => {
  if (value === '') { return '<td class="value"><em>not defined</em></td>'; }
  let sample = '';
  if (isColour(name, value)) {
    sample = `<span style="display: inline-block; width: 40px; height: 20px; vertical-align: middle; margin-right: 8px; border: 1px solid var(--nwl-border); background: ${value}"></span>`;
  } else if ((/^--nwl-font/u).test(name)) {
    sample = `<span style="font-family: ${value.replace(/"/gu, '&quot;')}; margin-right: 8px">Brain atlas 0123</span>`;
  } else if ((/^--nwl-shadow/u).test(name)) {
    sample = `<span style="display: inline-block; width: 40px; height: 20px; vertical-align: middle; margin-right: 8px; background: var(--nwl-bg-surface); box-shadow: ${value}"></span>`;
  }

  return `<td class="value">${sample}<code>${value.replace(/</gu, '&lt;')}</code></td>`;
};

export const Swatches = () => ({
  setup () {
    const values = readTokens();
    const tokenRows = tier2.map((name) => `
      <tr data-token="${name}">
        <td><code>${name}</code></td>${cell(name, values[name])}
      </tr>`).join('');
    const pairRows = ratios(shownPairs)
      .map(({ fg, bg, min, ratio }) => `
      <tr data-pair="${fg} on ${bg}">
        <td><code>${fg}</code> on <code>${bg}</code></td>
        <td class="${ratio >= min ? 'pass' : 'fail'}">${ratio.toFixed(2)}</td>
        <td>${min}</td>
      </tr>`)
      .join('');

    return { tokenRows, pairRows };
  },
  template: `
  <main class="theme-story">
    <p>The tokens of <code>nwl-components/tokens.css</code>. Every page using the kit also links
      <code>nwl-components/fonts.css</code>.</p>
    <h2>Contrast (WCAG 2), computed in the page</h2>
    <table>
      <thead><tr><th>Pair</th><th>Ratio</th><th>Minimum</th></tr></thead>
      <tbody v-html="pairRows"></tbody>
    </table>
    <h2>Tier 2 tokens</h2>
    <table>
      <thead><tr><th>Token</th><th>Value</th></tr></thead>
      <tbody v-html="tokenRows"></tbody>
    </table>
  </main>`
});
Swatches.play = async ({ canvasElement }) => {
  await expect(canvasElement.querySelectorAll('tr[data-token]').length).toBe(tier2.length);
  await expect(canvasElement.querySelectorAll('tr[data-pair]').length).toBe(shownPairs.length);
};

// The contrasts: each pair from getComputedStyle.
export const Contrast = () => ({
  template: '<main><p>Contrast of the text/background, border, focus and link pairs (play test).</p></main>'
});
Contrast.play = async () => {
  // no accent: focus and links are the text colour
  await expect(['--nwl-focus', '--nwl-link', '--nwl-link-hover'].map(colourOf))
    .toEqual(Array(3).fill(colourOf('--nwl-text')));
  const failures = ratios(testedPairs)
    .filter(({ ratio, min }) => ratio < min)
    .map(({ fg, bg, min, ratio }) => `${fg} on ${bg}: ${ratio.toFixed(2)} < ${min}`);
  await expect(failures.join('; ')).toBe('');
};

// Every tier 2 token computes to its 3.0.0 value. `data-nwl-theme`, the opt-in of 2.4, does
// nothing any more: with it on <html> every token keeps the same value.
const values300 = [
  ['--nwl-bg-canvas', '#000'],
  ['--nwl-bg-nav', '#111'],
  ['--nwl-bg', '#1a1a1a'],
  ['--nwl-bg-surface', '#252525'],
  ['--nwl-bg-elevated', '#2e2e2e'],
  ['--nwl-bg-pressed', '#404040'],
  ['--nwl-bg-input', 'transparent'],
  ['--nwl-bg-overlay', 'rgba(0, 0, 0, 0.7)'],
  ['--nwl-border-subtle', '#383838'],
  ['--nwl-border', '#777'],
  ['--nwl-border-strong', '#999'],
  ['--nwl-text', '#e8e8e8'],
  ['--nwl-text-2', '#c0c0c0'],
  ['--nwl-text-3', '#999'],
  ['--nwl-text-placeholder', '#999'],
  ['--nwl-text-inverse', '#000'],
  ['--nwl-text-button', '#ddd'],
  ['--nwl-accent', '#57d1df'],
  ['--nwl-accent-dim', 'rgba(87, 209, 223, 0.5)'],
  ['--nwl-accent-subtle', 'rgba(87, 209, 223, 0.15)'],
  ['--nwl-accent-fg', '#57d1df'],
  ['--nwl-focus', '#e8e8e8'],
  ['--nwl-link', '#e8e8e8'],
  ['--nwl-link-hover', '#e8e8e8'],
  ['--nwl-danger', '#c55'],
  ['--nwl-success', '#8d8'],
  ['--nwl-warning', '#fc6'],
  ['--nwl-font-display', 'Roboto, sans-serif'],
  ['--nwl-font-body', '"Source Sans 3", "Lucida Grande", "Lucida Sans Unicode", Helvetica, Arial, Verdana, sans-serif'],
  ['--nwl-font-mono', '"IBM Plex Mono", ui-monospace, Menlo, Consolas, monospace'],
  ['--nwl-text-xs', '11px'],
  ['--nwl-text-sm', '12px'],
  ['--nwl-text-base', '13px'],
  ['--nwl-text-md', '14px'],
  ['--nwl-text-lg', '16px'],
  ['--nwl-text-xl', '22px'],
  ['--nwl-text-2xl', '28px'],
  ['--nwl-text-3xl', '36px'],
  ['--nwl-text-hero', '60px'],
  ['--nwl-weight-thin', '100'],
  ['--nwl-weight-light', '300'],
  ['--nwl-weight-regular', '400'],
  ['--nwl-weight-medium', '500'],
  ['--nwl-weight-semibold', '600'],
  ['--nwl-weight-bold', '700'],
  ['--nwl-leading-tight', '1.2'],
  ['--nwl-leading-snug', '1.35'],
  ['--nwl-leading-normal', '1.5'],
  ['--nwl-leading-relaxed', '1.65'],
  ['--nwl-space-1', '4px'],
  ['--nwl-space-2', '8px'],
  ['--nwl-space-3', '12px'],
  ['--nwl-space-4', '16px'],
  ['--nwl-space-5', '20px'],
  ['--nwl-space-6', '24px'],
  ['--nwl-space-8', '32px'],
  ['--nwl-space-10', '40px'],
  ['--nwl-space-12', '48px'],
  ['--nwl-space-16', '64px'],
  ['--nwl-radius-sm', '3px'],
  ['--nwl-radius-md', '6px'],
  ['--nwl-radius-round', '50%'],
  ['--nwl-shadow-1', '0 2px 8px rgba(0, 0, 0, 0.4)'],
  ['--nwl-shadow-2', '0 8px 24px rgba(0, 0, 0, 0.5)'],
  ['--nwl-shadow-sm', '2px 2px 5px #808080'],
  ['--nwl-content-max', '800px'],
  ['--nwl-container-max', '1020px']
];
export const Defaults = () => ({
  setup () {
    const rows = values300
      .map(([name, value]) => `<tr><td><code>${name}</code></td><td><code>${value.replace(/</gu, '&lt;')}</code></td></tr>`)
      .join('');

    return { rows };
  },
  template: `
  <main>
    <p>The tier 2 values of 3.0.0 (play test). <code>data-nwl-theme</code> changes none of them.</p>
    <table><tbody v-html="rows"></tbody></table>
  </main>`
});
Defaults.play = async () => {
  // the table covers every tier 2 token
  await expect(values300.map(([name]) => name)).toEqual(tier2);
  // the static Storybook's minifier writes 0.7 as .7: compare without leading zeros
  const same = (value) => value.trim().replace(/(^|[\s(,])0\./gu, '$1.');
  const diff = () => {
    const style = getComputedStyle(html);

    return values300.filter(([name, value]) => same(style.getPropertyValue(name)) !== same(value))
      .map(([name, value]) => `${name}: ${style.getPropertyValue(name).trim()} (expected ${value})`)
      .join('; ');
  };
  await expect(diff()).toBe('');
  const before = html.getAttribute('data-nwl-theme');
  html.setAttribute('data-nwl-theme', '2027');
  try {
    await expect(diff()).toBe('');
  } finally {
    if (before === null) { html.removeAttribute('data-nwl-theme'); } else { html.setAttribute('data-nwl-theme', before); }
  }
};

// The type scale in the kit's three fonts.
const sizes = ['--nwl-text-xs', '--nwl-text-sm', '--nwl-text-base', '--nwl-text-md', '--nwl-text-lg', '--nwl-text-xl', '--nwl-text-2xl', '--nwl-text-3xl', '--nwl-text-hero'];
export const TypeScale = () => ({
  setup () {
    const values = readTokens();
    const fonts = [
      ['body', values['--nwl-font-body'], 'var(--nwl-weight-regular)', 'Brain atlas: 80 regions, axolotl'],
      ['body semibold', values['--nwl-font-body'], 'var(--nwl-weight-semibold)', 'Project settings'],
      ['body italic', values['--nwl-font-body'], 'var(--nwl-weight-regular); font-style: italic', 'no annotations yet'],
      ['mono', values['--nwl-font-mono'], 'var(--nwl-weight-regular)', 'sub-01_T1w.nii.gz 128,96,64'],
      ['display', values['--nwl-font-display'], 'var(--nwl-weight-thin)', 'BrainBox']
    ];
    const rows = sizes.map((size) => fonts.map(([label, family, weight, text]) => `
      <tr><td><code>${size}</code> ${label}</td>
        <td style="font-family: ${family.replace(/"/gu, '&quot;')}; font-size: var(${size}); font-weight: ${weight}">${text}</td></tr>`).join('')).join('');

    return { rows };
  },
  template: `
  <main>
    <p>Source Sans 3 (body), IBM Plex Mono (data) and Roboto 100 (the wordmark), self-hosted by
      <code>nwl-components/fonts.css</code>. The body text stays 14px (<code>--nwl-text-md</code>).</p>
    <table><tbody v-html="rows"></tbody></table>
  </main>`
});

// Form controls inherit the body's font family (Source Sans 3), as everything else in the app.
export const Controls = () => ({
  template: `
  <main>
    <p>Text <button>Button</button> <input value="input"> <select><option>select</option></select>
      <textarea>textarea</textarea></p>
  </main>`
});
Controls.play = async ({ canvasElement }) => {
  const app = canvasElement.querySelector('.app') || canvasElement.closest('.app');
  const controls = [...canvasElement.querySelectorAll('button, input, select, textarea')];
  const body = getComputedStyle(app).fontFamily;
  await expect(body).toMatch(/^"Source Sans 3"/u);
  await expect(controls.map((el) => getComputedStyle(el).fontFamily).filter((font) => font !== body)).toEqual([]);
};

// The fonts: with fonts.css linked, Source Sans 3 and IBM Plex Mono are loaded, from
// fonts/ next to the page (dist/fonts in the library), never from a third party.
export const Fonts = () => ({
  template: `
  <main>
    <p style="font-family: var(--nwl-font-body)">Source Sans 3, <b>semibold</b>, <i>italic</i></p>
    <p style="font-family: var(--nwl-font-mono)">IBM Plex Mono 0123456789</p>
  </main>`
});
Fonts.play = async ({ canvasElement }) => {
  // layout with the kit's fonts starts their download; fonts.ready waits for it
  canvasElement.getBoundingClientRect();
  await document.fonts.ready;
  await expect(document.fonts.check('14px "Source Sans 3"')).toBe(true);
  await expect(document.fonts.check('14px "IBM Plex Mono"')).toBe(true);
  // check() is also true for a family with no @font-face: the faces must be there, loaded
  const loaded = [...document.fonts].filter((face) => face.status === 'loaded')
    .map((face) => face.family.replace(/"/gu, ''));
  await expect(loaded).toEqual(expect.arrayContaining(['Source Sans 3', 'IBM Plex Mono']));
  // Source Sans 3 sits its letters where Lucida Grande did in a centred line (2.4.2): every
  // face has the ascent and descent overrides of fonts.css
  const sourceSans = [...document.fonts].filter((face) => face.family.replace(/"/gu, '') === 'Source Sans 3');
  await expect(sourceSans.map((face) => [face.ascentOverride, face.descentOverride]))
    .toEqual([['109%', '33.4%'], ['109%', '33.4%'], ['109%', '33.4%']]);
  // from fonts/ beside the page, on the page's own origin
  const fontUrls = performance.getEntriesByType('resource').map((entry) => entry.name)
    .filter((url) => (/\.woff2?(?:\?|$)/u).test(url));
  const base = new URL('fonts/', document.baseURI).href;
  await expect(fontUrls.filter((url) => new URL(url).origin !== location.origin)).toEqual([]);
  await expect(fontUrls).toEqual(expect.arrayContaining([
    `${base}source-sans-3-latin-400-normal.woff2`,
    `${base}ibm-plex-mono-latin-400-normal.woff2`
  ]));
};

// TwoCols' widths on a wide screen (1023px and up): the content column is 800px, in a 1020px
// container (684 and 984px before 3.0.0). A long paragraph fills the column, so its rendered
// width is the maximum.
export const Widths = () => ({
  components: { TwoCols },
  template: `
  <TwoCols>
    <template #side><p>Side</p></template>
    <template #content><p>${'Content that fills the column. '.repeat(60)}</p></template>
  </TwoCols>`
});
Widths.parameters = { viewport: { defaultViewport: 'responsive' } };
Widths.play = async ({ canvasElement }) => {
  const content = canvasElement.querySelector('.content');
  const container = canvasElement.querySelector('.container');
  // the widths apply from 1023px; a narrower preview has nothing to check
  if (window.innerWidth < 1080) { return; }
  await expect([content.getBoundingClientRect().width, container.getBoundingClientRect().width]).toEqual([800, 1020]);
};
