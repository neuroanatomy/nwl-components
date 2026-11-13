import { expect } from '@storybook/test';

import { loadFonts, setTheme } from '../../.storybook/theme.js';

import tokensCss from '@/styles/tokens.css?raw';

// The 2027 theme (2.4.0, decisions U11–U17): every tier 2 token in both themes side by side, the
// contrast of the text/background pairs computed in the page, and the type scale in the three
// fonts. The play tests read getComputedStyle (no screenshots): the 2027 contrasts, today's
// values unchanged without the attribute, and the self-hosted fonts loaded.
// The toolbar's "Theme" switch (.storybook/preview.js) shows every other story in either theme.
export default {
  title: 'Styles/Theme 2027'
};

const html = document.documentElement;
const block = (selector) => tokensCss.match(new RegExp(`${selector}\\s*\\{([^}]*)\\}`, 'u'))[1];
const names = (text) => [...text.matchAll(/(--nwl-[\w-]+)\s*:/gu)].map((m) => m[1]);
// tier 2 (the second `:root` block), then the tokens only the theme defines (the shadows)
const todayNames = names([...tokensCss.matchAll(/:root\s*\{([^}]*)\}/gu)][1][1]);
const themeNames = names(block(':root\\[data-nwl-theme="2027"\\]'));
const tier2 = [...todayNames, ...themeNames.filter((name) => !todayNames.includes(name))];

// a token's value in a theme: the attribute is switched for the reading only (styles are
// recomputed synchronously), then put back
const readTokens = (theme) => {
  const before = html.getAttribute('data-nwl-theme');
  if (theme === '2027') { html.setAttribute('data-nwl-theme', '2027'); } else { html.removeAttribute('data-nwl-theme'); }
  const style = getComputedStyle(html);
  const values = Object.fromEntries(tier2.map((name) => [name, style.getPropertyValue(name).trim()]));
  if (before === null) { html.removeAttribute('data-nwl-theme'); } else { html.setAttribute('data-nwl-theme', before); }

  return values;
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
const ratios = (theme, pairs) => {
  const before = html.getAttribute('data-nwl-theme');
  if (theme === '2027') { html.setAttribute('data-nwl-theme', '2027'); } else { html.removeAttribute('data-nwl-theme'); }
  const result = pairs.map(([fg, bg, min]) => ({ fg, bg, min, ratio: contrast(colourOf(fg), colourOf(bg)) }));
  if (before === null) { html.removeAttribute('data-nwl-theme'); } else { html.setAttribute('data-nwl-theme', before); }

  return result;
};

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
    const today = readTokens('today');
    const theme = readTokens('2027');
    const tokenRows = tier2.map((name) => `
      <tr data-token="${name}">
        <td><code>${name}</code>${today[name] === theme[name] ? '' : ' <small>(changed)</small>'}</td>${cell(name, today[name])}${cell(name, theme[name])}
      </tr>`).join('');
    const [todayRatios, themeRatios] = [ratios('today', shownPairs), ratios('2027', shownPairs)];
    const pairRows = shownPairs.map(([fg, bg, min], i) => `
      <tr data-pair="${fg} on ${bg}">
        <td><code>${fg}</code> on <code>${bg}</code></td>
        <td>${todayRatios[i].ratio.toFixed(2)}</td>
        <td class="${themeRatios[i].ratio >= min ? 'pass' : 'fail'}">${themeRatios[i].ratio.toFixed(2)}</td>
        <td>${min}</td>
      </tr>`).join('');

    return { tokenRows, pairRows };
  },
  template: `
  <main class="theme-2027-story">
    <p>Opt in with <code>&lt;html data-nwl-theme="2027"&gt;</code> and a <code>&lt;link&gt;</code> to
      <code>nwl-components/fonts.css</code>. Without the attribute every token keeps today's value.
      Tokens that change are marked (changed).</p>
    <h2>Contrast (WCAG 2), computed in the page</h2>
    <table>
      <thead><tr><th>Pair</th><th>Today</th><th>2027</th><th>Minimum</th></tr></thead>
      <tbody v-html="pairRows"></tbody>
    </table>
    <h2>Tier 2 tokens</h2>
    <table>
      <thead><tr><th>Token</th><th>Today</th><th>2027</th></tr></thead>
      <tbody v-html="tokenRows"></tbody>
    </table>
  </main>`
});
Swatches.play = async ({ canvasElement }) => {
  await expect(canvasElement.querySelectorAll('tr[data-token]').length).toBe(tier2.length);
  await expect(canvasElement.querySelectorAll('tr[data-pair]').length).toBe(shownPairs.length);
};

