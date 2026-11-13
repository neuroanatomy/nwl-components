import { expect, userEvent, waitFor } from '@storybook/test';
import { computed, ref, watch } from 'vue';

import { icons, rows } from './map.js';

// Every icon in src/icons/ (copied to dist/icons/), with its name, on the app background
// (--nwl-bg). The play test checks the set against the map in src/icons/README.md: one file per
// row, every image loads, no name twice.
const mapNames = rows.map((row) => row.name);

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

// Finder: search the icons by name, meaning or the file names they replaced in the apps; pick
// one to see it large and copy its path. Local only (`npm run storybook`).
const byName = Object.fromEntries(rows.map((row) => [row.name, row]));
const finderIcons = icons.map((icon) => ({
  meaning: '', replaces: [], replacedNames: [], ...byName[icon.name], ...icon
}));

const matches = (icon, query) => [icon.name, icon.meaning, ...icon.replacedNames]
  .some((text) => text.toLowerCase().includes(query));

const pathsOf = (name) => [
  { path: `@/icons/${name}.svg`, where: 'Inside nwl-components: components and stories.' },
  {
    path: `~nwl-components/dist/icons/${name}.svg`,
    where: `BrainBox viewer HTML (webpack 4); in a JS import, without the ~: nwl-components/dist/icons/${name}.svg`
  },
  {
    path: `/lib/nwl-components/icons/${name}.svg`,
    where: 'Mustache, CSS and JS strings in BrainBox and microdraw (served by the app).'
  }
];

const finderCSS = `
.icon-finder { padding: 12px; background: var(--nwl-bg); color: var(--nwl-text); font-size: var(--nwl-text-base) }
.icon-finder p { margin: 0 0 8px; color: var(--nwl-text-2); max-width: 70ch }
.icon-finder-bar { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin: 12px 0 }
.icon-finder-bar fieldset { display: flex; align-items: center; gap: 4px; margin: 0; padding: 0; border: none }
.icon-finder-bar legend { float: left; margin-right: 4px; padding: 0 }
.icon-finder-bar .nwl-tool-button { width: auto; padding: 0 8px }
.icon-finder-search { display: flex; align-items: center; gap: 8px }
.icon-finder-search .nwl-text-field { padding: 4px 6px; width: 16em }
.icon-finder-main { display: flex; align-items: flex-start; gap: 12px }
.icon-finder-grid { flex: 1; display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 8px; padding: 8px; border-radius: var(--nwl-radius-md) }
.icon-finder-grid.light { background: var(--nwl-grey-cc); color: var(--nwl-text-inverse) }
.icon-finder-grid .nwl-icon-button { flex-direction: column; gap: 4px; padding: 6px; border-radius: var(--nwl-radius-sm); text-align: center; overflow-wrap: anywhere }
.icon-finder-grid .nwl-icon-button[aria-pressed="true"] { background: var(--nwl-accent-subtle); box-shadow: inset 0 0 0 1px var(--nwl-accent-dim) }
.icon-finder-grid.light .nwl-icon-button[aria-pressed="true"] { background: var(--nwl-grey-80) }
.icon-finder-name { font-size: var(--nwl-text-sm) }
.icon-finder-meaning { font-size: var(--nwl-text-xs); opacity: 0.75 }
.icon-finder-detail { position: sticky; top: 12px; width: 340px; padding: 12px; background: var(--nwl-bg-surface); border-radius: var(--nwl-radius-md) }
.icon-finder-detail h3 { margin: 0 0 4px; font-size: var(--nwl-text-lg) }
.icon-finder-preview { display: flex; gap: 8px; margin: 8px 0 }
.icon-finder-preview div { padding: 12px; border-radius: var(--nwl-radius-sm); background: var(--nwl-bg) }
.icon-finder-preview div.light { background: var(--nwl-grey-cc) }
.icon-finder-preview img { width: 96px; height: 96px; display: block }
.icon-finder-detail ul { margin: 4px 0 8px; padding-left: 18px; color: var(--nwl-text-2) }
.icon-finder-copy { margin: 8px 0 }
.icon-finder-copy div { display: flex; align-items: center; gap: 6px }
.icon-finder-copy code { flex: 1; font-family: var(--nwl-monospace); overflow-wrap: anywhere; user-select: all }
.icon-finder-copy small { display: block; color: var(--nwl-text-3) }
.icon-finder-copy .nwl-tool-button { width: 6em; flex: none }
`;

