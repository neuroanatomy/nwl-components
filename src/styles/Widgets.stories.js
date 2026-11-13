import { expect, userEvent, within } from '@storybook/test';

import searchIcon from '@/icons/search.svg';

// src/styles/widgets.css (2.1.0): the class-based widgets, as an app's Mustache page or a viewer's
// tool panel writes them, in plain HTML (no Vue component: Vue only hosts the markup, through
// v-html). Read with getComputedStyle (no screenshots). Hover needs the real mouse, so hovered
// styles are checked by the test runner (`parameters.hoverStyles`, .storybook/test-runner.js).
export default {
  title: 'Library/Widgets'
};

const plain = (html) => () => ({
  setup () {
    return { html };
  },
  template: '<div class="widgets-story" v-html="html"></div>'
});

const white = 'rgb(255, 255, 255)';
const none = 'rgba(0, 0, 0, 0)';
const pressed = 'rgb(85, 85, 85)'; // --nwl-bg-pressed
const outline = { outlineStyle: 'solid', outlineWidth: '2px', outlineColor: white, outlineOffset: '2px' };

// the message names every element and property that differs
const checkAll = async (elements, expected) => {
  const diff = Object.entries(elements).flatMap(([name, el]) => Object.entries(expected)
    .filter(([p, v]) => getComputedStyle(el)[p] !== v)
    .map(([p, v]) => `${name}.${p}: ${getComputedStyle(el)[p]} (expected ${v})`));
  await expect(diff.join('; ')).toBe('');
};

// Tab moves the focus to `el`, which shows the focus outline
const tabTo = async (el) => {
  await userEvent.tab();
  await expect(document.activeElement).toBe(el);
  await checkAll({ focused: el }, outline);
};

// a caption and its widgets, one row per state
const row = (caption, html) => `<div class="row"><span class="caption">${caption}</span>${html}</div>`;
const css = `<style>
  .widgets-story .row { display: flex; align-items: center; gap: 12px; margin: 8px 0; }
  .widgets-story .caption { width: 160px; }
  .widgets-story .tool { width: 48px; }
  .widgets-story .push { width: 120px; }
</style>`;

/* Push button */

export const PushButton = plain(`${css}
${row('button', '<button class="nwl-push-button push">Save</button>')}
${row('link', '<a class="nwl-push-button push" href="#push">Go to project</a>')}
${row('input type=submit', '<input class="nwl-push-button push" type="submit" value="Submit">')}
${row('select', '<select class="nwl-push-button push"><option>Sagittal</option><option>Coronal</option></select>')}
${row('hover (mouse over)', '<button class="nwl-push-button push" id="push-hover">Cancel</button>')}
${row('disabled', '<button class="nwl-push-button push" disabled>Delete</button>')}
${row('keyboard focus (Tab)', '<button class="nwl-push-button push" id="push-focus">Copy</button>')}`);
PushButton.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const q = (s) => canvasElement.querySelector(s);
  const look = {
    backgroundColor: none,
    color: 'rgb(221, 221, 221)',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: 'rgb(221, 221, 221)',
    borderRadius: '6px',
    fontWeight: '700',
    fontSize: '14px',
    paddingTop: '5px',
    paddingLeft: '0px',
    textAlign: 'center',
    appearance: 'none',
    opacity: '1'
  };
  // the same look on a button, a link, a submit input and a select
  await checkAll({
    button: canvas.getByRole('button', { name: 'Save' }),
    link: canvas.getByRole('link', { name: 'Go to project' }),
    submit: canvas.getByRole('button', { name: 'Submit' }),
    select: q('select')
  }, look);
  await checkAll({ link: canvas.getByRole('link') }, { textDecorationLine: 'none' });
  await checkAll({ disabled: canvas.getByRole('button', { name: 'Delete' }) }, { opacity: '0.4', cursor: 'default' });
  // keyboard: Tab goes through the six enabled ones (the disabled button is skipped)
  await [q('button'), q('a'), q('input'), q('select'), q('#push-hover'), q('#push-focus')]
    .reduce((previous, el) => previous.then(() => tabTo(el)), Promise.resolve());
};
PushButton.parameters = {
  hoverStyles: [{ selector: '#push-hover', styles: { backgroundColor: pressed, opacity: '1', color: 'rgb(221, 221, 221)' } }]
};

/* Tool button */

