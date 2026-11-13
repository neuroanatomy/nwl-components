# About

This project is a library of components to be used on the frontend of the Neuroweblab projects. 
They are similar in style and behaviour to existing projects.

## Scope

nwl-components holds only **generic** components, which any NAAT app can use and
customise through props, slots and the `config` object: the project-management pages,
the project-page shell, and generic building blocks. Nothing tied to one app
(BrainBox or microdraw) and none of a viewer's own logic belongs here; that stays in
each app.

Exports by group:

| Group | Exports |
|---|---|
| Pages | `UserPage`, `NewProjectPage`, `SettingsPage`, `ProjectPage` (the project-page shell: header, resizable left/right split, fullscreen; the app fills the slots) |
| Layout | `Wrapper`, `Header`, `Nav`, `Footer` |
| Settings | `Settings`, `ProjectInfo`, `Files`, `Collaborators`, `Annotations`, `Access`, `ImportFilesDialog`, `PureFiles`, `PureCollaborators`, `PureAnnotations` |
| Common widgets | `Button`, `Checkbox`, `Select`, `TextInput`, `TextArea`, `Autocomplete`, `Table`, `SortableTh` and `useSortable` (sortable table columns), `Tabs`, `Tab` |
| Building blocks | `Editor` (floating/dockable tool window with content and tools slots), `Row`, `Col`, `ButtonsGroup`, `RangeSlider`, `AdjustSettings`, `Chat`, `ScriptConsole`, `TextAnnotations`, `VolumeAnnotations`, `AnnotationCell`, `OntologySelector` (label-set selector) |

### To clean up

App-specific content that should become neutral later (no component is deprecated):

- the BrainBox stories `src/components/pages/BrainboxProjectPage.stories.js` and
  `src/components/project/BrainboxProject.stories.js`;
- the story data `TextAnnotations.brainbox.fixtures.json` and
  `TextAnnotations.microdraw.fixtures.json`;
- the BrainBox settings (site name, logo, URLs, label sets) in `.storybook/preview.js`;
- `ScriptConsole`: it loads codeflask and consolita from fixed CDN URLs, and its CSS
  targets the global id `#logScript`; both should become configurable;
- `Chat` renders messages as raw HTML (`v-html`): they must be sanitised before an
  app uses it.

## Sortable tables

`useSortable(rows, columns)` keeps a table's sort state; `SortableTh` is a header cell
that sorts by its column when clicked (or with Enter/Space). Every sortable header always
shows an icon (a grey up/down "sort" icon when the column is not the sort column, one
up or down arrow when it is; inline SVG from Tabler Icons, MIT) in a box of fixed size,
so nothing moves when you click; `aria-sort` is set on the
`<th>`. First click sorts ascending, a second click reverses, another column sorts
ascending; missing values (`null`, `undefined`, `''`, not a number/date) are always last.
The `rows` array is never mutated. Headers written as plain `<th>` look as before.

```js
import { SortableTh, Table, useSortable } from 'nwl-components';

const PageContents = {
  template: '#template',
  setup () {
    const projects = ref([]);
    const sort = useSortable(projects, {
      // column name: { key: row property (or row => value), type: 'string' (default) | 'number' | 'date' }
      Name: { key: 'project' },
      Files: { key: 'numFiles', type: 'number' },
      'Last modified': { key: 'modified', type: 'date' }
    });

    return { projects, sort, sortedProjects: sort.sortedRows };
  }
};
const app = createApp(PageContents);
app.component('Table', Table);
app.component('SortableTh', SortableTh);
```

```html
<script type="text/html" id="template">
  <Table>
    <thead><tr>
      <sortable-th :sort="sort" column="Name">Name</sortable-th>
      <sortable-th :sort="sort" column="Files">Files</sortable-th>
      <sortable-th :sort="sort" column="Last modified">Last modified</sortable-th>
    </tr></thead>
    <tbody>
      <tr v-for="project in sortedProjects">...</tr>
    </tbody>
  </Table>
</script>
```

In a template parsed by the browser (written directly in the page, not in a
`<script type="text/html">`), write `<th is="vue:sortable-th" ...>` instead, so the
browser keeps it inside the table. `useSortable` also returns `sortBy(column)`,
`direction(column)` (`'ascending'`, `'descending'` or `'none'`), and the refs
`sortColumn` and `sortAscending`; a third argument `{ column, ascending }` sets an initial
sort. Story: `Common/Table` (`npm run storybook`). Since 1.5.0.

