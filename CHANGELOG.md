# Changelog

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
