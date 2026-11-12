import { expect } from '@storybook/test';

import tokensCss from '@/styles/tokens.css?raw';

// Every design token of src/styles/tokens.css (`nwl-components/tokens.css`), with a swatch or a
// sample, read from the file itself so the page never misses one.
export default {
  title: 'Library/Tokens'
};

// the file's two `:root` blocks: tier 1 (raw palette), tier 2 (semantic tokens)
const [rawBlock, semanticBlock] = [...tokensCss.matchAll(/:root\s*\{([^}]*)\}/gu)].map((m) => m[1]);
const names = (block) => [...block.matchAll(/(--nwl-[\w-]+)\s*:/gu)].map((m) => m[1]);
const rawNames = names(rawBlock);
const semanticNames = names(semanticBlock);
const value = (name) => getComputedStyle(document.documentElement).getPropertyValue(name)
  .trim();

const kind = (name) => {
  if ((/^--nwl-(?:font|sans|mono)/u).test(name)) { return 'font'; }
  if ((/^--nwl-text-(?:xs|sm|base|md|lg|x?\dxl|xl|hero)$/u).test(name)) { return 'size'; }
  if ((/^--nwl-weight/u).test(name)) { return 'weight'; }
  if ((/^--nwl-leading/u).test(name)) { return 'leading'; }
  if ((/^--nwl-space/u).test(name)) { return 'space'; }
  if ((/^--nwl-radius/u).test(name)) { return 'radius'; }
  if ((/^--nwl-shadow/u).test(name)) { return 'shadow'; }

  return 'colour';
};

const sample = (name) => {
  const v = `var(${name})`;
  switch (kind(name)) {
  case 'font': return `<span style="font-family: ${v}">Brain atlas 0123</span>`;
  case 'size': return `<span style="font-size: ${v}">Brain atlas</span>`;
  case 'weight': return `<span style="font-weight: ${v}">Brain atlas</span>`;
  case 'leading': return `<span style="display: inline-block; width: 8em; line-height: ${v}">Brain atlas, two lines of text</span>`;
  case 'space': return `<span style="display: inline-block; height: 10px; width: ${v}; background: var(--nwl-text)"></span>`;
  case 'radius': return `<span style="display: inline-block; width: 24px; height: 24px; border: 1px solid var(--nwl-text); border-radius: ${v}"></span>`;
  case 'shadow': return `<span style="display: inline-block; width: 40px; height: 24px; background: var(--nwl-bg-surface); box-shadow: ${v}"></span>`;
  default: return `<span style="display: inline-block; width: 40px; height: 24px; border: 1px solid var(--nwl-border); background: ${v}"></span>`;
  }
};

const rows = (list) => list.map((name) => `
  <tr data-token="${name}">
    <td><code>${name}</code></td>
    <td><code class="token-value">${value(name)}</code></td>
    <td>${sample(name)}</td>
  </tr>`).join('');

const table = (title, list) => `
  <h2>${title} (${list.length})</h2>
  <table style="border-collapse: collapse; margin-bottom: 20px">
    <tbody>${rows(list)}</tbody>
  </table>`;

export const AllTokens = () => ({
  template: `
  <main>
    <p>Components and app CSS use the semantic tokens; the raw palette is the only place with hex values.</p>
    ${table('Semantic tokens', semanticNames)}
    ${table('Raw palette', rawNames)}
  </main>`
});
AllTokens.play = async ({ canvasElement }) => {
  await expect(semanticNames.length).toBeGreaterThan(50);
  // every semantic token is defined on the page (an undefined one is the empty string)
  await expect(semanticNames.filter((name) => value(name) === '')).toEqual([]);
  await expect(rawNames.filter((name) => value(name) === '')).toEqual([]);
  // semantic tokens refer to the raw palette: no hex value of their own
  await expect(semanticBlock).not.toMatch(/#[0-9a-f]{3,8}\b/iu);
  // the page lists every token
  await expect(canvasElement.querySelectorAll('tr[data-token]').length).toBe(semanticNames.length + rawNames.length);
};
