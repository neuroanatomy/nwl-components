import { expect, userEvent, waitFor, within } from '@storybook/test';
import { onMounted, ref } from 'vue';

import {
  nextSort, renderSortIcon, sortRows, sortableHeader
} from '@/components/common/sort.js';
import sortableCss from '@/components/common/sortable.css?raw';
import SortableTh from '@/components/common/SortableTh.vue';
import { useSortable } from '@/components/common/useSortable.js';

// Sorting a table built without Vue (template strings and DOM, as BrainBox's project and
// MRI pages), with only the helpers of `nwl-components/sort`. Vue only hosts the story:
// the table itself is made by buildPlainTable below. The plain tables live in a shadow root
// whose only stylesheet is sortable.css, shipped as `nwl-components/sort/style.css`: neither
// the storybook page's styles nor dist/style.css reach them.
export default {
  title: 'Common/PlainSort'
};

// Rows with a label (not sortable) and three sortable columns. Missing values: '', null,
// a missing key, a size that is not a number, a date that is not a date. Equal values
// (sizes 2 and 10, the two 2026-03-01 dates) show that the sort is stable.
const items = [
  { id: 'r1', name: 'beta', size: 10, date: '2026-03-01' },
  { id: 'r2', name: 'Alpha', size: '', date: null },
  { id: 'r3', name: 'gamma', size: 2, date: '2025-01-01' },
  { id: 'r4', name: 'delta', size: 10, date: 'not a date' },
  { id: 'r5', name: '', size: 'abc', date: '2026-01-01' },
  { id: 'r6', name: 'epsilon', size: 2, date: new Date('2026-03-01') }
];
const initialOrder = items.map((r) => r.id);
const columns = {
  Name: { key: 'name' },
  Size: { key: 'size', type: 'number' },
  Date: { key: 'date', type: 'date' }
};

// a shadow root on host holding only sortable.css, and a container inside it
const plainPage = (host) => {
  const root = host.attachShadow({ mode: 'open' });
  root.innerHTML = `<style>${sortableCss}</style><div></div>`;

  return root.querySelector('div');
};
const shadowOf = (canvasElement) => canvasElement.querySelector('.plain-host').shadowRoot;

// What an app's plain page would write: a table from strings, then the helpers.
const buildPlainTable = (container, rows) => {
  container.innerHTML = `<table class="plain">
    <thead><tr><th>Id</th>${Object.keys(columns).map((name) => `<th>${name}</th>`)
    .join('')}</tr></thead>
    <tbody></tbody>
  </table>`;
  const tbody = container.querySelector('tbody');
  let state = { column: null, ascending: true };
  const headers = {};
  const render = () => {
    const sorted = state.column ? sortRows(rows, columns[state.column], state.ascending) : rows;
    tbody.innerHTML = sorted.map((r) => `<tr><td>${r.id}</td><td>${r.name}</td><td>${r.size}</td><td>${r.date}</td></tr>`).join('');
    Object.entries(headers).forEach(([name, header]) => {
      let dir = 'none';
      if (name === state.column) { dir = state.ascending ? 'ascending' : 'descending'; }
      header.setDirection(dir);
    });
  };
  [...container.querySelectorAll('th')].slice(1).forEach((th) => {
    const name = th.textContent;
    headers[name] = sortableHeader(th, {
      onSort: () => {
        state = nextSort(state, name);
        render();
      }
    });
  });
  render();
};

export const PlainTable = () => ({
  setup () {
    const host = ref(null);
    onMounted(() => buildPlainTable(plainPage(host.value), items));

    return { host };
  },
  template: '<div ref="host" class="plain-host"></div>'
});

const ids = (root) => [...root.querySelectorAll('tbody tr')].map((tr) => tr.cells[0].textContent);
const ariaSorts = (root) => [...root.querySelectorAll('th')].map((th) => th.getAttribute('aria-sort'));
const iconStates = (root) => [...root.querySelectorAll('th svg.nwl-sort-indicator')].map((svg) => svg.dataset.state);

// rows in this order, headers with these aria-sort values (Name, Size, Date) and matching icons
const expectState = async (root, order, sorts) => {
  await waitFor(() => expect(ids(root)).toEqual(order));
  await expect(ariaSorts(root)).toEqual([null, ...sorts]);
  await expect(iconStates(root)).toEqual(sorts);
};
const buttonOf = (root) => (name) => within(root).getByRole('button', { name });

// strings: localeCompare, the missing name last in both directions
const sortStrings = async (root) => {
  const button = buttonOf(root);
  await userEvent.click(button('Name'));
  await expectState(root, ['r2', 'r1', 'r4', 'r6', 'r3', 'r5'], ['ascending', 'none', 'none']);
  await userEvent.click(button('Name'));
  await expectState(root, ['r3', 'r6', 'r4', 'r1', 'r2', 'r5'], ['descending', 'none', 'none']);
};

