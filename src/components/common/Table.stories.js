import { expect, userEvent, waitFor, within } from '@storybook/test';
import { ref } from 'vue';

import SortableTh from '@/components/common/SortableTh.vue';
import Table from '@/components/common/Table.vue';
import { useSortable } from '@/components/common/useSortable.js';

export default {
  title: 'Common/Table',
  component: Table
};

// BrainBox's user-page project list: five columns, one row with no file count,
// one with no modification date (missing values sort last in both directions).
const projects = [
  { project: 'Brain atlas', numFiles: 12, numCollaborators: 3, owner: 'katja', modified: '2026-09-01T10:00:00Z' },
  { project: 'axolotl', numFiles: 2, numCollaborators: 0, owner: 'roberto', modified: '2026-10-20T08:00:00Z' },
  { project: 'Cerebellum', numCollaborators: 10, owner: 'nicolas', modified: '2025-12-31T23:00:00Z' },
  { project: 'ferret', numFiles: 100, numCollaborators: 1, owner: 'Alice', modified: null }
];
const initialOrder = projects.map((p) => p.project);
const columnNames = ['Name', 'Files', 'Collaborators', 'Owner', 'Last modified'];

export const Plain = () => ({
  components: { Table },
  setup () {
    return { projects };
  },
  template: `
  <Table>
    <thead>
      <tr><th>Name</th><th>Files</th><th>Collaborators</th><th>Owner</th><th>Last modified</th></tr>
    </thead>
    <tbody>
      <tr v-for="p in projects">
        <td>{{ p.project }}</td><td>{{ p.numFiles }}</td><td>{{ p.numCollaborators }}</td>
        <td>{{ p.owner }}</td><td>{{ p.modified }}</td>
      </tr>
    </tbody>
  </Table>`
});
Plain.play = async ({ canvasElement }) => {
  // headers without sorting stay plain: no button, no indicator, no aria-sort
  await expect(canvasElement.querySelectorAll('th').length).toBe(5);
  await expect(canvasElement.querySelectorAll('th button, th [aria-sort], .nwl-sort-indicator').length).toBe(0);
};

const SortableTemplate = () => ({
  components: { Table, SortableTh },
  setup () {
    const rows = ref(projects);
    const sort = useSortable(rows, {
      Name: { key: 'project' },
      Files: { key: 'numFiles', type: 'number' },
      Collaborators: { key: 'numCollaborators', type: 'number' },
      Owner: { key: 'owner' },
      'Last modified': { key: 'modified', type: 'date' }
    });

    return { sort, sortedProjects: sort.sortedRows };
  },
  // written as the apps write their in-DOM/Mustache templates
  template: `
  <Table>
    <thead>
      <tr>
        <sortable-th :sort="sort" column="Name">Name</sortable-th>
        <sortable-th :sort="sort" column="Files">Files</sortable-th>
        <sortable-th :sort="sort" column="Collaborators">Collaborators</sortable-th>
        <sortable-th :sort="sort" column="Owner">Owner</sortable-th>
        <sortable-th :sort="sort" column="Last modified">Last modified</sortable-th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="p in sortedProjects" :key="p.project">
        <td>{{ p.project }}</td><td>{{ p.numFiles }}</td><td>{{ p.numCollaborators }}</td>
        <td>{{ p.owner }}</td><td>{{ p.modified ? p.modified.slice(0, 10) : '' }}</td>
      </tr>
    </tbody>
  </Table>`
});

const names = (canvasElement) => [...canvasElement.querySelectorAll('tbody tr')].map((tr) => tr.cells[0].textContent.trim());
const button = (canvas, name) => canvas.getByRole('button', { name });
const header = (canvas, name) => button(canvas, name).closest('th');
const ariaSorts = (canvasElement) => [...canvasElement.querySelectorAll('th')].map((th) => th.getAttribute('aria-sort'));
// which icon a header shows ('none': the neutral sort icon, or 'ascending'/'descending': one arrow),
// with its colour and its number of strokes
const icon = (canvas, name) => {
  const svg = header(canvas, name).querySelector('svg.nwl-sort-indicator');

  return { state: svg.dataset.state, color: getComputedStyle(svg).color, paths: svg.querySelectorAll('path').length };
};
const grey = 'rgb(122, 122, 122)';
const frame = () => new Promise((resolve) => { requestAnimationFrame(() => resolve()); });

// for each sortable header: is there a visible indicator inside the button, all on one line?
const indicatorFacts = (canvas, name) => {
  const b = button(canvas, name);
  const indicator = header(canvas, name).querySelector('.nwl-sort-indicator');
  if (!indicator) { return { name, indicator: false }; }
  const box = indicator.getBoundingClientRect();
  const style = getComputedStyle(indicator);

  return {
    name,
    indicator: true,
    inButton: b.contains(indicator),
    hasSize: box.width > 4 && box.height > 4,
    visible: style.visibility === 'visible' && Number(style.opacity) > 0,
    oneLine: b.getClientRects().length === 1 && getComputedStyle(b).whiteSpace === 'nowrap'
  };
};