const icon = (alt) => `<img class="nwl-icon" src="${searchIcon}" alt="${alt}">`;
export const ToolButton = plain(`${css}
${row('text', '<div class="tool"><button class="nwl-tool-button" id="tool-text">Cor</button></div>')}
${row('icon', `<div class="tool"><button class="nwl-tool-button" id="tool-icon">${icon('Zoom in')}</button></div>`)}
${row('pressed', '<div class="tool"><button class="nwl-tool-button" id="tool-pressed" aria-pressed="true">Sag</button></div>')}
${row('not pressed', '<div class="tool"><button class="nwl-tool-button" id="tool-off" aria-pressed="false">Axi</button></div>')}
${row('in a group (--sub)', `<div class="tool"><button class="nwl-tool-button nwl-tool-button--sub" id="tool-sub" aria-pressed="true">${icon('Draw')}</button></div>
  <div class="tool"><button class="nwl-tool-button nwl-tool-button--sub" aria-pressed="false">${icon('Erase')}</button></div>`)}
${row('disabled', '<div class="tool"><button class="nwl-tool-button" id="tool-disabled" disabled>3D</button></div>')}
${row('hover (mouse over)', `<div class="tool"><button class="nwl-tool-button" id="tool-hover-text">Fill</button></div>
  <div class="tool"><button class="nwl-tool-button" id="tool-hover-icon">${icon('Home')}</button></div>`)}`);
// the pressed background follows aria-pressed, and doesn't appear without it (nor with the
// apps' state classes)
const checkPressedState = async (off) => {
  off.setAttribute('aria-pressed', 'true');
  await checkAll({ turnedOn: off }, { backgroundColor: pressed });
  off.setAttribute('aria-pressed', 'false');
  await checkAll({ turnedOff: off }, { backgroundColor: none });
  off.removeAttribute('aria-pressed');
  await checkAll({ noAttribute: off }, { backgroundColor: none });
  off.classList.add('pressed', 'selected');
  await checkAll({ stateAsClass: off }, { backgroundColor: none });
  off.classList.remove('pressed', 'selected');
};

ToolButton.play = async ({ canvasElement }) => {
  const q = (s) => canvasElement.querySelector(s);
  // a native button, with the browser's look reset: the BrainBox `.a` / microdraw `.mui` look
  const look = {
    backgroundColor: none,
    color: white,
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: 'rgb(119, 119, 119)',
    borderRadius: '3px',
    height: '24px',
    marginTop: '1px',
    paddingTop: '0px',
    paddingLeft: '0px',
    fontSize: '14px',
    textAlign: 'center',
    appearance: 'none',
    userSelect: 'none',
    opacity: '1'
  };
  await checkAll({ text: q('#tool-text'), icon: q('#tool-icon'), off: q('#tool-off') }, look);
  // it fills its container, less its margins, as the apps' div tools do
  await expect(q('#tool-text').getBoundingClientRect().width).toBe(q('#tool-text').parentElement.getBoundingClientRect().width - 2);
  await checkAll({ pressed: q('#tool-pressed') }, { ...look, backgroundColor: pressed });
  await checkPressedState(q('#tool-off'));
  // in a group: no border, 22px, no margin
  await checkAll({ sub: q('#tool-sub') }, { borderTopStyle: 'none', height: '22px', marginTop: '0px', backgroundColor: pressed });
  await checkAll({ disabled: q('#tool-disabled') }, { opacity: '0.4', cursor: 'default' });
  // a native <button> is in the tab order (no script) and shows the focus outline
  await tabTo(q('#tool-text'));
  await tabTo(q('#tool-icon'));
};
// hover: a lighter background on a text tool, half opacity on an icon-only tool
ToolButton.parameters = {
  hoverStyles: [
    { selector: '#tool-hover-text', styles: { backgroundColor: pressed, opacity: '1' } },
    { selector: '#tool-hover-icon', styles: { backgroundColor: none, opacity: '0.5' } },
    { selector: '#tool-pressed', styles: { backgroundColor: pressed, opacity: '1' } },
    { selector: '#tool-sub', styles: { backgroundColor: pressed, opacity: '0.5' } }
  ]
};

/* Icon button and icon */

export const IconButton = plain(`${css}
${row('icon button (aria-label)', `<button class="nwl-icon-button" id="icon-button" aria-label="Search">${icon('')}</button>`)}
${row('hover (mouse over)', `<button class="nwl-icon-button" id="icon-hover" aria-label="Search again">${icon('')}</button>`)}
${row('disabled', `<button class="nwl-icon-button" id="icon-disabled" aria-label="Search (off)" disabled>${icon('')}</button>`)}
${row('icon in text', `<span id="icon-text">${icon('')} Search</span>`)}`);
IconButton.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const q = (s) => canvasElement.querySelector(s);
  // the accessible name comes from aria-label
  const button = canvas.getByRole('button', { name: 'Search' });
  await expect(button).toBe(q('#icon-button'));
  await checkAll({ button }, {
    backgroundColor: none, borderTopStyle: 'none', paddingTop: '0px', paddingLeft: '0px', appearance: 'none', opacity: '1', cursor: 'pointer'
  });
  await checkAll({ disabled: q('#icon-disabled') }, { opacity: '0.4', cursor: 'default' });
  await checkAll({ icon: q('#icon-text img') }, { width: '16px', height: '16px', verticalAlign: 'middle', userSelect: 'none' });
  await tabTo(button);
};
IconButton.parameters = {
  hoverStyles: [{ selector: '#icon-hover', styles: { opacity: '0.5', backgroundColor: none } }]
};

