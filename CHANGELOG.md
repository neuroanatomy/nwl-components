# Changelog

## Unreleased

Storybook only (stories aren't published to npm; no version bump).

- CI publishes the Storybook on GitHub Pages after the tests pass on `main`:
  <https://neuroanatomy.github.io/nwl-components/> (job `storybook-pages`).

- Story `Icons/Finder`: search the icons by name, meaning or the app file names they replaced
  ("floppy" finds `save`), at 24, 32 or 48 px on the dark or a light background; pick one for a
  large preview, what it replaced, and copy buttons for its three paths (`@/icons/`, webpack 4
  `~nwl-components/dist/icons/`, served `/lib/nwl-components/icons/`). Its `play` test covers
  the search, the count, no match, the keyboard and the copy. The map is parsed once in
  `src/icons/map.js`, shared with `Icons/All`.

## 2.4.0

New: the opt-in 2027 theme (UI kit step 12, decisions U11–U17). Nothing changes on a page that
doesn't set `data-nwl-theme="2027"` on `<html>`: every token keeps its 2.3.0 value.

- **`tokens.css`**: new raw values in tier 1 (greys `--nwl-grey-1a` … `--nwl-grey-e8`,
  `--nwl-black-40/-50`, the font names); a third block,
  `:root[data-nwl-theme="2027"]`, remaps tier 2: softer greys (page #1a1a1a, panels #252525,
  menus and selected rows #2e2e2e, canvas still #000), off-white text #e8e8e8, no text darker
  than #999, control borders ≥ 3:1, no accent (focus and links stay the text colour; the
  `--nwl-accent*` tokens are unchanged and unused),
  Source Sans 3 and IBM Plex Mono before today's stacks, and two shadows `--nwl-shadow-1`
  (menus) and `--nwl-shadow-2` (floating panels). See the README ("Themes") for the table.
- **`nwl-components/fonts.css`** (`dist/fonts.css`, not in `dist/style.css`): `@font-face` for
  Source Sans 3 (400, 400 italic, 600), IBM Plex Mono (400) and Roboto (100), `font-display:
  swap`, URLs relative to the file. The woff2 files (Latin subset) and their SIL OFL 1.1
  licences are in `dist/fonts/`, copied at build from `@fontsource/*` devDependencies.
- **`base.css`**, under the theme only: `h1`–`h3` in `.app` weight 600/600/500 (alignment unchanged);
  form controls inherit the font family (today they keep the browser's).
- **Fix, visible in both themes: `Checkbox`**'s ring is 13px (was 11px), so it is centred on the
  9px disc again: since 2.0.0's inherited `box-sizing: border-box` it sat 1px up and left. Its
  story checks both centres within 0.5px.
- Shadows, under the theme only (today's value as the `var()` fallback): `Autocomplete`
  results, the editor's floating tool palette, the `OntologySelector` panel, the
  `ImportFilesDialog` box.
- Storybook: a toolbar **Theme** switch (today / 2027; default today) and the `Styles/Theme 2027`
  stories (swatches of every tier 2 token in both themes with computed contrast ratios, the
  type scale in the three fonts) with play tests: 2027 contrasts, 2.3.0 values without the
  attribute, fonts loaded from `fonts/`, controls' font; `Pages/Settings` Default checks the
  project name stays centred in both themes.

## 2.3.0

New: the shared icon set (UI kit step 11c). Added files, plus one changed drawing.

- **`dist/icons/<name>.svg`**: every UI icon of nwl-components, BrainBox and microdraw, one file
  per meaning (73), copied byte for byte from the repos (no redraw). Exported as
  `nwl-components/icons/*` (`exports`); `nwl-components/dist/icons/*` for webpack 4. The sources
  are in `src/icons/`, and `src/icons/README.md` maps each name to the file it came from and the
  app copies it replaces. Merged copies are byte-identical or render the same (0 differing
  pixels at 48 px). One rename: BrainBox's `floppy` is `save`. See the README ("Icons").
- The components take their icons from `src/icons/` instead of `src/assets/` (which keeps the
  logos). `Nav`, `Access` and the editor components look the same.
- **`PureFiles`** (the settings page's Files list): the download and upload icons are now
  BrainBox's drawing, larger and bolder, the one the BrainBox viewer uses.
- Story `Icons/All`: every icon with its name; its `play` test checks one file per row of the
  map, that every image loads, and that no name is used twice.

## 2.2.0

New: `useProject` is exported from the library entry (`import { useProject } from
'nwl-components'`). Added export only; nothing else changes.

- It is the same store `Nav` and the settings pages use (one state in `dist/`, es and umd), so an
  app can set the project with `setProject(project)` and the `Header` shows the settings link
  (`/project/<shortname>/settings`) when the app also provides `displaySettings: true`. Call it
  inside a component's `setup` or the app's `runWithContext`: it injects `config`. See the
  README ("Store").
- Stories `Layout/Header` `WithProjectSettings` (link present, a project without `files` is
  accepted) and `WithoutProject` (no link), with `play` tests.

## 2.1.1

- `Footer`: the text link ("groupe de neuroanatomie appliquée et théorique") shows an underline
  on hover. It has none at rest and is the text colour, so the hover underline is what marks it
  as a link (WCAG 1.4.1), as the apps do for their own bare links since step 9a. The logo link,
  an image, is unchanged. The `Layout/Footer` story checks both states.

## 2.1.0

New: widget classes for markup that isn't Vue. Nothing existing changes on screen: the library's
components look the same (computed styles of every story, hover included, are those of 2.0.0).

- **`widgets.css`** (`src/styles/widgets.css`, in `@layer nwl.widgets`, selectors in
  `:where()`, semantic tokens only), exported as `nwl-components/widgets.css` (`dist/widgets.css`;
  also `widgets.css` at the package root for webpack 4) and included in `dist/style.css`. It
  works on its own after `tokens.css` and `base.css`. Classes:
  - `.nwl-push-button`: `Button`'s push look (1px `--nwl-border-strong`, `--nwl-radius-md`,
    bold, `padding: 5px 0`, centred); hover `--nwl-bg-pressed`, disabled opacity .4; on
    `<button>`, `<a>`, `<select>`, `<input type="button|submit">`, browser look reset.
  - `.nwl-tool-button`: the viewers' tool button (BrainBox `.a`, microdraw `.mui`): 24px,
    1px `--nwl-border`, `--nwl-radius-sm`, 1px margin, fills its container; on a native
    `<button>`, browser look reset. Hover: `--nwl-bg-pressed` with text, opacity .5 with only
    an icon. `.nwl-tool-button--sub`: no border, 22px.
  - `.nwl-icon-button` (no border, opacity .5 on hover; needs `aria-label`), `.nwl-icon` (16px,
    middle-aligned, not selectable), `.nwl-text-field` (input, textarea: inherited size and
    colour, `--nwl-bg-input`, 1px `--nwl-border`, `--nwl-radius-sm`, placeholder
    `--nwl-text-placeholder`).
  - Keyboard focus on the widgets: the 2px `--nwl-focus` outline, also outside `.app`.
- **ARIA state contract**: the state is an attribute, not a class. `aria-pressed="true"` on a
  `.nwl-tool-button` gives `--nwl-bg-pressed`; `aria-selected="true"` on a `<tr>` gives
  `--nwl-bg-elevated`; `disabled` or `aria-disabled="true"` dims a button.
- `Button`'s push variant (`class-name="push-button"`) renders `.nwl-push-button` (and keeps
  `push-button`); its look now comes from `widgets.css`. `NewProjectPage` passes it as
  `class-name`. The selectable rows of `PureFiles`, `PureAnnotations`, `PureCollaborators`,
  `TextAnnotations` and `VolumeAnnotations` carry `aria-selected` beside their `.selected`
  class; `Tabs` is a `tablist` of `tab`s with `aria-selected`.
- Tokens: new `--nwl-text-button` (push buttons' text, `#ddd`); `--nwl-link` and
  `--nwl-link-hover` are now `var(--nwl-text)` (same value, white). `base.css` gives hovered
  links `--nwl-link-hover`.
- Stories `Library/Widgets` (plain HTML; play tests read computed styles: pressed state follows
  `aria-pressed`, icon versus text hover, Tab reaches a native tool button and shows the
  outline, an unlayered one-class app rule beats a widget). `.storybook/test-runner.js`
  checks hovered styles with the real mouse (`parameters.hoverStyles`); `Library/Look` checks
  `Button` and table-row hover with it.

## 2.0.0

Breaking: the library's CSS changes priority, and the global `*` rule is gone. No visual change
inside the library's own components except the focus outline and `SortableTh`'s unsorted icon
(below); stories `Library/Look` (unchanged) and `Library/Base` check it.

- **Cascade layers.** All library CSS is in `@layer nwl.base, nwl.widgets, nwl.components`,
  declared once at the top of `dist/style.css`, `nwl-components/base.css` and
  `nwl-components/sort/style.css` (a PostCSS step in `vite.config.js`, `scripts/css-layers.js`).
  **Unlayered app CSS now always beats library CSS**, whatever the specificity or load order:
  an app rule that used to lose to a component's scoped rule (e.g. `button { … }` against
  `Button`) now wins. The tokens stay unlayered. Rules an app wrote with `!important` or an
  `html …` prefix to beat the library still work and can be simplified.
- **No `*` rule.** `Wrapper.vue`'s `* { box-sizing: border-box; font-size: 14px; color: white }`
  is removed. It applied to the whole page, also outside the wrapper. Apps that relied on it
  for their own markup (outside `.app`, or headings, links and form controls that the
  browser styles) must set font, size and colour themselves.
- **`base.css`** (`src/styles/base.css`, in `nwl.base`, selectors in `:where()`), exported as
  `nwl-components/base.css` and included in `dist/style.css`: `html` font size 14px (1rem keeps
  its 1.x value), `body` margin 0 (moved from `Wrapper.vue`), font and colour on `.app`,
  inherited; `box-sizing: border-box` on `.app`, inherited by all elements and pseudo-elements;
  headings, `small`/`sub`/`sup`, code and form controls take their parent's font size, form
  controls and `<dialog>` their parent's colour (the controls' font family unchanged), links
  `--nwl-link`.
- **Focus outline.** New token `--nwl-focus` (= `--nwl-text`, white). `:focus-visible` inside
  `.app` gets `outline: 2px solid var(--nwl-focus); outline-offset: 2px`. `Button`, `Select`
  and `RangeSlider` no longer set `outline: none`; `sortable.css`'s 1px `currentColor`
  outline is now 2px `--nwl-focus` (2px offset). Mouse focus shows no outline on buttons;
  browsers show it on text fields, and Chromium on `<select>`.
- Components that relied on the `*` rule keep their look: `OntologySelector`'s contents and
  `Footer`'s links stay 14px; `ScriptConsole`'s overrides of codeflask's (unlayered) CSS use
  `!important`, the one way a layered rule beats unlayered CSS (and its code text stays
  white).
- One visible change besides focus: `SortableTh`'s unsorted icon on pages with
  `dist/style.css` is now grey (`--nwl-grey-7a`, `--nwl-grey-bb` on hover) as designed and as on
  `sort/style.css` pages. 1.x's `*` rule set the icon's `<path>` colour to white, and the
  stroke (`currentColor`) followed it.
- Stories `Library/Base`: form controls inside the wrapper compute 14px, white and the 1.x
  font, `box-sizing` is `border-box`, children inherit (no `*` rule), app CSS beats a
  component's scoped rule, keyboard focus (`userEvent.tab()`) shows a 2px solid outline in
  `--nwl-focus`'s colour, and a real mouse click (`.storybook/test-runner.js`) shows none.

## 1.8.0

- Design tokens: `src/styles/tokens.css`, `:root` custom properties in two tiers (a raw
  palette, the only place with hex values, and semantic tokens for backgrounds, borders,
  text, accent, links, status colours, fonts, sizes, weights, line heights, spacing, radii and
  shadows), with today's values. Exported as `nwl-components/tokens.css` (`dist/tokens.css`;
  also `tokens.css` at the package root for webpack 4), importable on its own.
