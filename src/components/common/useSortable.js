import { computed, ref, toValue } from 'vue';

import { nextSort, sortRows } from './sort.js';

/**
 * Sorting state for a table.
 *
 * @param {Array|Ref<Array>|Function} rows The rows (array, ref, computed or getter). Never mutated.
 * @param {Object} columns For each column name, `{ key, type }`: `key` is the row's property
 *   (or a function `row => value`), `type` is `'string'` (default, natural order: "E90" before "E120"), `'number'` or `'date'`.
 * @param {Object} [options] `{ column, ascending }`: the initial sort (default: none, rows as given).
 * @returns {Object} `sortedRows` (computed), `sortColumn` and `sortAscending` (refs),
 *   `sortBy(column)`, and `direction(column)`: `'ascending'`, `'descending'` or `'none'`.
 *
 * First click on a column sorts it ascending, a second click reverses, another column sorts
 * ascending. Missing values (null, undefined, '', not a number/date) sort last in both directions.
 */
export const useSortable = (rows, columns, options = {}) => {
  const sortColumn = ref(options.column ?? null);
  const sortAscending = ref(options.ascending ?? true);

  const sortedRows = computed(() => {
    const list = toValue(rows) || [];
    const column = columns[sortColumn.value];
    if (!column) { return list; }

    return sortRows(list, column, sortAscending.value);
  });

  const sortBy = (column) => {
    const next = nextSort({ column: sortColumn.value, ascending: sortAscending.value }, column);
    sortColumn.value = next.column;
    sortAscending.value = next.ascending;
  };

  const direction = (column) => {
    if (sortColumn.value !== column) { return 'none'; }

    return sortAscending.value ? 'ascending' : 'descending';
  };

  return { sortedRows, sortColumn, sortAscending, sortBy, direction };
};