export const Sortable = SortableTemplate.bind({});
Sortable.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  // before any click: rows in their original order, every column sortable and showing an indicator
  await expect(names(canvasElement)).toEqual(initialOrder);
  await expect(ariaSorts(canvasElement)).toEqual(['none', 'none', 'none', 'none', 'none']);
  await expect(columnNames.map((name) => indicatorFacts(canvas, name))).toEqual(columnNames.map((name) => ({
    name, indicator: true, inButton: true, hasSize: true, visible: true, oneLine: true
  })));
  await expect(columnNames.map((name) => icon(canvas, name).state)).toEqual(['none', 'none', 'none', 'none', 'none']);
  await expect(icon(canvas, 'Owner').color).toBe(grey);
  // brighter when the header is focused with the keyboard (same rule as :hover, which
  // synthetic pointer events can't trigger)
  button(canvas, 'Collaborators').focus();
  await userEvent.tab();
  await expect(document.activeElement).toBe(button(canvas, 'Owner'));
  await expect(icon(canvas, 'Owner').color).toBe('rgb(187, 187, 187)');
  button(canvas, 'Owner').blur();
  // the button looks like the header text, and the header like something to click
  const [ts, bs] = [getComputedStyle(header(canvas, 'Name')), getComputedStyle(button(canvas, 'Name'))];
  await expect([bs.fontFamily, bs.fontSize, bs.fontWeight, bs.color]).toEqual([ts.fontFamily, ts.fontSize, ts.fontWeight, ts.color]);
  await expect([bs.backgroundColor, bs.borderTopWidth, bs.cursor]).toEqual(['rgba(0, 0, 0, 0)', '0px', 'pointer']);
};

export const ClickTwice = SortableTemplate.bind({});
ClickTwice.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  // numbers compare as numbers (2 < 12 < 100), the missing count is last
  await userEvent.click(button(canvas, 'Files'));
  await waitFor(() => expect(names(canvasElement)).toEqual(['axolotl', 'Brain atlas', 'ferret', 'Cerebellum']));
  await expect(ariaSorts(canvasElement)).toEqual(['none', 'ascending', 'none', 'none', 'none']);
  // one up arrow in the text colour; the other columns keep the grey sort icon
  const textColor = getComputedStyle(header(canvas, 'Files')).color;
  await expect(icon(canvas, 'Files')).toEqual({ state: 'ascending', color: textColor, paths: 3 });
  await expect(icon(canvas, 'Name')).toEqual({ state: 'none', color: grey, paths: 2 });
  // a second click reverses; the missing count stays last
  await userEvent.click(button(canvas, 'Files'));
  await waitFor(() => expect(names(canvasElement)).toEqual(['ferret', 'Brain atlas', 'axolotl', 'Cerebellum']));
  await expect(ariaSorts(canvasElement)).toEqual(['none', 'descending', 'none', 'none', 'none']);
  await expect(icon(canvas, 'Files')).toEqual({ state: 'descending', color: textColor, paths: 3 });
  await expect(icon(canvas, 'Name')).toEqual({ state: 'none', color: grey, paths: 2 });
  // the input array is never mutated
  await expect(projects.map((p) => p.project)).toEqual(initialOrder);
};

export const SwitchColumns = SortableTemplate.bind({});
SwitchColumns.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(button(canvas, 'Name'));
  await userEvent.click(button(canvas, 'Name'));
  await waitFor(() => expect(names(canvasElement)).toEqual(['ferret', 'Cerebellum', 'Brain atlas', 'axolotl']));
  // another column sorts ascending, whatever the previous direction
  await userEvent.click(button(canvas, 'Last modified'));
  await waitFor(() => expect(names(canvasElement)).toEqual(['Cerebellum', 'Brain atlas', 'axolotl', 'ferret']));
  await expect(ariaSorts(canvasElement)).toEqual(['none', 'none', 'none', 'none', 'ascending']);
  await userEvent.click(button(canvas, 'Last modified'));
  await waitFor(() => expect(names(canvasElement)).toEqual(['axolotl', 'Brain atlas', 'Cerebellum', 'ferret']));
  // strings with localeCompare
  await userEvent.click(button(canvas, 'Owner'));
  await waitFor(() => expect(names(canvasElement)).toEqual(['ferret', 'Brain atlas', 'Cerebellum', 'axolotl']));
  await expect(ariaSorts(canvasElement)).toEqual(['none', 'none', 'none', 'ascending', 'none']);
};

