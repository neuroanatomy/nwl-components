import { expect, userEvent, within } from '@storybook/test';
import { ref } from 'vue';

import Button from '@/components/common/Button.vue';
import Select from '@/components/common/Select.vue';
import SortableTh from '@/components/common/SortableTh.vue';
import Table from '@/components/common/Table.vue';
import TextInput from '@/components/common/TextInput.vue';
import { useSortable } from '@/components/common/useSortable.js';

// src/styles/base.css and the cascade layers (2.0.0), read with getComputedStyle (no
// screenshots). Every story is inside Wrapper (.storybook/preview.js), as on the apps' pages.
export default {
  title: 'Library/Base'
};

const white = 'rgb(255, 255, 255)';
const body = '"Lucida Grande", "Lucida Sans Unicode", Helvetica, Arial, Verdana, sans-serif';
// form controls keep the browser's font family, as in 1.x: Arial in the test browser
const controlFont = 'Arial';

// the message names every element and property that differs
const checkAll = async (elements, expected) => {
  const diff = Object.entries(elements).flatMap(([name, el]) => Object.entries(expected)
    .filter(([p, v]) => getComputedStyle(el)[p] !== v)
    .map(([p, v]) => `${name}.${p}: ${getComputedStyle(el)[p]} (expected ${v})`));
  await expect(diff.join('; ')).toBe('');
};

export const FormControls = () => ({
  components: { Button, Select, TextInput },
  setup () {
    return { choice: ref('a'), text: ref('') };
  },
  template: `
  <div>
    <p class="text">Text <span>in a span</span></p>
    <Button>Button</Button>
    <Select v-model="choice"><option value="a">A</option></Select>
    <TextInput v-model="text" />
    <button>plain button</button>
    <input class="plain-input">
    <select class="plain-select"><option>B</option></select>
    <textarea></textarea>
    <div class="red" style="color: rgb(255, 0, 0); font-size: 20px"><span>inherits</span><input class="red-input"></div>
  </div>`
});
FormControls.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const app = canvasElement.querySelector('.app');
  const q = (s) => canvasElement.querySelector(s);
  const controls = {
    button: canvas.getByRole('button', { name: 'Button' }),
    select: canvasElement.querySelectorAll('select')[0],
    textInput: q('input[type="text"]'),
    plainButton: canvas.getByRole('button', { name: 'plain button' }),
    plainInput: q('.plain-input'),
    plainSelect: q('.plain-select')
  };
  // inputs, buttons and selects compute 14px and white, as with 1.x's `*` rule
  await checkAll(controls, { fontSize: '14px', color: white, fontFamily: controlFont, boxSizing: 'border-box' });
  // a textarea keeps the browser's monospace font
  await checkAll({ textarea: q('textarea') }, { fontSize: '14px', color: white, fontFamily: 'monospace', boxSizing: 'border-box' });
  // text inherits the wrapper's font and colour
  await checkAll({ app, text: q('.text'), span: q('.text span') }, { fontSize: '14px', color: white, fontFamily: body, boxSizing: 'border-box' });
  // 1rem is 14px, as in 1.x
  await expect(getComputedStyle(document.documentElement).fontSize).toBe('14px');
  // no `*` rule: children inherit their parent's font size and colour, controls included
  await checkAll({ span: q('.red span'), input: q('.red-input') }, { color: 'rgb(255, 0, 0)', fontSize: '20px', boxSizing: 'border-box' });
};

// the library's CSS is in cascade layers: an unlayered rule of lower specificity wins
export const AppCssWins = () => ({
  components: { Button },
  template: `
  <div>
    <component is="style">button { border-radius: 9px } .app { color: rgb(0, 128, 0) }</component>
    <Button class-name="push-button">Push</Button>
  </div>`
});
AppCssWins.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const push = canvas.getByRole('button', { name: 'Push' });
  // Button's scoped `.push-button[data-v-…]` (6px) loses to the app's plain `button` selector
  await expect(getComputedStyle(push).borderTopLeftRadius).toBe('9px');
  // base.css's `.app` colour loses to the app's `.app`
  await expect(getComputedStyle(canvasElement.querySelector('.app')).color).toBe('rgb(0, 128, 0)');
  // the layer order: nwl.base < nwl.widgets < nwl.components (Button's own colour still wins over base.css)
  await expect(getComputedStyle(push).color).toBe('rgb(221, 221, 221)');
};