- `dist/style.css` and `sort/style.css` each include the tokens, and the library's CSS reads
  them (`var(--nwl-…)`) instead of colour, font, font-size and radius literals. No visual
  change: the computed styles are the same as in 1.7.1 (stories `Library/Look`, which check
  Button, Table, an Access cell, SortableTh, OntologySelector, Header and Footer).
- Storybook page `Library/Tokens`: every token with a sample; its test checks that every
  token is defined.
- `npm run lint`: eslint, then `scripts/check-tokens.js`, which fails on a hex colour in
  `src/**/*.{vue,css}` outside `tokens.css` or on an undefined `--nwl-` token.

## 1.7.1

- `NewProjectPage`: the invalid-name warning says short names can contain "letters, numbers and
  hyphens" (was "letters and numbers"): both apps accept hyphens in new shortnames since
  2026-11-11. The story's check allows hyphens too; new story `Pages/New Project` InvalidName.

## 1.7.0

- `PureCollaborators` (and so `Collaborators` and the settings pages): `anyone` is the minimum a
  named collaborator has. Raising `anyone`'s level of one type (collaborators, annotations or
  files) above that of named collaborators asks first, with `window.confirm`, naming them, the
  type and the new level. On confirm, those collaborators are raised to the new level with
  `anyone`, through `updateCollaborator` events (one per row); on cancel nothing changes.
  Lowering `anyone`, or changing a named collaborator, works as before. The `anyone` row is
  recognised by `username` or `userID`. Stories `Settings/Collaborators` RaiseAnyoneConfirmed,
  RaiseAnyoneCancelled, RaiseAnyoneNoneBelow, LowerAnyone.

## 1.6.1

- String columns sort in natural order (`localeCompare` with `numeric: true`): "Macaque E70",
  "E90", "E120", and "file2" before "file10" (before, "E120" came first). Applies to
  `sortRows` and so to `useSortable`/`SortableTh`; missing values, stability, numbers and
  dates are unchanged. Story `Common/PlainSort` NaturalOrder.

## 1.6.0

- Sorting for tables built without Vue: `nwl-components/sort` (no Vue) exports `sortRows`,
  `sortValue`, `nextSort`, `sortableHeader`, `renderSortIcon`, `ariaSort` and the icon data
  `SORT_ICON_PATHS` / `SORT_ICON_ATTRS`; the same names are also exported from
  `nwl-components`. `useSortable` and `SortableTh` now use them (no behaviour change).
- The sortable header styles alone (only `th.nwl-sortable` / `.nwl-sort-*` rules, nothing
  global) as `nwl-components/sort/style.css`, for pages that must not load `dist/style.css`;
  they stay in `dist/style.css` for `SortableTh`. New story `Common/PlainSort`.

Earlier releases are in the git history.