export const Keyboard = SortableTemplate.bind({});
Keyboard.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  // Tab reaches the header buttons in order
  button(canvas, 'Name').focus();
  await userEvent.tab();
  await expect(document.activeElement).toBe(button(canvas, 'Files'));
  await userEvent.keyboard('{Enter}');
  await waitFor(() => expect(names(canvasElement)).toEqual(['axolotl', 'Brain atlas', 'ferret', 'Cerebellum']));
  await userEvent.keyboard(' ');
  await waitFor(() => expect(names(canvasElement)).toEqual(['ferret', 'Brain atlas', 'axolotl', 'Cerebellum']));
  await expect(header(canvas, 'Files').getAttribute('aria-sort')).toBe('descending');
};

export const NoLayoutShift = SortableTemplate.bind({});
NoLayoutShift.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const rects = () => [...canvasElement.querySelectorAll('th, th button, th .nwl-sort-indicator, th .nwl-sort-label')]
    .map((el) => {
      const r = el.getBoundingClientRect();

      return [r.left, r.top, r.width, r.height];
    });
  const before = rects();
  await expect(before.length).toBe(4 * columnNames.length);
  // header positions and sizes are identical after each hover and click
  const unchangedAfter = async (action) => {
    await action();
    await frame();
    await expect(rects()).toEqual(before);
  };
  await unchangedAfter(() => userEvent.hover(button(canvas, 'Owner')));
  await unchangedAfter(() => {
    button(canvas, 'Collaborators').focus();

    return userEvent.tab();
  });
  await unchangedAfter(() => userEvent.click(button(canvas, 'Name')));
  await unchangedAfter(() => userEvent.click(button(canvas, 'Name')));
  await unchangedAfter(() => userEvent.click(button(canvas, 'Collaborators')));
  await unchangedAfter(() => userEvent.click(button(canvas, 'Last modified')));
  await unchangedAfter(() => userEvent.click(button(canvas, 'Last modified')));
  await unchangedAfter(() => userEvent.unhover(button(canvas, 'Last modified')));
  await expect(header(canvas, 'Last modified').getAttribute('aria-sort')).toBe('descending');
};

// Column spacing: every cell but the last of its row has 1em of right padding (14px at the
// default size), so columns never touch. The tables are given `width: auto` (shrink to fit)
// so that each column is exactly as wide as its widest content plus that padding; the gap
// between a column's widest content and the next column is then the padding itself.
const contentRight = (cell) => {
  const b = cell.querySelector('button');
  if (b) { return b.getBoundingClientRect().right; }
  const range = document.createRange();
  range.selectNodeContents(cell);

  return range.getBoundingClientRect().right;
};
const columnGaps = (canvasElement) => {
  const rows = [...canvasElement.querySelectorAll('tr')];
  const n = rows[0].cells.length;

  return [...Array(n).keys()].map((i) => {
    const widest = Math.max(...rows.map((tr) => contentRight(tr.cells[i])));
    const end = i < n - 1 ? rows[0].cells[i + 1].getBoundingClientRect().left : rows[0].cells[i].getBoundingClientRect().right;

    return Math.round(end - widest);
  });
};
const paddings = (canvasElement) => [...canvasElement.querySelectorAll('tr')]
  .map((tr) => [...tr.cells].map((c) => getComputedStyle(c).paddingRight));
const expectSpacing = async (canvasElement) => {
  const { fontSize } = getComputedStyle(canvasElement.querySelector('table'));
  await expect(fontSize).toBe('14px');
  await expect(columnGaps(canvasElement)).toEqual([14, 14, 14, 14, 0]);
  const rows = paddings(canvasElement);
  await expect(rows).toEqual(rows.map(() => ['14px', '14px', '14px', '14px', '0px']));
};
const shrinkToFit = (story) => () => {
  const s = story();

  return { ...s, template: s.template.replace('<Table>', '<Table style="width: auto">') };
};

export const ColumnSpacing = shrinkToFit(Plain);
ColumnSpacing.play = async ({ canvasElement }) => {
  await expectSpacing(canvasElement);
  // the vertical padding is unchanged
  const td = getComputedStyle(canvasElement.querySelector('td'));
  await expect([td.paddingTop, td.paddingBottom, td.paddingLeft]).toEqual(['2px', '2px', '0px']);
};

export const SortableColumnSpacing = shrinkToFit(SortableTemplate);
SortableColumnSpacing.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await expectSpacing(canvasElement);
  // the button fills the header's height and starts at its left edge, as in 1.5.0
  const th = header(canvas, 'Name').getBoundingClientRect();
  const b = button(canvas, 'Name').getBoundingClientRect();
  await expect(Math.round(b.left - th.left)).toBe(0);
  // still the same after sorting
  await userEvent.click(button(canvas, 'Files'));
  await frame();
  await expectSpacing(canvasElement);
};

