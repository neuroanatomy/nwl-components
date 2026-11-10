# Changelog

## 1.6.0

- Sorting for tables built without Vue: `nwl-components/sort` (no Vue) exports `sortRows`,
  `sortValue`, `nextSort`, `sortableHeader`, `renderSortIcon`, `ariaSort` and the icon data
  `SORT_ICON_PATHS` / `SORT_ICON_ATTRS`; the same names are also exported from
  `nwl-components`. `useSortable` and `SortableTh` now use them (no behaviour change).
- The sortable header styles alone (only `th.nwl-sortable` / `.nwl-sort-*` rules, nothing
  global) as `nwl-components/sort/style.css`, for pages that must not load `dist/style.css`;
  they stay in `dist/style.css` for `SortableTh`. New story `Common/PlainSort`.

Earlier releases are in the git history.