const rows = [{ name: 'Brain atlas', owner: 'katja' }, { name: 'axolotl', owner: 'roberto' }];

export const KeyboardFocus = () => ({
  components: { Select, SortableTh, Table, TextInput },
  setup () {
    const sort = useSortable(ref(rows), { Name: { key: 'name' }, Owner: { key: 'owner' } });

    return { sort, sorted: sort.sortedRows, choice: ref('a'), text: ref('') };
  },
  template: `
  <div>
    <Select v-model="choice"><option value="a">A</option><option value="b">B</option></Select>
    <TextInput v-model="text" />
    <button class="plain">plain</button>
    <Table>
      <thead><tr><sortable-th :sort="sort" column="Name" /><sortable-th :sort="sort" column="Owner" /></tr></thead>
      <tbody><tr v-for="r in sorted" :key="r.name"><td>{{ r.name }}</td><td>{{ r.owner }}</td></tr></tbody>
    </Table>
  </div>`
});
const outline = { outlineStyle: 'solid', outlineWidth: '2px', outlineColor: white, outlineOffset: '2px' };
const red = 'rgb(255, 0, 0)';
// Tab (or Shift+Tab) moves the focus to `el`, which shows the outline
const tabTo = async (el, label, { shift = false, color = white } = {}) => {
  await userEvent.tab({ shift });
  await expect(document.activeElement).toBe(el);
  await checkAll({ [label]: el }, { ...outline, outlineColor: color });
};

// the outline's colour is the --nwl-focus token: base.css's rule (Shift+Tab back from the
// sortable header) and the sortable header's own rule (sortable.css)
const focusToken = async (app, { select, input, plain, name }) => {
  app.style.setProperty('--nwl-focus', red);
  await tabTo(plain, 'plainButton', { shift: true, color: red });
  await tabTo(input, 'textInput', { shift: true, color: red });
  await tabTo(select, 'select', { shift: true, color: red });
  name.focus();
  await checkAll({ sortableHeader: name }, { ...outline, outlineColor: red });
  app.style.removeProperty('--nwl-focus');
};

KeyboardFocus.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const app = canvasElement.querySelector('.app');
  const select = canvasElement.querySelector('select');
  const input = canvasElement.querySelector('input');
  const plain = canvas.getByRole('button', { name: 'plain' });
  const name = canvas.getByRole('button', { name: 'Name' });
  // Tab through the select, the text field, a plain button and a sortable header
  await tabTo(select, 'select');
  await tabTo(input, 'textInput');
  await tabTo(plain, 'plainButton');
  await tabTo(name, 'sortableHeader');
  await focusToken(app, { select, input, plain, name });
  // once focus moves on, no outline
  await userEvent.tab();
  await expect(getComputedStyle(name).outlineStyle).toBe('none');
};

// focus by mouse: no outline on Button, a plain button and a sortable header. (Chromium, like
// for text fields, takes a click on a <select> for keyboard focus: Select shows the outline.) A play
// function's clicks are synthetic (the browser takes their focus for keyboard focus), so the
// test runner clicks with the real mouse: `parameters.mouseFocus` (.storybook/test-runner.js)
// lists the elements, and each must be focused, not :focus-visible, with no outline.
export const MouseFocus = () => ({
  components: { Button, SortableTh, Table },
  setup () {
    const sort = useSortable(ref(rows), { Name: { key: 'name' } });

    return { sort, sorted: sort.sortedRows };
  },
  template: `
  <div>
    <Button class-name="lib-button">Button</Button>
    <button class="plain">plain</button>
    <Table>
      <thead><tr><sortable-th :sort="sort" column="Name" /></tr></thead>
      <tbody><tr v-for="r in sorted" :key="r.name"><td>{{ r.name }}</td></tr></tbody>
    </Table>
  </div>`
});
MouseFocus.parameters = {
  mouseFocus: ['.lib-button', 'button.plain', '.nwl-sort-button']
};