Table cells wrap at spaces only, so a long word such as an owner's user name is never
broken. A cell that may break inside a word, so that the table is never wider than its
panel (for example a long project name with no spaces), opts in with the class
`nwl-break-anywhere` (`overflow-wrap: anywhere`). It works on cells written in the
`Table` slot. Since 1.5.3.

```html
<tr v-for="project in sortedProjects">
  <td class="nwl-break-anywhere">{{ project.name }}</td>
  <td>{{ project.owner }}</td>
</tr>
```

### Tables without Vue

Pages that build their tables with template strings and the DOM sort them the same way
with `nwl-components/sort`, which has no Vue (about 3 kB). Importing these names from
`nwl-components` itself also works, but bundles Vue and the whole library.
`useSortable` and `SortableTh` use the same code, so the order and the header markup
never differ.

```js
import { nextSort, sortRows, sortableHeader } from 'nwl-components/sort';

const columns = { Name: { key: 'project' }, Files: { key: 'numFiles', type: 'number' } };
let state = { column: null, ascending: true };
const headers = {};
const render = () => {
  const rows = state.column ? sortRows(projects, columns[state.column], state.ascending) : projects;
  tbody.innerHTML = rows.map((p) => `<tr><td>${p.project}</td><td>${p.numFiles}</td></tr>`).join('');
  for (const [name, header] of Object.entries(headers)) {
    header.setDirection(name !== state.column ? 'none' : state.ascending ? 'ascending' : 'descending');
  }
};
for (const th of table.querySelectorAll('th')) {
  const name = th.textContent;
  headers[name] = sortableHeader(th, { onSort: () => { state = nextSort(state, name); render(); } });
}
render();
```

- `sortRows(rows, { key, type }, ascending = true)`: a new, sorted array (stable; missing
  values last in both directions; strings in natural order, `localeCompare` with
  `numeric: true`, so "E90" comes before "E120"; since 1.6.1). `sortValue(row, column)`
  is the value it compares.
- `sortableHeader(th, { direction, onSort })` turns a `<th>` into SortableTh's markup
  (`class="nwl-sortable"`, `aria-sort`, a `<button type="button">` with the th's content
  and the icon; Enter and Space work as on any button) and returns
  `{ th, button, setDirection(direction) }`.
- `nextSort(state, column)`: the sort after a click, as in `useSortable`.
- For template strings: `renderSortIcon(direction)` (the SVG) and `ariaSort(direction)`.

The headers' look is in `nwl-components/sort/style.css`, which has only the
`th.nwl-sortable` and `.nwl-sort-*` rules, after the design tokens they read (`:root` custom
properties, see "Design tokens"; 6 kB in all). Load that file, not `dist/style.css`, on a
page not built with nwl-components: `dist/style.css` has global rules (`*` sets the font
size and colour of every element). With a bundler, `import 'nwl-components/sort/style.css'`
(webpack 4 included); otherwise link `node_modules/nwl-components/dist/sort/style.css`.
`dist/style.css` keeps the same rules for `SortableTh`. Story: `Common/PlainSort`.
Since 1.6.0.

## Design tokens

The library's colours, fonts, font sizes and corner radii are CSS custom properties, defined
in `src/styles/tokens.css` (`:root` rules only) in two tiers:

- the raw palette (`--nwl-grey-44`, `--nwl-white`, `--nwl-cyan`, …): the only place with hex
  values;
- the semantic tokens, to use in components and app CSS: backgrounds (`--nwl-bg`,
  `--nwl-bg-surface`, `--nwl-bg-elevated`, …), borders (`--nwl-border`, …), text
  (`--nwl-text`, `--nwl-text-2`, `--nwl-text-3`, …), accent, links and status colours
  (`--nwl-danger`, `--nwl-success`, `--nwl-warning`), font families (`--nwl-font-body`,
  `--nwl-font-display`, `--nwl-font-mono`), sizes (`--nwl-text-xs` … `--nwl-text-hero`;
  body text is `--nwl-text-md`), weights, line heights, spacing (`--nwl-space-1` …
  `--nwl-space-16`), radii (`--nwl-radius-sm`, `--nwl-radius-md`) and shadows.