// keyboard: each header button is in the tab order (user-event's Tab doesn't enter shadow
// roots, so it is focused directly); Enter sorts a new column ascending, Space reverses.
// Numbers: 2 < 10, equal sizes keep their order (stable) both ways, '' and 'abc' last.
const focusHeader = async (root, name) => {
  const b = buttonOf(root)(name);
  await expect(b.tabIndex).toBe(0);
  b.focus();
  await expect(root.activeElement).toBe(b);
};
const sortNumbers = async (root) => {
  await focusHeader(root, 'Size');
  await userEvent.keyboard('{Enter}');
  await expectState(root, ['r3', 'r6', 'r1', 'r4', 'r2', 'r5'], ['none', 'ascending', 'none']);
  await userEvent.keyboard(' ');
  await expectState(root, ['r1', 'r4', 'r3', 'r6', 'r2', 'r5'], ['none', 'descending', 'none']);
};

// dates: strings and Date objects alike, equal dates stable, null and 'not a date' last
const sortDates = async (root) => {
  await focusHeader(root, 'Date');
  await userEvent.keyboard('{Enter}');
  await expectState(root, ['r3', 'r5', 'r1', 'r6', 'r2', 'r4'], ['none', 'none', 'ascending']);
  await userEvent.keyboard('{Enter}');
  await expectState(root, ['r1', 'r6', 'r5', 'r3', 'r2', 'r4'], ['none', 'none', 'descending']);
};

// sortRows returns a new array and never mutates its input; key functions; default ascending
const sortRowsItself = async () => {
  const copy = [...items];
  await expect(sortRows(items, columns.Size, true)).not.toBe(items);
  await expect(items).toEqual(copy);
  await expect(sortRows(items, null)).toEqual(items);
  await expect(sortRows(items, null)).not.toBe(items);
  const byNumber = sortRows(items, { key: (r) => r.id.slice(1), type: 'number' }).map((r) => r.id);
  await expect(byNumber).toEqual(initialOrder);
  await expect(sortRows(items, { key: 'id' }, false).map((r) => r.id)).toEqual([...initialOrder].reverse());
};

PlainTable.play = async ({ canvasElement }) => {
  const root = shadowOf(canvasElement);
  // the page's only stylesheet: header rules alone, nothing global
  const selectors = [...root.styleSheets[0].cssRules].flatMap((r) => r.selectorText.split(',').map((x) => x.trim()));
  await expect(selectors.length).toBeGreaterThan(5);
  await expect(selectors.filter((x) => !(/^(th\.nwl-sortable|\.nwl-sort-)/).test(x))).toEqual([]);
  // before any click: rows as given; the label column stays a plain th
  await expectState(root, initialOrder, ['none', 'none', 'none']);
  await expect([...root.querySelectorAll('th button')].map((b) => [b.type, b.className, b.textContent]))
    .toEqual(['Name', 'Size', 'Date'].map((n) => ['button', 'nwl-sort-button', n]));
  await sortStrings(root);
  await sortNumbers(root);
  await sortDates(root);
  await sortRowsItself();
};

// The header made by sortableHeader() is SortableTh's header: same th and button, same svg
// (attributes and paths) in each state, same computed look.
const describe = (th) => {
  const svg = th.querySelector('svg');
  const attrs = (el) => [...el.attributes].map((a) => [a.name, a.value])
    .filter(([name]) => !name.startsWith('data-v-'))
    .sort(([a], [b]) => a.localeCompare(b));
  const button = th.querySelector('button');
  const style = (el, props) => props.map((p) => getComputedStyle(el)[p]);

  return {
    th: [th.className, th.getAttribute('aria-sort'), ...style(th, ['paddingTop', 'paddingRight', 'paddingBottom'])],
    button: [
      button.type, button.className, [...button.children].map((c) => c.getAttribute('class')),
      ...style(button, ['display', 'paddingTop', 'whiteSpace', 'cursor', 'backgroundColor', 'borderTopWidth', 'gap'])
    ],
    svg: attrs(svg),
    paths: [...svg.querySelectorAll('path')].map((p) => p.getAttribute('d')),
    look: style(svg, ['width', 'height', 'color'])
  };
};