const addFinderCSS = () => {
  if (document.getElementById('icon-finder-css')) { return; }
  const style = document.createElement('style');
  style.id = 'icon-finder-css';
  style.textContent = finderCSS;
  document.head.appendChild(style);
};

export const Finder = () => ({
  setup () {
    addFinderCSS();
    const query = ref('');
    const size = ref(32);
    const light = ref(false);
    const selected = ref(null);
    const copied = ref(null);
    const shown = computed(() => {
      const q = query.value.trim().toLowerCase();

      return finderIcons.filter((icon) => matches(icon, q));
    });
    // the panel follows the results: the first match when the selected icon is filtered out,
    // no panel when nothing matches
    watch(shown, (list) => {
      if (selected.value && !list.includes(selected.value)) {
        selected.value = list[0] || null;
      }
    });
    const count = computed(() => `${shown.value.length} icon${shown.value.length === 1 ? '' : 's'}`);
    const paths = computed(() => (selected.value ? pathsOf(selected.value.name) : []));
    const copy = async (path, event) => {
      try {
        await navigator.clipboard.writeText(path);
        copied.value = path;
        setTimeout(() => { if (copied.value === path) { copied.value = null; } }, 1500);
      } catch (err) {
        // no clipboard API (or no permission): select the path, to copy by hand
        const code = event.currentTarget.parentElement.querySelector('code');
        const range = document.createRange();
        range.selectNodeContents(code);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      }
    };

    return { query, size, light, selected, copied, shown, count, paths, copy, sizes: [24, 32, 48] };
  },
  template: `<div class="icon-finder">
    <p>The icons are drawn in fixed white, for dark backgrounds (some have black cut-outs). Reuse
    one before adding a new one. To add one: put the file in <code>src/icons/</code> and a row in
    the map, <code>src/icons/README.md</code>; the <code>Icons/All</code> test enforces both.</p>
    <div class="icon-finder-bar">
      <fieldset>
        <legend>Size</legend>
        <button v-for="s in sizes" :key="s" type="button" class="nwl-tool-button" :aria-pressed="size === s" @click="size = s">{{ s }} px</button>
      </fieldset>
      <fieldset>
        <legend>Background</legend>
        <button type="button" class="nwl-tool-button" :aria-pressed="!light" @click="light = false">Dark</button>
        <button type="button" class="nwl-tool-button" :aria-pressed="light" @click="light = true">Light</button>
      </fieldset>
      <div class="icon-finder-search">
        <label for="icon-finder-query">Find an icon</label>
        <input id="icon-finder-query" v-model="query" type="search" class="nwl-text-field" placeholder="name, meaning or old file name" />
        <span class="icon-finder-count" aria-live="polite">{{ shown.length ? count : 'No icon matches' }}</span>
      </div>
    </div>
    <div class="icon-finder-main">
      <div class="icon-finder-grid" :class="{ light }">
        <button v-for="icon in shown" :key="icon.name" type="button" class="nwl-icon-button" :aria-pressed="selected === icon" @click="selected = icon">
          <img :src="icon.src" alt="" :style="{ width: size + 'px', height: size + 'px' }" />
          <span class="icon-finder-name">{{ icon.name }}</span>
          <span class="icon-finder-meaning">{{ icon.meaning }}</span>
        </button>
      </div>
      <section v-if="selected" class="icon-finder-detail" aria-label="Selected icon">
        <h3>{{ selected.name }}</h3>
        <div>{{ selected.meaning }}</div>
        <div class="icon-finder-preview">
          <div><img :src="selected.src" :alt="selected.name + ' on dark'" /></div>
          <div class="light"><img :src="selected.src" :alt="selected.name + ' on light'" /></div>
        </div>
        <div>From {{ selected.source }}</div>
        <div>Replaced:</div>
        <ul>
          <li v-for="r in selected.replaces" :key="r">{{ r }}</li>
          <li v-if="!selected.replaces.length">nothing</li>
        </ul>
        <div v-for="p in paths" :key="p.path" class="icon-finder-copy">
          <div>
            <code>{{ p.path }}</code>
            <button type="button" class="nwl-tool-button" @click="copy(p.path, $event)">{{ copied === p.path ? 'Copied' : 'Copy' }}</button>
          </div>
          <small>{{ p.where }}</small>
        </div>
      </section>
    </div>
  </div>`
});
Finder.play = async ({ canvasElement, step }) => {
  const field = canvasElement.querySelector('#icon-finder-query');
  const count = canvasElement.querySelector('.icon-finder-count');
  const buttons = () => [...canvasElement.querySelectorAll('.icon-finder-grid button')];
  const names = () => buttons().map((b) => b.querySelector('.icon-finder-name').textContent.trim());
  const search = async (text) => {
    await userEvent.clear(field);
    if (text) { await userEvent.type(field, text); }
  };

  await step('search by name, meaning and replaced file name', async () => {
    await search('save');
    await waitFor(() => expect(names()).toContain('save'));
    await search('floppy');
    await waitFor(() => expect(names()).toEqual(['save']));
    await search('edit');
    await waitFor(() => expect(names()).toContain('pencil'));
    await expect(count.textContent.trim()).toBe(`${buttons().length} icons`);
  });

  await step('no match', async () => {
    await search('zzz');
    await waitFor(() => expect(count.textContent.trim()).toBe('No icon matches'));
    await expect(buttons().length).toBe(0);
  });

  await step('keyboard: Tab to the first icon, Enter opens its detail', async () => {
    await search('');
    await waitFor(() => expect(count.textContent.trim()).toBe(`${icons.length} icons`));
    field.focus();
    await userEvent.tab();
    const [first] = buttons();
    await expect(document.activeElement).toBe(first);
    await userEvent.keyboard('{Enter}');
    const name = first.querySelector('.icon-finder-name').textContent.trim();
    const detail = await waitFor(() => {
      const el = canvasElement.querySelector('.icon-finder-detail');
      expect(el).not.toBeNull();

      return el;
    });
    await expect(detail.querySelector('h3').textContent.trim()).toBe(name);
    const shownPaths = [...detail.querySelectorAll('.icon-finder-copy code')].map((c) => c.textContent.trim());
    await expect(shownPaths).toEqual([
      `@/icons/${name}.svg`,
      `~nwl-components/dist/icons/${name}.svg`,
      `/lib/nwl-components/icons/${name}.svg`
    ]);
  });

  await step('copy writes the exact path', async () => {
    const written = [];
    const stub = (text) => {
      written.push(text);

      return Promise.resolve();
    };
    const hadClipboard = Boolean(navigator.clipboard);
    if (hadClipboard) {
      navigator.clipboard.writeText = stub;
    } else {
      Object.defineProperty(navigator, 'clipboard', { value: { writeText: stub }, configurable: true });
    }
    try {
      const name = canvasElement.querySelector('.icon-finder-detail h3').textContent.trim();
      const copyButtons = [...canvasElement.querySelectorAll('.icon-finder-copy button')];
      await userEvent.click(copyButtons[2]);
      await expect(written).toEqual([`/lib/nwl-components/icons/${name}.svg`]);
      await waitFor(() => expect(copyButtons[2].textContent.trim()).toBe('Copied'));
    } finally {
      if (hadClipboard) {
        delete navigator.clipboard.writeText;
      } else {
        delete navigator.clipboard;
      }
    }
  });

  await step('the detail panel follows the search', async () => {
    await search('floppy');
    await waitFor(() => expect(canvasElement.querySelector('.icon-finder-detail h3').textContent.trim()).toBe('save'));
    await search('zzz');
    await waitFor(() => expect(canvasElement.querySelector('.icon-finder-detail')).toBeNull());
  });

  // leave the story as a visitor expects it: no search, every icon, no panel
  await step('reset: every icon, no panel', async () => {
    await search('');
    await waitFor(() => expect(count.textContent.trim()).toBe(`${icons.length} icons`));
    await expect(buttons().length).toBe(icons.length);
    await expect(field.value).toBe('');
    await expect(canvasElement.querySelector('.icon-finder-detail')).toBeNull();
  });
};