Their values are those the NAAT apps have today, so loading them changes nothing on screen.
Storybook's `Library/Tokens` page lists every token with a sample.

`dist/style.css` and `nwl-components/sort/style.css` each include the tokens, so a page that
loads either needs nothing else. To use the tokens in an app's own CSS without those files:

```js
import 'nwl-components/tokens.css'; // with a bundler (webpack 4 included)
```

```html
<!-- a page with no bundle: serve or copy node_modules/nwl-components/dist/tokens.css -->
<link rel="stylesheet" href="/lib/nwl-components/tokens.css">
```

```css
.my-panel {
  background: var(--nwl-bg-surface);
  border: 1px solid var(--nwl-border);
  border-radius: var(--nwl-radius-sm);
}
```

Loading the tokens twice on a page (e.g. `tokens.css` and `dist/style.css`) is harmless.
`npm run lint` fails on a hex colour in `src/**/*.{vue,css}` outside `tokens.css`, and on a
`var(--nwl-…)` that `tokens.css` doesn't define. Since 1.8.0.

## Base styles and cascade layers

Since 2.0.0 all the library's CSS is in three cascade layers, declared in this order at the
top of each stylesheet it ships (`dist/style.css`, `nwl-components/base.css`,
`nwl-components/sort/style.css`):

```css
@layer nwl.base, nwl.widgets, nwl.components;
```

- `nwl.base`: `src/styles/base.css` (below);
- `nwl.widgets`: `src/styles/widgets.css`, the widget classes (see "Widgets");
- `nwl.components`: the components' styles (scoped or not), `sortable.css`, and the CSS of
  bundled dependencies (splitpanes).

The tokens (`tokens.css`) stay outside the layers: they only define custom properties.
**An app's own CSS, which is not in a layer, always wins over the library's**, whatever the
load order or the selectors' specificity: `button { … }` in an app overrides `Button`'s scoped
rules. No `!important` and no `html …` prefix are needed. (An app that puts its own CSS in
layers must declare them after `nwl.components` to keep this.)

`base.css` replaces 1.x's global `* { box-sizing: border-box; font-size: 14px; color: white }`
rule, which is gone. Its selectors are wrapped in `:where()` (no specificity), and they apply
inside the wrapper (`.app`, the root of `Wrapper`) only, except two:

- `html`: `font-size: var(--nwl-text-md)` (1rem = 14px, as in 1.x), and `body`: `margin: 0`;
- `.app`: font (`--nwl-font-body`, `--nwl-text-md`) and colour (`--nwl-text`), inherited by
  everything inside; `box-sizing: border-box`, inherited by every element and pseudo-element;
- headings, `small`, `sub`, `sup`, `code`, `pre` and form controls take their parent's font
  size; form controls and `<dialog>` their parent's colour (the controls' font family stays
  the browser's); links `--nwl-link`;
- keyboard focus: `:focus-visible` gets a 2px solid `--nwl-focus` outline, 2px away
  (`--nwl-focus` is `--nwl-text`, white). Mouse focus shows nothing on buttons; browsers
  show it on text fields and Chromium on `<select>`, as they decide what is `:focus-visible`.

`dist/style.css` includes `base.css`. A page without the Vue components (e.g. a Mustache page
that wants the same font, colour and focus style) can load it alone, after the tokens:

```js
import 'nwl-components/tokens.css';
import 'nwl-components/base.css'; // webpack 4 too (a copy at the package root)
```

```html
<link rel="stylesheet" href="/lib/nwl-components/tokens.css">
<link rel="stylesheet" href="/lib/nwl-components/base.css">
<div class="app">…</div>
```

Outside `.app`, nothing sets font, colour or box-sizing any more: an app's own markup on a
page that loads `dist/style.css` gets them from the app's CSS (or from being inside `.app`).

## Widgets

Since 2.1.0, `src/styles/widgets.css` holds class-based widgets for markup that isn't Vue
(Mustache pages, the viewers' tool panels); the library's `Button` uses them too. They are in
`@layer nwl.widgets` and every selector is wrapped in `:where()`, so **an app rule with one
class wins** over them. Colours, borders and radii come from the semantic tokens.

State is an ARIA attribute, not a class, so screen readers get it too: `aria-pressed="true"` on
a tool button that is on, `aria-selected="true"` on a selected table row, `disabled` (or
`aria-disabled="true"` on a link) on a button. The apps' classes (`.pressed`, `.mui-pressed`,
`.selected`) don't style the widgets.

