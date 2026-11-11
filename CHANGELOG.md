# Changelog

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
