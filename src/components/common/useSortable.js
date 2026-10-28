import { computed, ref, toValue } from 'vue';

const isMissing = (v) => v === null || typeof v === 'undefined' || v === '' || Number.isNaN(v);

// The value a column sorts by, as a number (numbers, dates) or a string.
// Returns null when the value is missing or can't be read as the column's type.
const sortValue = (row, { key, type = 'string' }) => {
  const raw = typeof key === 'function' ? key(row) : row?.[key];
  if (isMissing(raw)) { return null; }
  switch (type) {
  case 'number': {
    const n = Number(raw);

    return Number.isNaN(n) ? null : n;
  }
  case 'date': {
    const t = (raw instanceof Date ? raw : new Date(raw)).getTime();

    return Number.isNaN(t) ? null : t;
  }
  default:
    return String(raw);
  }
};

/**
 * Sorting state for a table.
 *
 * @param {Array|Ref<Array>|Function} rows The rows (array, ref, computed or getter). Never mutated.
 * @param {Object} columns For each column name, `{ key, type }`: `key` is the row's property
 *   (or a function `row => value`), `type` is `'string'` (default, localeCompare), `'number'` or `'date'`.
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
    const dir = sortAscending.value ? 1 : -1;
    const type = column.type || 'string';

    return list
      .map((row) => ({ row, value: sortValue(row, column) }))
      .sort((a, b) => {
        const [ma, mb] = [a.value === null, b.value === null];
        if (ma || mb) { return ma - mb; }
        if (type === 'string') { return dir * a.value.localeCompare(b.value); }

        return dir * (a.value - b.value);
      })
      .map(({ row }) => row);
  });

  const sortBy = (column) => {
    if (sortColumn.value === column) {
      sortAscending.value = !sortAscending.value;
    } else {
      sortColumn.value = column;
      sortAscending.value = true;
    }
  };

  const direction = (column) => {
    if (sortColumn.value !== column) { return 'none'; }

    return sortAscending.value ? 'ascending' : 'descending';
  };

  return { sortedRows, sortColumn, sortAscending, sortBy, direction };
};
