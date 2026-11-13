# Changelog

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
