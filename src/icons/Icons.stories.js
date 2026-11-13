import { expect } from '@storybook/test';

import map from './README.md?raw';

// Every icon in src/icons/ (copied to dist/icons/), with its name, on the app background
// (--nwl-bg). The play test checks the set against the map in src/icons/README.md: one file per
// row, every image loads, no name twice.
const icons = Object.entries(import.meta.glob('./*.svg', { eager: true, import: 'default' }))
  .map(([file, src]) => ({ name: file.slice(2, -4), src }))
  .sort((a, b) => a.name.localeCompare(b.name));

// the map's rows: lines that start with "| `name`"
const mapNames = map.split('\n')
  .map((line) => line.match(/^\| `([^`]+)` \|/))
  .filter(Boolean)
  .map((m) => m[1]);

export default {
  title: 'Icons'
};

export const All = () => ({
  setup () {
    return { icons };
  },
  template: `<div class="icons-story" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 8px; padding: 12px; background: var(--nwl-bg)">
    <figure v-for="icon in icons" :key="icon.name" style="display: flex; flex-direction: column; align-items: center; gap: 6px; margin: 0">
      <img :src="icon.src" :alt="icon.name" style="width: 24px; height: 24px" />
      <figcaption style="font-size: 12px; color: var(--nwl-text); overflow-wrap: anywhere; text-align: center">{{ icon.name }}</figcaption>
    </figure>
  </div>`
});
All.play = async ({ canvasElement }) => {
  const imgs = [...canvasElement.querySelectorAll('.icons-story img')];
  const names = [...canvasElement.querySelectorAll('.icons-story figcaption')].map((el) => el.textContent.trim());
  // as many icons as rows in the map, and the same names
  await expect(imgs.length).toBe(mapNames.length);
  await expect([...names].sort()).toEqual([...mapNames].sort());
  // every name once
  await expect(new Set(names).size).toBe(names.length);
  // every image loaded and has a size
  await Promise.all(imgs.map((img) => (img.complete
    ? null
    : new Promise((resolve) => {
      img.addEventListener('load', resolve);
      img.addEventListener('error', resolve);
    }))));
  const broken = imgs.filter((img) => !(img.naturalWidth > 0)).map((img) => img.alt);
  await expect(broken).toEqual([]);
};