export const SameAsSortableTh = () => ({
  components: { SortableTh },
  setup () {
    const rows = ref([]);
    const cols = { A: { key: 'a' }, B: { key: 'b' } };
    const asc = useSortable(rows, cols, { column: 'A', ascending: true });
    const desc = useSortable(rows, cols, { column: 'A', ascending: false });
    const plain = ref(null);
    onMounted(() => {
      const page = plainPage(plain.value);
      page.innerHTML = '<table class="plain"><thead><tr><th>A</th><th>A</th><th>B</th></tr></thead></table>';
      const [a, b, c] = page.querySelectorAll('th');
      sortableHeader(a, { direction: 'ascending' });
      sortableHeader(b, { direction: 'descending' });
      sortableHeader(c);
    });

    return { asc, desc, plain };
  },
  template: `
  <table class="vue"><thead><tr>
    <sortable-th :sort="asc" column="A" />
    <sortable-th :sort="desc" column="A" />
    <sortable-th :sort="asc" column="B" />
  </tr></thead></table>
  <div class="plain-host" ref="plain"></div>`
});
SameAsSortableTh.play = async ({ canvasElement }) => {
  const vue = [...canvasElement.querySelectorAll('table.vue th')].map(describe);
  const plain = [...shadowOf(canvasElement).querySelectorAll('table.plain th')].map(describe);
  await expect(vue.map((d) => d.th[1])).toEqual(['ascending', 'descending', 'none']);
  await expect(vue.map((d) => d.paths.length)).toEqual([3, 3, 2]);
  await expect(plain).toEqual(vue);
  // renderSortIcon is the same svg, for template strings
  const parsed = (html) => {
    const th = document.createElement('th');
    th.innerHTML = `<button>${html}</button>`;

    return th;
  };
  const icons = ['ascending', 'descending', 'none'].map((dir) => {
    const d = describe(parsed(renderSortIcon(dir)));

    return [d.svg, d.paths];
  });
  await expect(icons).toEqual(vue.map((d) => [d.svg, d.paths]));
  // setDirection() swaps the icon and aria-sort, as SortableTh does when the sort changes
  const th = document.createElement('th');
  th.textContent = 'B';
  const header = sortableHeader(th);
  header.setDirection('descending');
  await expect([th.getAttribute('aria-sort'), th.querySelectorAll('svg').length, describe(th).paths])
    .toEqual(['descending', 1, vue[1].paths]);
  await expect(describe(th).svg).toEqual(vue[1].svg);
};

// Natural order for strings (1.6.1): numbers inside names compare as numbers, in both
// directions, in the plain table and in a Vue table with useSortable + SortableTh alike;
// plain words keep their localeCompare order.
const naturalItems = [
  { id: 'n1', name: 'Macaque E120', size: 1, date: '2026-01-01' },
  { id: 'n2', name: 'file10', size: 1, date: '2026-01-01' },
  { id: 'n3', name: 'Macaque E70', size: 1, date: '2026-01-01' },
  { id: 'n4', name: 'beta', size: 1, date: '2026-01-01' },
  { id: 'n5', name: 'Macaque E90', size: 1, date: '2026-01-01' },
  { id: 'n6', name: 'file2', size: 1, date: '2026-01-01' },
  { id: 'n7', name: 'Alpha', size: 1, date: '2026-01-01' }
];
const naturalAscending = ['Alpha', 'beta', 'file2', 'file10', 'Macaque E70', 'Macaque E90', 'Macaque E120'];

export const NaturalOrder = () => ({
  components: { SortableTh },
  setup () {
    const host = ref(null);
    const sort = useSortable(ref(naturalItems), columns);
    onMounted(() => buildPlainTable(plainPage(host.value), naturalItems));

    return { host, sort, rows: sort.sortedRows };
  },
  template: `
  <table class="vue">
    <thead><tr><th>Id</th><sortable-th :sort="sort" column="Name" /></tr></thead>
    <tbody><tr v-for="r in rows" :key="r.id"><td>{{ r.id }}</td><td>{{ r.name }}</td></tr></tbody>
  </table>
  <div ref="host" class="plain-host"></div>`
});
const namesIn = (root) => [...root.querySelectorAll('tbody tr')].map((tr) => tr.cells[1].textContent);
NaturalOrder.play = async ({ canvasElement }) => {
  const root = shadowOf(canvasElement);
  const vue = canvasElement.querySelector('table.vue');
  const clickBoth = async () => {
    await userEvent.click(within(vue).getByRole('button', { name: 'Name' }));
    await userEvent.click(buttonOf(root)('Name'));
  };
  await clickBoth();
  await waitFor(() => expect(namesIn(vue)).toEqual(naturalAscending));
  await expect(namesIn(root)).toEqual(naturalAscending);
  await clickBoth();
  await waitFor(() => expect(namesIn(vue)).toEqual([...naturalAscending].reverse()));
  await expect(namesIn(root)).toEqual([...naturalAscending].reverse());
  // sortRows itself, with missing names still last both ways
  const withMissing = [...naturalItems, { id: 'n8', name: '' }];
  await expect(sortRows(withMissing, columns.Name).map((r) => r.name)).toEqual([...naturalAscending, '']);
  await expect(sortRows(withMissing, columns.Name, false).map((r) => r.name)).toEqual([...naturalAscending].reverse().concat(''));
};
