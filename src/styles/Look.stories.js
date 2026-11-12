import { expect, userEvent, within } from '@storybook/test';
import { ref } from 'vue';

import Button from '@/components/common/Button.vue';
import SortableTh from '@/components/common/SortableTh.vue';
import Table from '@/components/common/Table.vue';
import { useSortable } from '@/components/common/useSortable.js';
import Footer from '@/components/layout/Footer.vue';
import Header from '@/components/layout/Header.vue';
import OntologySelector from '@/components/project/OntologySelector.vue';
import Access from '@/components/settings/Access.vue';

// The look of a few representative components, read with getComputedStyle (no screenshots).
// The expected values were recorded on 1.7.1 (78fce04), before the library's CSS read the
// design tokens (src/styles/tokens.css): moving the literals into tokens must change none of
// them. A wrong token value, or a var() whose token is missing, fails these checks.
export default {
  title: 'Library/Look'
};

const props = ['backgroundColor', 'color', 'borderTopColor', 'borderRadius', 'fontFamily', 'fontSize', 'fontWeight'];
const look = (el) => Object.fromEntries(props.map((p) => [p, getComputedStyle(el)[p]]));
const checkLook = async (elements, expected) => {
  const actual = Object.fromEntries(Object.entries(elements).map(([name, el]) => [name, look(el)]));
  // the message names every value that differs
  const diff = Object.keys(actual).flatMap((name) => props
    .filter((p) => actual[name][p] !== expected[name][p])
    .map((p) => `${name}.${p}: ${actual[name][p]} (expected ${expected[name][p]})`));
  await expect(diff.join('; ')).toBe('');
};

// the font stacks and colours of 1.7.1
const body = '"Lucida Grande", "Lucida Sans Unicode", Helvetica, Arial, Verdana, sans-serif';
const white = 'rgb(255, 255, 255)';
const none = 'rgba(0, 0, 0, 0)';

// buttons keep the browser's font family (they don't inherit it): Arial in the test browser
export const Buttons = () => ({
  components: { Button },
  template: `
  <div>
    <Button>Plain</Button>
    <Button class-name="push-button">Push</Button>
  </div>`
});
Buttons.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await checkLook({
    app: canvasElement.querySelector('.app'),
    button: canvas.getByRole('button', { name: 'Plain' }),
    pushButton: canvas.getByRole('button', { name: 'Push' })
  }, {
    app: { backgroundColor: 'rgb(34, 34, 34)', color: white, borderTopColor: white, borderRadius: '0px', fontFamily: body, fontSize: '14px', fontWeight: '400' },
    button: { backgroundColor: none, color: white, borderTopColor: 'rgb(119, 119, 119)', borderRadius: '3px', fontFamily: 'Arial', fontSize: '14px', fontWeight: '400' },
    pushButton: { backgroundColor: none, color: 'rgb(221, 221, 221)', borderTopColor: 'rgb(221, 221, 221)', borderRadius: '6px', fontFamily: 'Arial', fontSize: '14px', fontWeight: '700' }
  });
};

const rows = [
  { name: 'Brain atlas', owner: 'katja' },
  { name: 'axolotl', owner: 'roberto' }
];

export const TableCells = () => ({
  components: { Table },
  setup () {
    return { rows };
  },
  template: `
  <Table>
    <thead><tr><th>Name</th><th>Owner</th></tr></thead>
    <tbody>
      <tr v-for="(r, i) in rows" :class="{ selected: i === 1 }"><td>{{ r.name }}</td><td>{{ r.owner }}</td></tr>
    </tbody>
  </Table>`
});
TableCells.play = async ({ canvasElement }) => {
  await checkLook({
    th: canvasElement.querySelector('th'),
    td: canvasElement.querySelector('td'),
    tbody: canvasElement.querySelector('tbody'),
    selectedRow: canvasElement.querySelector('tr.selected')
  }, {
    th: { backgroundColor: none, color: white, borderTopColor: white, borderRadius: '0px', fontFamily: body, fontSize: '14px', fontWeight: '700' },
    td: { backgroundColor: none, color: white, borderTopColor: white, borderRadius: '0px', fontFamily: body, fontSize: '14px', fontWeight: '400' },
    tbody: { backgroundColor: none, color: white, borderTopColor: white, borderRadius: '0px', fontFamily: body, fontSize: '14px', fontWeight: '400' },
    selectedRow: { backgroundColor: 'rgb(68, 68, 68)', color: white, borderTopColor: white, borderRadius: '0px', fontFamily: body, fontSize: '14px', fontWeight: '400' }
  });
  // the line under the header and under the body
  await expect(getComputedStyle(canvasElement.querySelector('tbody')).borderBottomColor).toBe(white);
};