/* Text field */

export const TextField = plain(`${css}
${row('input', '<input class="nwl-text-field" id="field-input" placeholder="Project name">')}
${row('textarea', '<textarea class="nwl-text-field" id="field-textarea" placeholder="Description"></textarea>')}
${row('inherits size and colour', '<span style="font-size: 20px; color: rgb(255, 0, 0)"><input class="nwl-text-field" id="field-red" value="red"></span>')}
${row('disabled', '<input class="nwl-text-field" id="field-disabled" value="anyone" disabled>')}`);
TextField.play = async ({ canvasElement }) => {
  const q = (s) => canvasElement.querySelector(s);
  const look = {
    backgroundColor: none,
    color: white,
    fontSize: '14px',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: 'rgb(119, 119, 119)',
    borderRadius: '3px',
    paddingTop: '0px',
    paddingLeft: '0px'
  };
  await checkAll({ input: q('#field-input'), textarea: q('#field-textarea') }, look);
  await checkAll({ red: q('#field-red') }, { color: 'rgb(255, 0, 0)', fontSize: '20px' });
  await expect(getComputedStyle(q('#field-input'), '::placeholder').color).toBe('rgb(204, 204, 204)');
  await checkAll({ disabled: q('#field-disabled') }, { color: 'rgba(255, 255, 255, 0.4)' });
  await tabTo(q('#field-input'));
};

/* Selected table row */

export const SelectedRow = plain(`
<table>
  <thead><tr><th>Name</th><th>Owner</th></tr></thead>
  <tbody>
    <tr aria-selected="false"><td>Brain atlas</td><td>katja</td></tr>
    <tr aria-selected="true"><td>axolotl</td><td>roberto</td></tr>
    <tr><td>ferret</td><td>nicolas</td></tr>
  </tbody>
</table>`);
SelectedRow.play = async ({ canvasElement }) => {
  const rows = canvasElement.querySelectorAll('tbody tr');
  const elevated = 'rgb(68, 68, 68)'; // --nwl-bg-elevated
  await checkAll({ notSelected: rows[0], noAttribute: rows[2] }, { backgroundColor: none });
  await checkAll({ selected: rows[1] }, { backgroundColor: elevated });
  rows[1].setAttribute('aria-selected', 'false');
  rows[2].setAttribute('aria-selected', 'true');
  await checkAll({ deselected: rows[1] }, { backgroundColor: none });
  await checkAll({ selected: rows[2] }, { backgroundColor: elevated });
};

/* The layer contract: app CSS, outside any layer, beats the widgets */

// app rules at the top of <head>, before the library's stylesheets: they win through the
// layers, not by coming last
const appStyle = (id, text) => {
  const style = document.createElement('style');
  style.id = id;
  style.textContent = text;
  document.head.prepend(style);

  return style;
};

export const AppCssWins = plain(`
<div style="width: 48px"><button class="nwl-tool-button app-tool" aria-pressed="true">Sag</button></div>
<div style="width: 48px"><button class="nwl-tool-button zero-tool" aria-pressed="true">Cor</button></div>
<div style="width: 48px"><button class="nwl-tool-button layered-tool" aria-pressed="true">Axi</button></div>
<button class="nwl-push-button app-push">Save</button>`);
AppCssWins.play = async ({ canvasElement }) => {
  const q = (s) => canvasElement.querySelector(s);
  const green = 'rgb(0, 128, 0)';
  const styles = [
    // one class, outside any layer: beats the pressed rule (:where + layer)
    appStyle('app-one-class', '.app-tool { background: rgb(0, 128, 0) } .app-push { border-radius: 9px }'),
    // no specificity at all, outside any layer: wins through the layers alone
    appStyle('app-zero', ':where(.zero-tool) { background: rgb(0, 128, 0) }'),
    // one class in the widgets' own layer: wins only because the widgets' selectors are in :where()
    appStyle('app-same-layer', '@layer nwl.widgets { .layered-tool { background: rgb(0, 128, 0) } }')
  ];
  try {
    await checkAll({ oneClass: q('.app-tool'), zero: q('.zero-tool'), sameLayer: q('.layered-tool') }, { backgroundColor: green });
    await expect(getComputedStyle(q('.app-push')).borderTopLeftRadius).toBe('9px');
  } finally {
    styles.forEach((s) => s.remove());
  }
};