// A private project with a long unbroken name (no spaces, no punctuation) in a 400 px wide
// panel: the table is never wider than its panel, the long body cell wraps, and the header
// cells, plain or sortable, stay on one line. Only the Name cells opt in to breaking inside
// a word, with `td.nwl-break-anywhere`; the other columns wrap at spaces only.
const longName = 'PrivateProjectWithAVeryLongUnbrokenNameThatNeverEnds01234567';
const longRows = [
  { project: longName, owner: 'katja', modified: '2026-09-01' },
  { project: 'axolotl', owner: 'roberto', modified: '2026-10-20' }
];
const narrow = (headers, rowsData = longRows) => () => ({
  components: { Table, SortableTh },
  setup () {
    const sort = useSortable(ref(rowsData), {
      Name: { key: 'project' }, Owner: { key: 'owner' }, 'Last modified': { key: 'modified', type: 'date' }
    });

    return { sort, rows: sort.sortedRows };
  },
  template: `
  <div class="panel" style="width: 400px">
    <Table>
      <thead><tr>${headers}</tr></thead>
      <tbody>
        <tr v-for="p in rows" :key="p.project"><td class="nwl-break-anywhere">{{ p.project }}</td><td>{{ p.owner }}</td><td>{{ p.modified }}</td></tr>
      </tbody>
    </Table>
  </div>`
});
// the distinct line tops of the text inside an element
const lineCount = (el) => {
  const tops = new Set();
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    if (!walker.currentNode.textContent.trim()) { continue; }
    const range = document.createRange();
    range.selectNodeContents(walker.currentNode);
    [...range.getClientRects()].forEach((r) => tops.add(Math.round(r.top)));
  }

  return tops.size;
};
const expectFitsPanel = async (canvasElement, { othersOneLine = true } = {}) => {
  await expect(longName.length).toBe(60);
  // only the opted-in Name cells may break inside a word
  await expect([...canvasElement.querySelectorAll('tbody tr')].map((tr) => [...tr.cells].map((td) => getComputedStyle(td).overflowWrap)))
    .toEqual([...canvasElement.querySelectorAll('tbody tr')].map(() => ['anywhere', 'normal', 'normal']));
  const panel = canvasElement.querySelector('.panel').getBoundingClientRect();
  const table = canvasElement.querySelector('table').getBoundingClientRect();
  await expect(Math.round(table.width)).toBeLessThanOrEqual(Math.round(panel.width));
  const longCell = [...canvasElement.querySelectorAll('td')].find((td) => td.textContent.trim() === longName);
  await expect(longCell.getBoundingClientRect().right).toBeLessThanOrEqual(table.right + 0.5);
  await expect(lineCount(longCell)).toBeGreaterThan(1);
  // every header stays on one line
  await expect([...canvasElement.querySelectorAll('th')].map(lineCount)).toEqual([1, 1, 1]);
  if (!othersOneLine) { return; }
  // so do the other body cells when, as with sortable headers, each header is wider than its cells
  await expect([...canvasElement.querySelectorAll('td')].filter((td) => td !== longCell).map(lineCount))
    .toEqual([1, 1, 1, 1, 1]);
};

// With plain headers a short cell wider than its header ("roberto" under "Owner") is not
// broken either: only the Name column shrinks below its longest word.
export const LongWordPlain = narrow('<th>Name</th><th>Owner</th><th>Last modified</th>');
LongWordPlain.play = async ({ canvasElement }) => {
  await expectFitsPanel(canvasElement);
};

// BrainBox's user page: a 16-character owner name, much wider than its "Owner" header,
// stays whole on one line; the long project name wraps instead.
const longOwner = 'danielemarinazzo';
export const LongWordOwner = narrow('<th>Name</th><th>Owner</th><th>Last modified</th>', [
  { project: longName, owner: longOwner, modified: '2026-09-01' },
  { project: 'axolotl', owner: longOwner, modified: '2026-10-20' }
]);
LongWordOwner.play = async ({ canvasElement }) => {
  await expect(longOwner.length).toBe(16);
  const ownerCells = [...canvasElement.querySelectorAll('td')].filter((td) => td.textContent.trim() === longOwner);
  await expect(ownerCells.length).toBe(2);
  await expect(ownerCells.map(lineCount)).toEqual([1, 1]);
  await expectFitsPanel(canvasElement);
};

export const LongWordSortable = narrow(`
        <sortable-th :sort="sort" column="Name">Name</sortable-th>
        <sortable-th :sort="sort" column="Owner">Owner</sortable-th>
        <sortable-th :sort="sort" column="Last modified">Last modified</sortable-th>`);
LongWordSortable.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await expectFitsPanel(canvasElement);
  // still fits after sorting
  await userEvent.click(button(canvas, 'Name'));
  await frame();
  await expectFitsPanel(canvasElement);
};