// The 2027 contrasts, with the theme set on the story's <html>: each pair from getComputedStyle.
export const Contrast = () => ({
  template: '<main><p>Contrast of the 2027 text/background, border, focus and link pairs (play test).</p></main>'
});
Contrast.play = async ({ globals }) => {
  await setTheme('2027');
  try {
    await expect(html.getAttribute('data-nwl-theme')).toBe('2027');
    // no accent: focus and links are the text colour, as today
    await expect(['--nwl-focus', '--nwl-link', '--nwl-link-hover'].map(colourOf))
      .toEqual(Array(3).fill(colourOf('--nwl-text')));
    const failures = testedPairs.map(([fg, bg, min]) => ({ fg, bg, min, ratio: contrast(colourOf(fg), colourOf(bg)) }))
      .filter(({ ratio, min }) => ratio < min)
      .map(({ fg, bg, min, ratio }) => `${fg} on ${bg}: ${ratio.toFixed(2)} < ${min}`);
    await expect(failures.join('; ')).toBe('');
  } finally {
    await setTheme(globals.theme);
  }
};

// Without the attribute, every tier 2 token computes to its 2.3.0 value, and the theme's own
// tokens (the shadows) are not defined.
const values230 = [
  ['--nwl-bg-canvas', '#000'],
  ['--nwl-bg-nav', '#111'],
  ['--nwl-bg', '#222'],
  ['--nwl-bg-surface', '#333'],
  ['--nwl-bg-elevated', '#444'],
  ['--nwl-bg-pressed', '#555'],
  ['--nwl-bg-input', 'transparent'],
  ['--nwl-bg-overlay', 'rgba(0, 0, 0, 0.7)'],
  ['--nwl-border-subtle', '#555'],
  ['--nwl-border', '#777'],
  ['--nwl-border-strong', '#ddd'],
  ['--nwl-text', '#fff'],
  ['--nwl-text-2', 'rgba(255, 255, 255, 0.75)'],
  ['--nwl-text-3', 'rgba(255, 255, 255, 0.4)'],
  ['--nwl-text-placeholder', '#ccc'],
  ['--nwl-text-inverse', '#000'],
  ['--nwl-text-button', '#ddd'],
  ['--nwl-accent', '#57d1df'],
  ['--nwl-accent-dim', 'rgba(87, 209, 223, 0.5)'],
  ['--nwl-accent-subtle', 'rgba(87, 209, 223, 0.15)'],
  ['--nwl-accent-fg', '#57d1df'],
  ['--nwl-focus', '#fff'],
  ['--nwl-link', '#fff'],
  ['--nwl-link-hover', '#fff'],
  ['--nwl-danger', '#c55'],
  ['--nwl-success', '#8d8'],
  ['--nwl-warning', '#fc6'],
  ['--nwl-font-display', 'Roboto, sans-serif'],
  ['--nwl-font-body', '"Lucida Grande", "Lucida Sans Unicode", Helvetica, Arial, Verdana, sans-serif'],
  ['--nwl-font-mono', 'ui-monospace, Menlo, Consolas, monospace'],
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
  ['--nwl-shadow-sm', '2px 2px 5px #808080'],
  ['--nwl-shadow-md', '0 4px 12px rgba(0, 0, 0, 0.7)']
];
export const DefaultUnchanged = () => ({
  template: '<main><p>Without <code>data-nwl-theme</code>, every tier 2 token keeps its 2.3.0 value (play test).</p></main>'
});
DefaultUnchanged.play = async ({ globals }) => {
  await setTheme('today');
  try {
    await expect(html.hasAttribute('data-nwl-theme')).toBe(false);
    // the table covers every tier 2 token of today
    await expect(values230.map(([name]) => name)).toEqual(todayNames);
    // the static Storybook's minifier writes 0.7 as .7: compare without leading zeros
    const same = (value) => value.trim().replace(/(^|[\s(,])0\./gu, '$1.');
    const style = getComputedStyle(html);
    const diff = values230.filter(([name, value]) => same(style.getPropertyValue(name)) !== same(value))
      .map(([name, value]) => `${name}: ${style.getPropertyValue(name).trim()} (expected ${value})`);
    await expect(diff.join('; ')).toBe('');
    await expect(['--nwl-shadow-1', '--nwl-shadow-2'].map((name) => style.getPropertyValue(name))).toEqual(['', '']);
  } finally {
    await setTheme(globals.theme);
  }
};

// The type scale in the three fonts of the 2027 theme (fonts.css is linked for this story).
const sizes = ['--nwl-text-xs', '--nwl-text-sm', '--nwl-text-base', '--nwl-text-md', '--nwl-text-lg', '--nwl-text-xl', '--nwl-text-2xl', '--nwl-text-3xl', '--nwl-text-hero'];
export const TypeScale = () => ({
  setup () {
    loadFonts().catch((error) => console.error(error));
    const theme = readTokens('2027');
    const fonts = [
      ['body', theme['--nwl-font-body'], 'var(--nwl-weight-regular)', 'Brain atlas: 80 regions, axolotl'],
      ['body semibold', theme['--nwl-font-body'], 'var(--nwl-weight-semibold)', 'Project settings'],
      ['body italic', theme['--nwl-font-body'], 'var(--nwl-weight-regular); font-style: italic', 'no annotations yet'],
      ['mono', theme['--nwl-font-mono'], 'var(--nwl-weight-regular)', 'sub-01_T1w.nii.gz 128,96,64'],
      ['display', theme['--nwl-font-display'], 'var(--nwl-weight-thin)', 'BrainBox']
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

// Form controls: today they keep the browser's font family (not the body's); under the 2027
// theme they inherit the body's (Source Sans 3).
export const Controls = () => ({
  template: `
  <main>
    <p>Text <button>Button</button> <input value="input"> <select><option>select</option></select>
      <textarea>textarea</textarea></p>
  </main>`
});
Controls.play = async ({ canvasElement, globals }) => {
  const app = canvasElement.querySelector('.app') || canvasElement.closest('.app');
  const controls = [...canvasElement.querySelectorAll('button, input, select, textarea')];
  const fonts = () => controls.map((el) => getComputedStyle(el).fontFamily);
  try {
    await setTheme('today');
    const body = getComputedStyle(app).fontFamily;
    await expect(fonts().filter((font) => font === body)).toEqual([]);
    await setTheme('2027');
    const body2027 = getComputedStyle(app).fontFamily;
    await expect(body2027).toMatch(/^"Source Sans 3"/u);
    await expect(fonts().filter((font) => font !== body2027)).toEqual([]);
  } finally {
    await setTheme(globals.theme);
  }
};

// The fonts: with fonts.css and the theme on, Source Sans 3 and IBM Plex Mono are loaded, from
// fonts/ next to the page (dist/fonts in the library), never from a third party.
export const Fonts = () => ({
  template: `
  <main>
    <p style="font-family: var(--nwl-font-body)">Source Sans 3, <b>semibold</b>, <i>italic</i></p>
    <p style="font-family: var(--nwl-font-mono)">IBM Plex Mono 0123456789</p>
  </main>`
});
Fonts.play = async ({ canvasElement, globals }) => {
  await setTheme('2027');
  try {
    // layout with the theme's fonts starts their download; fonts.ready waits for it
    canvasElement.getBoundingClientRect();
    await document.fonts.ready;
    await expect(document.fonts.check('14px "Source Sans 3"')).toBe(true);
    await expect(document.fonts.check('14px "IBM Plex Mono"')).toBe(true);
    // check() is also true for a family with no @font-face: the faces must be there, loaded
    const loaded = [...document.fonts].filter((face) => face.status === 'loaded')
      .map((face) => face.family.replace(/"/gu, ''));
    await expect(loaded).toEqual(expect.arrayContaining(['Source Sans 3', 'IBM Plex Mono']));
    // from fonts/ beside the page, on the page's own origin
    const fontUrls = performance.getEntriesByType('resource').map((entry) => entry.name)
      .filter((url) => (/\.woff2?(?:\?|$)/u).test(url));
    const base = new URL('fonts/', document.baseURI).href;
    await expect(fontUrls.filter((url) => new URL(url).origin !== location.origin)).toEqual([]);
    await expect(fontUrls).toEqual(expect.arrayContaining([
      `${base}source-sans-3-latin-400-normal.woff2`,
      `${base}ibm-plex-mono-latin-400-normal.woff2`
    ]));
  } finally {
    await setTheme(globals.theme);
  }
};