Push button (Save, Cancel): 1px `--nwl-border-strong` outline, `--nwl-radius-md`, bold, on a
`<button>`, `<a>`, `<select>` or `<input type="button|submit">`. Hover: `--nwl-bg-pressed`;
disabled: opacity .4.

```html
<button class="nwl-push-button">Save</button>
```

Tool button (a viewer's tool panel): 24px high, 1px `--nwl-border`, `--nwl-radius-sm`; it fills
its container's width, less its 1px margins, as the apps' div tools did. On a native `<button>`
it is in the tab order with no script. Pressed: `aria-pressed="true"` gives `--nwl-bg-pressed`.
Hover: `--nwl-bg-pressed` on a text button, opacity .5 on a button whose only element is an
icon (`img`, `svg` or `.nwl-icon`; CSS can't see text, so a button with an icon and text counts
as an icon button). `.nwl-tool-button--sub`: a tool inside a group (no border, 22px).

```html
<div style="flex: 1"><button class="nwl-tool-button" aria-pressed="true">Sag</button></div>
<div style="flex: 1">
  <button class="nwl-tool-button" aria-pressed="false" aria-label="Full screen">
    <img class="nwl-icon" src="/img/fullscreen.svg" alt="">
  </button>
</div>
```

Icon button: an icon with no border; opacity .5 on hover. It shows no text, so give it an
accessible name with `aria-label`, and an empty `alt` to its image.

```html
<button class="nwl-icon-button" aria-label="Zoom in"><img class="nwl-icon" src="/img/zoomIn.svg" alt=""></button>
```

Icon: 16px, aligned with the text (`vertical-align: middle`), not selectable.

```html
<img class="nwl-icon" src="/img/home.svg" alt="Home">
```

Text field (`<input>`, `<textarea>`): its parent's font size and colour, `--nwl-bg-input`, 1px
`--nwl-border`, `--nwl-radius-sm`, no padding (as the apps' `.text`), placeholder in
`--nwl-text-placeholder`.

```html
<input class="nwl-text-field" placeholder="Project name">
```

Selected row: `aria-selected="true"` on a `<tr>` gives `--nwl-bg-elevated`.

```html
<tr aria-selected="true"><td>axolotl</td></tr>
```

Keyboard focus on the widgets shows `base.css`'s outline (2px `--nwl-focus`), also outside
`.app`. Links take `--nwl-link` (hover `--nwl-link-hover`), both the text colour: keep their
underline (the browser's) where they sit in text, so they don't depend on colour alone.

`dist/style.css` includes the widgets. A page with no bundle links the three files, in this
order (microdraw serves `node_modules/nwl-components/dist/` as `/lib/nwl-components/`):

```html
<link rel="stylesheet" href="/lib/nwl-components/tokens.css">
<link rel="stylesheet" href="/lib/nwl-components/base.css">
<link rel="stylesheet" href="/lib/nwl-components/widgets.css">
```

With a bundler: `import 'nwl-components/widgets.css'` after the tokens and base (webpack 4 too:
a copy at the package root). Storybook's `Library/Widgets` shows each widget in plain HTML, with
its states.

## Icons

Every UI icon of nwl-components, BrainBox and microdraw, one SVG file per meaning (73), in
`dist/icons/<name>.svg`. The map in [`src/icons/README.md`](src/icons/README.md) lists each name,
its meaning, the file it came from and the app copies it replaces.

- In a page or app CSS: `/lib/nwl-components/icons/<name>.svg` where the app serves
  `node_modules/nwl-components/dist/` at `/lib/nwl-components/` (microdraw does).
- With a bundler: `nwl-components/dist/icons/<name>.svg` (webpack 4, which ignores `exports`;
  html-loader takes `~nwl-components/dist/icons/<name>.svg`), or `nwl-components/icons/<name>.svg`
  through `exports`.

```html
<img class="nwl-icon" alt="undo" src="/lib/nwl-components/icons/undo.svg">
```

The drawings are the apps' files as they were: fixed white (some with black cut-outs or grey
accents), for dark backgrounds. They don't follow the text colour, and many have no `viewBox`.
The library's own components (`Nav`, `Access`, `PureFiles`, the editor components) inline the
same files. Storybook's `Icons/All` shows them all.

To find one to reuse, search by name, meaning or old file name and copy its path: Storybook's
`Icons/Finder` (`npm run storybook`).

## Single File Components

This project makes use of Vue SFCs: _Single File Components_, that have the `.vue` extension.
They encapsulate the template, logic, and styling of a component in a single file, which makes sense for a library of components. Read more about SFC in the [Vue documentation](https://vuejs.org/guide/scaling-up/sfc.html).

## Scoped styles

> When a <style> tag has the scoped attribute, its CSS will apply to elements of the current component only. This is similar to the style encapsulation found in Shadow DOM.

Read more on https://vuejs.org/api/sfc-css-features.html#scoped-css

The idea here is to encapsulate the appearance of components in the file they are defined, and not let in leak elsewhere.   

## Composition API

The components make use of the Vue 3 [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html) which make code more reusable and [<script setup>](https://vuejs.org/api/sfc-script-setup.html) to make it code more compact.

See below how we use composables to define access to the store methods and properties.

## Store

In the project, the store is comprised of the modules in `src/store`.

Said modules are [composables](https://vuejs.org/guide/reusability/composables.html) that consist of a main function, usually prefixed with `use`, designed to expose stateful logic to other components.

They contain [reactive](https://vuejs.org/guide/extras/reactivity-in-depth.html#reactivity-in-depth) objects and actions to update them that you can "inject" inside of other components.

The idea is to have a centralized way of performing CRUD updates on the stateful slices of data on which rely other components.

### `useProject`

`useProject` (`src/store/project.js`) holds the current project. Since 2.2.0 it is exported
from the library entry, `import { useProject } from 'nwl-components'`, and it shares its
state with the library's components: the project an app sets is the one `Nav` (in `Header`)
and the settings pages read. `setProject(project)` replaces the current project (`null`
clears it); a project without `files` gets an empty `files.list`.

To show the settings link (`/project/<shortname>/settings`) in the `Header`, provide `config`
and `displaySettings`, then set the project:

```js
app.provide('config', config);
app.provide('displaySettings', true);
app.runWithContext(() => useProject().setProject(project));
```

`useProject` injects `config`, so call it inside a component's `setup` or inside the app's
`runWithContext` (after `config` is provided), not at module level.

## _Pure_ components

Pure components, also sometimes called _dumb_ components, doesn't have any logic tied to them: they're just taking care of how the component look and behave according to props. They can emit events, but the listeners should be plugged in the parent components.

The parent components are said to be container components (or sometimes _smart_ components) : this is where you actually define the logic and actions of updating the store or retrieving data from it. They're the one actually connected to the store, defined above.

This concept makes it possible to separate view and business logic. In the project, pure components are prefixed with _Pure_.


## Configuration

The apps give the components their settings through a `config` object, provided to the
whole Vue app (`app.provide('config', config)`); see `.storybook/preview.js` for the
usual keys (`baseURL`, `usernameField`, `fetchLabelSets`, ...). Optional settings, all
off by default:

| Key | Default | Effect |
|---|---|---|
| `showEmbedButton` | `true` | Set to `false` to hide the "Embed Project" button (and its dialog) in the project settings, for apps that have no `/project/:p/embed` page. |
| `beforeSaveProject(project)` | none | Called when "Save Changes" is clicked in the project settings, before the project is sent to the server, with the project as edited. Return (or resolve to) `false` to cancel the save; any other value saves as before. If it throws or rejects, the project is not saved and the page shows "Changes not saved". |

```js
app.provide('config', {
  baseURL: '',
  // ...
  showEmbedButton: false,
  beforeSaveProject: async (project) => {
    // e.g. check the project, ask the user to confirm
    return confirm(`Save ${project.shortname}?`);
  }
});
```

Since 1.4.0.

## Storybook

The components are documented through storybook, where you can see their props and see example use cases (for now we just have 'default' ones). Storybook stories are defined in files with the `.stories.js` extension. It's a quite handy tool to develop a component in isolation of other components.

Run `npm run storybook` to launch storybook.

To have a documentation always accessible, it could be possible to build storybook and publish it on Chromatic, for example through this [Github Action](https://github.com/chromaui/action).

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)
