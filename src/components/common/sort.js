// Table sorting without Vue: the comparison used by useSortable, and the header markup of
// SortableTh (icon, aria-sort, button), for pages that build their tables with template
// strings and the DOM. useSortable and SortableTh use this file, so they never drift.
// No Vue import here: this file is also built alone as `nwl-components/sort`.

const isMissing = (v) => v === null || typeof v === 'undefined' || v === '' || Number.isNaN(v);

/**
 * The value a column sorts by, as a number (numbers, dates) or a string.
 *
 * @param {Object} row A row.
 * @param {Object} column `{ key, type }`: `key` is the row's property (or a function
 *   `row => value`), `type` is `'string'` (default), `'number'` or `'date'`.
 * @returns {number|string|null} null when the value is missing (null, undefined, '', NaN)
 *   or can't be read as the column's type.
 */
export const sortValue = (row, { key, type = 'string' }) => {
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
 * The rows sorted by one column, as a new array (the input is never mutated).
 * Stable (equal values keep their order); missing values last in both directions;
 * strings compare with localeCompare, numbers and dates numerically.
 *
 * @param {Array} rows The rows.
 * @param {Object} column `{ key, type }`, as for sortValue.
 * @param {boolean} [ascending=true] The direction.
 * @returns {Array} A new, sorted array.
 */
export const sortRows = (rows, column, ascending = true) => {
  const list = rows || [];
  if (!column) { return [...list]; }
  const dir = ascending ? 1 : -1;
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
};

/**
 * The sort after a click on a column header, as in useSortable: a new column sorts
 * ascending, the current column reverses.
 *
 * @param {Object} state `{ column, ascending }` (column null: no sort yet).
 * @param {string} clicked The clicked column.
 * @returns {Object} The new `{ column, ascending }`.
 */
export const nextSort = ({ column, ascending }, clicked) => (column === clicked
  ? { column, ascending: !ascending }
  : { column: clicked, ascending: true });

/**
 * The value of a header's aria-sort.
 *
 * @param {string} direction `'ascending'`, `'descending'` or anything else (`'none'`).
 * @returns {string} `'ascending'`, `'descending'` or `'none'`.
 */
export const ariaSort = (direction) => (direction === 'ascending' || direction === 'descending' ? direction : 'none');

// Icons: Tabler Icons (MIT, https://tabler.io/icons): arrow-up, arrow-down, arrows-sort.
export const SORT_ICON_PATHS = {
  ascending: ['M12 5l0 14', 'M18 11l-6 -6', 'M6 11l6 -6'],
  descending: ['M12 5l0 14', 'M18 13l-6 6', 'M6 13l6 6'],
  none: ['M3 9l4 -4l4 4m-4 -4v14', 'M21 15l-4 4l-4 -4m4 4v-14']
};
export const SORT_ICON_ATTRS = {
  class: 'nwl-sort-indicator',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  'aria-hidden': 'true',
  focusable: 'false'
};

/**
 * The sort icon of a header, as an SVG string (the same as SortableTh's).
 *
 * @param {string} direction `'ascending'`, `'descending'` or `'none'`.
 * @returns {string} `<svg class="nwl-sort-indicator" data-state="…">…</svg>`
 */
export const renderSortIcon = (direction) => {
  const dir = ariaSort(direction);
  const attrs = Object.entries({ ...SORT_ICON_ATTRS, 'data-state': dir })
    .map(([name, value]) => `${name}="${value}"`)
    .join(' ');
  const paths = SORT_ICON_PATHS[dir].map((d) => `<path d="${d}"></path>`).join('');

  return `<svg ${attrs}>${paths}</svg>`;
};

// the header's button: the th's former content as the label, then the icon
const sortButton = (th, direction) => {
  const doc = th.ownerDocument;
  const label = doc.createElement('span');
  label.className = 'nwl-sort-label';
  label.append(...th.childNodes);
  const button = doc.createElement('button');
  button.type = 'button';
  button.className = 'nwl-sort-button';
  button.append(label);
  button.insertAdjacentHTML('beforeend', renderSortIcon(direction));

  return button;
};

/**
 * Makes a plain `<th>` a sortable header, with the same markup as SortableTh:
 * `<th class="nwl-sortable" aria-sort>` holding an unstyled `<button type="button">`
 * (focusable; Enter and Space click it) with the th's former content and the sort icon.
 * The look comes from `nwl-components/dist/style.css`.
 *
 * @param {HTMLTableCellElement} th The header cell; its content becomes the label.
 * @param {Object} [options] `{ direction, onSort }`: the initial direction (default `'none'`),
 *   and the function called (with the click event) when the header is clicked or activated
 *   from the keyboard.
 * @returns {Object} `{ th, button, setDirection(direction) }`, to update aria-sort and the icon.
 */
export const sortableHeader = (th, { direction = 'none', onSort } = {}) => {
  const button = sortButton(th, direction);
  th.classList.add('nwl-sortable');
  th.setAttribute('aria-sort', ariaSort(direction));
  th.append(button);
  if (onSort) { button.addEventListener('click', onSort); }

  const setDirection = (dir) => {
    th.setAttribute('aria-sort', ariaSort(dir));
    button.querySelector('svg.nwl-sort-indicator').remove();
    button.insertAdjacentHTML('beforeend', renderSortIcon(dir));
  };

  return { th, button, setDirection };
};