// an access cell as on the settings page: a collaborator's row in a Table
export const AccessCell = () => ({
  components: { Table, Access },
  setup () {
    return {
      collaborator: {
        username: 'anyone',
        access: { collaborators: 'view', annotations: 'edit', files: 'view' },
        name: 'Any User'
      }
    };
  },
  template: `
  <Table>
    <tbody><tr><td>Any User</td><td><Access :collaborator="collaborator" type="annotations" /></td></tr></tbody>
  </Table>`
});
AccessCell.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await checkLook({
    cell: canvasElement.querySelector('.access').closest('td'),
    button: canvas.getByTitle('edit annotations')
  }, {
    cell: { backgroundColor: none, color: white, borderTopColor: white, borderRadius: '0px', fontFamily: body, fontSize: '14px', fontWeight: '400' },
    button: { backgroundColor: none, color: white, borderTopColor: white, borderRadius: '50%', fontFamily: 'Arial', fontSize: '14px', fontWeight: '400' }
  });
};

export const SortableHeader = () => ({
  components: { Table, SortableTh },
  setup () {
    const sort = useSortable(ref(rows), { Name: { key: 'name' }, Owner: { key: 'owner' } });

    return { sort, sorted: sort.sortedRows };
  },
  template: `
  <Table>
    <thead><tr><sortable-th :sort="sort" column="Name" /><sortable-th :sort="sort" column="Owner" /></tr></thead>
    <tbody><tr v-for="r in sorted" :key="r.name"><td>{{ r.name }}</td><td>{{ r.owner }}</td></tr></tbody>
  </Table>`
});
SortableHeader.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const nameButton = canvas.getByRole('button', { name: 'Name' });
  const ownerButton = canvas.getByRole('button', { name: 'Owner' });
  const indicator = (b) => b.querySelector('.nwl-sort-indicator');
  await userEvent.click(nameButton);
  // keyboard focus on Owner: the unsorted icon turns brighter (as on hover)
  await userEvent.tab();
  await expect(ownerButton).toHaveFocus();
  await checkLook({
    th: nameButton.closest('th'),
    button: nameButton,
    sortedIcon: indicator(nameButton),
    focusedIcon: indicator(ownerButton)
  }, {
    th: { backgroundColor: none, color: white, borderTopColor: white, borderRadius: '0px', fontFamily: body, fontSize: '14px', fontWeight: '700' },
    button: { backgroundColor: none, color: white, borderTopColor: white, borderRadius: '0px', fontFamily: body, fontSize: '14px', fontWeight: '700' },
    sortedIcon: { backgroundColor: none, color: white, borderTopColor: white, borderRadius: '0px', fontFamily: body, fontSize: '14px', fontWeight: '700' },
    focusedIcon: { backgroundColor: none, color: 'rgb(187, 187, 187)', borderTopColor: 'rgb(187, 187, 187)', borderRadius: '0px', fontFamily: body, fontSize: '14px', fontWeight: '700' }
  });
  await userEvent.tab();
  await expect(getComputedStyle(indicator(ownerButton)).color).toBe('rgb(122, 122, 122)');
};

export const OntologyPanel = () => ({
  components: { OntologySelector },
  setup () {
    return {
      ontology: {
        name: 'Two labels',
        labels: [
          { name: 'Left olfactory nerve', value: 1, color: [111, 36, 211] },
          { name: 'Right olfactory nerve', value: 2, color: [34, 151, 51] }
        ]
      }
    };
  },
  template: '<OntologySelector :ontology="ontology" :open="true" />'
});
OntologyPanel.play = async ({ canvasElement }) => {
  const panel = canvasElement.querySelector('.labelset');
  await checkLook({
    panel,
    header: panel.querySelector('.header'),
    labelName: panel.querySelector('.label-name')
  }, {
    panel: { backgroundColor: 'rgba(0, 0, 0, 0.8)', color: white, borderTopColor: 'rgb(119, 119, 119)', borderRadius: '0px', fontFamily: body, fontSize: '11.2px', fontWeight: '400' },
    header: { backgroundColor: 'rgb(102, 102, 102)', color: white, borderTopColor: white, borderRadius: '0px', fontFamily: body, fontSize: '14px', fontWeight: '400' },
    labelName: { backgroundColor: none, color: white, borderTopColor: white, borderRadius: '0px', fontFamily: body, fontSize: '14px', fontWeight: '400' }
  });
};

// the wordmark (Roboto 100), an empty title's placeholder, and the footer
export const HeaderAndFooter = () => ({
  components: { Header, Footer },
  template: `
  <div>
    <Header><span class="title">BrainBox</span><span class="title empty" placeholder="Project name"></span></Header>
    <Footer />
  </div>`
});
HeaderAndFooter.play = async ({ canvasElement }) => {
  const [title, empty] = canvasElement.querySelectorAll('.title');
  await checkLook({
    title,
    footer: canvasElement.querySelector('footer')
  }, {
    title: { backgroundColor: none, color: white, borderTopColor: white, borderRadius: '0px', fontFamily: 'Roboto, sans-serif', fontSize: '36px', fontWeight: '100' },
    footer: { backgroundColor: 'rgb(0, 0, 0)', color: white, borderTopColor: white, borderRadius: '0px', fontFamily: body, fontSize: '14px', fontWeight: '400' }
  });
  await expect(getComputedStyle(empty, '::before').color).toBe('rgba(255, 255, 255, 0.4)');
};
