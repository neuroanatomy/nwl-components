import { expect, userEvent, within } from '@storybook/test';

import { MIN_HEIGHT, MIN_WIDTH, floatingPanel } from '@/components/common/panel.js';
import '@/components/common/resize.css';
import { resizableColumns } from '@/components/common/resize.js';
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

// the values of 3.0.0
const textColour = 'rgb(232, 232, 232)'; // --nwl-text
const none = 'rgba(0, 0, 0, 0)';
const pressed = 'rgb(64, 64, 64)'; // --nwl-bg-pressed
const outline = { outlineStyle: 'solid', outlineWidth: '2px', outlineColor: textColour, outlineOffset: '2px' };

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
    borderTopColor: 'rgb(153, 153, 153)', // --nwl-border-strong
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
    color: textColour,
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
    color: textColour,
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
  await expect(getComputedStyle(q('#field-input'), '::placeholder').color).toBe('rgb(153, 153, 153)');
  await checkAll({ disabled: q('#field-disabled') }, { color: 'rgb(153, 153, 153)' });
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
  const elevated = 'rgb(46, 46, 46)'; // --nwl-bg-elevated
  await checkAll({ notSelected: rows[0], noAttribute: rows[2] }, { backgroundColor: none });
  await checkAll({ selected: rows[1] }, { backgroundColor: elevated });
  rows[1].setAttribute('aria-selected', 'false');
  rows[2].setAttribute('aria-selected', 'true');
  await checkAll({ deselected: rows[1] }, { backgroundColor: none });
  await checkAll({ selected: rows[2] }, { backgroundColor: elevated });
};

/* Floating panel (3.2.0) */

// a body much taller than the panel: 60 labels
const labels = Array.from({ length: 60 }, (_, i) => `<li>Label ${i + 1}</li>`).join('');
export const Panel = plain(`
<div class="nwl-panel" id="panel" style="position: relative; width: 300px; height: 200px; resize: both">
  <div class="nwl-panel-header" id="panel-header"><b>Labels</b>
    <button class="nwl-icon-button" aria-label="Close" style="float: right; margin-top: 8px">${icon('')}</button></div>
  <div class="nwl-panel-body" id="panel-body"><ul>${labels}</ul></div>
</div>
<div class="nwl-panel" id="panel-hidden" hidden><div class="nwl-panel-header">Hidden</div></div>`);
// the look of the three parts
const checkPanelLook = async (panel, header, body) => {
  await checkAll({ panel }, {
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'hidden',
    boxSizing: 'border-box',
    paddingTop: '0px',
    borderTopWidth: '1px',
    borderTopColor: 'rgb(119, 119, 119)', // --nwl-border
    backgroundColor: 'rgb(37, 37, 37)', // --nwl-bg-surface
    color: textColour
  });
  await checkAll({ header }, { flexShrink: '0', minHeight: '36px', backgroundColor: pressed, userSelect: 'none' });
  await checkAll({ body }, { overflowY: 'auto', minHeight: '0px', paddingTop: '10px', overscrollBehaviorY: 'contain' });
};

// the header's top, from the panel's top: 1px, the panel's border
const headerTop = (panel, header) => header.getBoundingClientRect().top - panel.getBoundingClientRect().top;

// scrolled to the end, the header is still at the top, and the body's last item is in view
const checkScrolled = async (panel, header, body) => {
  await expect(headerTop(panel, header)).toBe(1);
  body.scrollTop = body.scrollHeight;
  await expect(body.scrollTop).toBeGreaterThan(0);
  await expect(headerTop(panel, header)).toBe(1);
  await expect(body.lastElementChild.getBoundingClientRect().bottom).toBeLessThanOrEqual(body.getBoundingClientRect().bottom + 1);
};

// wider than the viewport (a narrow screen): no wider than the viewport
const checkNarrow = async (panel) => {
  panel.style.width = `${window.innerWidth + 200}px`;
  await expect(panel.getBoundingClientRect().width).toBeLessThanOrEqual(window.innerWidth);
  panel.style.width = '300px';
  panel.style.height = '200px';
};

// The resize handle (3.3.0): floatingPanel() gives a resizable panel (its `resize: both` here)
// a handle in its bottom-right corner and turns the native resize off. Pointer events are
// dispatched on the handle, as a finger's (pointerType 'touch') or a mouse's.
const pointer = (target, type, x, y, pointerType) => {
  const button = type === 'pointermove' ? -1 : 0;
  const pointerId = pointerType === 'touch' ? 2 : 1;
  const init = { bubbles: true, cancelable: true, isPrimary: true, pointerId, pointerType, button, clientX: x, clientY: y };
  target.dispatchEvent(new PointerEvent(type, init));
};
const pullHandle = (handle, dx, dy, pointerType = 'mouse') => {
  const r = handle.getBoundingClientRect();
  const [x, y] = [r.left + r.width / 2, r.top + r.height / 2];
  pointer(handle, 'pointerdown', x, y, pointerType);
  pointer(handle, 'pointermove', x + dx / 2, y + dy / 2, pointerType);
  pointer(handle, 'pointermove', x + dx, y + dy, pointerType);
  pointer(handle, 'pointerup', x + dx, y + dy, pointerType);
};
const sizeOf = (el) => {
  const { left, top, width, height } = el.getBoundingClientRect();

  return { left, top, width, height };
};
const key = (el, k, shiftKey = false) => el.dispatchEvent(new KeyboardEvent('keydown', { key: k, shiftKey, bubbles: true, cancelable: true }));

// the handle of a panel in flow (position: relative): its look, where it is, what it covers
const checkHandlePlace = async (panel, body, handle) => {
  await expect([handle.getAttribute('aria-label'), handle.tabIndex]).toEqual(['Resize', 0]);
  await checkAll({ panel }, { resize: 'none' });
  await checkAll({ handle }, { position: 'absolute', width: '24px', height: '24px', touchAction: 'none', cursor: 'nwse-resize' });
  // in the corner, inside the 1px border, above the body (and its scrollbar)
  const [p, h] = [panel.getBoundingClientRect(), handle.getBoundingClientRect()];
  await expect([p.right - h.right, p.bottom - h.bottom]).toEqual([1, 1]);
  await expect(document.elementFromPoint(h.right - 2, h.bottom - 2)).toBe(handle);
  await expect(body.contains(document.elementFromPoint(h.left - 2, h.bottom - 2))).toBe(true);
  // the corner mark: 8px, the tokens' --nwl-text-3
  const mark = getComputedStyle(handle, '::after');
  await expect([mark.width, mark.borderRightColor]).toEqual(['8px', 'rgb(153, 153, 153)']);
};
// a resize by the handle and by the keyboard; a second floatingPanel() call adds no second handle
const checkHandle = async (panel, body) => {
  floatingPanel(panel);
  const handles = panel.querySelectorAll(':scope > .nwl-panel-resize-handle');
  await expect(handles.length).toBe(1);
  const [handle] = handles;
  await checkHandlePlace(panel, body, handle);
  // a finger's drag
  const before = sizeOf(panel);
  pullHandle(handle, 40, 30, 'touch');
  await expect(sizeOf(panel)).toEqual({ ...before, width: before.width + 40, height: before.height + 30 });
  // the keyboard: 10px, 50px with Shift
  key(handle, 'ArrowLeft');
  key(handle, 'ArrowUp', true);
  await expect(sizeOf(panel)).toEqual({ ...before, width: before.width + 30, height: before.height - 20 });
  floatingPanel(panel);
  await expect(panel.querySelectorAll('.nwl-panel-resize-handle').length).toBe(1);
};

Panel.play = async ({ canvasElement }) => {
  const q = (s) => canvasElement.querySelector(s);
  const [panel, header, body] = [q('#panel'), q('#panel-header'), q('#panel-body')];
  await checkPanelLook(panel, header, body);
  // the panel keeps its own size; only the body scrolls
  await expect(panel.getBoundingClientRect().height).toBe(200);
  await expect(panel.scrollHeight).toBe(panel.clientHeight);
  await expect(body.scrollHeight).toBeGreaterThan(body.clientHeight);
  await checkScrolled(panel, header, body);
  // resized smaller (as with its resize handle): the same, and the header keeps its height
  panel.style.height = '100px';
  await expect(header.getBoundingClientRect().height).toBe(36);
  await checkScrolled(panel, header, body);
  await expect(body.getBoundingClientRect().bottom).toBeLessThanOrEqual(panel.getBoundingClientRect().bottom);
  await checkNarrow(panel);
  // the hidden attribute hides it
  await checkAll({ hidden: q('#panel-hidden') }, { display: 'none' });
  await checkHandle(panel, body);
};

// floatingPanel (nwl-components/panel, 3.2.0): a panel centred by a transform, as the apps'
// panels, is pinned by its top-left corner at the first press, without moving; then a resize
// keeps that corner in place (centred, it grew in every direction). 3.3.0: resized by its
// handle, with a finger or the mouse, within the limits
export const CentredPanel = plain(`
<div class="nwl-panel" id="centred" style="position: fixed; top: 50%; left: 50%; width: 200px; height: 120px; transform: translate(-50%, -50%); resize: both">
  <div class="nwl-panel-header"><b>Layers</b></div>
  <div class="nwl-panel-body">Pull the bottom-right corner</div>
</div>
<div class="nwl-panel nwl-panel-resizable" id="absolute" style="position: absolute; top: 10px; left: 10px; width: 200px; height: 120px">
  <div class="nwl-panel-header"><b>By its class</b></div>
  <div class="nwl-panel-body">Absolute</div>
</div>`);
const rectOf = sizeOf;
// pinned at the first press without moving; a second call, a second press: nothing changes
const checkPinned = async (panel) => {
  const rest = rectOf(panel);
  await expect(Math.round(rest.left + rest.width / 2)).toBe(Math.round(window.innerWidth / 2));
  panel.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
  await checkAll({ panel }, { transform: 'none' });
  await expect(rectOf(panel)).toEqual(rest);
  // a resize (as by its corner) keeps its top-left corner
  Object.assign(panel.style, { width: '260px', height: '160px' });
  const resized = rectOf(panel);
  await expect([resized.left, resized.top, resized.width, resized.height]).toEqual([rest.left, rest.top, 260, 160]);
  await expect(floatingPanel(panel)).toBe(panel);
  panel.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
  await expect(rectOf(panel)).toEqual(resized);

  return resized;
};
// the limits: no smaller than 160 x 100, never past the viewport's right and bottom edges
const checkLimits = async (panel, handle, corner) => {
  pullHandle(handle, -1000, -1000, 'touch');
  await expect([rectOf(panel).width, rectOf(panel).height]).toEqual([MIN_WIDTH, MIN_HEIGHT]);
  pullHandle(handle, 5000, 5000);
  const { clientWidth, clientHeight } = document.documentElement;
  const big = rectOf(panel);
  await expect([big.left, big.top, big.left + big.width, big.top + big.height]).toEqual([corner.left, corner.top, clientWidth, clientHeight]);
};
CentredPanel.play = async ({ canvasElement }) => {
  const panel = floatingPanel(canvasElement.querySelector('#centred'));
  const handle = panel.querySelector('.nwl-panel-resize-handle');
  await checkAll({ panel }, { resize: 'none' });
  const resized = await checkPinned(panel);
  // by its handle, with a finger, then the mouse: the top-left corner stays
  pullHandle(handle, 50, 40, 'touch');
  await expect(rectOf(panel)).toEqual({ ...resized, width: 310, height: 200 });
  pullHandle(handle, -30, -20);
  await expect(rectOf(panel)).toEqual({ ...resized, width: 280, height: 180 });
  await checkLimits(panel, handle, resized);
  // an absolute panel, resizable by its class (no native resize): the same
  const abs = floatingPanel(canvasElement.querySelector('#absolute'));
  const absBefore = rectOf(abs);
  pullHandle(abs.querySelector('.nwl-panel-resize-handle'), 40, 20, 'touch');
  await expect(rectOf(abs)).toEqual({ ...absBefore, width: 240, height: 140 });
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

/* Table (3.4.0): .nwl-table spaces the columns of a plain table; a resized table clips */

const tableHtml = (cls) => `<table class="${cls}">
  <thead><tr><th>Name</th><th>Size</th><th>Date</th></tr></thead>
  <tbody>
    <tr><td>brain.nii.gz</td><td>12</td><td>2026-01-01</td></tr>
    <tr><td>a much longer file name that does not fit.nii.gz</td><td>1234</td><td>2026-10-20</td></tr>
  </tbody>
</table>`;
const cellsOf = (table) => [...table.querySelectorAll('th, td')];
const gapsOf = (table) => cellsOf(table).map((cell) => getComputedStyle(cell).paddingRight);
// 1em at 14px after the first two cells of each of the three rows; the last keeps the
// browser's 1px
const spacedGaps = ['14px', '14px', '1px', '14px', '14px', '1px', '14px', '14px', '1px'];

export const TableSpacing = plain(`${tableHtml('nwl-table spaced')}${tableHtml('unspaced')}`);
TableSpacing.play = async ({ canvasElement }) => {
  const spaced = canvasElement.querySelector('table.spaced');
  // 1em at 14px: every cell but the last of its row
  await expect(getComputedStyle(spaced).fontSize).toBe('14px');
  await expect(gapsOf(spaced)).toEqual(spacedGaps);
  // the class is opt-in: a table without it keeps the browser's padding
  await expect(gapsOf(canvasElement.querySelector('table.unspaced'))).not.toContain('14px');
};

// the cells as an app styles them (unlayered, an id): ellipsis before a resize; `app-scoped`
// limits it to tables that weren't resized, as the apps do from 3.4.0, `app-unscoped` doesn't
const appCellsCss = (id, scoped) => `#${id} table${scoped ? ':not(.nwl-resized)' : ''} :is(th, td) {
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }`;

export const ResizedTableClips = plain(`<div style="width: 400px">
<div id="app-scoped">${tableHtml('nwl-table')}</div>
<div id="app-unscoped">${tableHtml('nwl-table')}</div>
<div id="no-app">${tableHtml('nwl-table')}</div>
</div>`);
ResizedTableClips.play = async ({ canvasElement }) => {
  const tables = Object.fromEntries(['app-scoped', 'app-unscoped', 'no-app']
    .map((id) => [id, canvasElement.querySelector(`#${id} table`)]));
  const styles = [
    appStyle('app-cells-scoped', appCellsCss('app-scoped', true)),
    appStyle('app-cells-unscoped', appCellsCss('app-unscoped', false))
  ];
  const overflowOf = (table) => [...new Set(cellsOf(table).map((cell) => getComputedStyle(cell).textOverflow))];
  const columns = Object.values(tables).map((table) => resizableColumns(table));
  try {
    await expect(overflowOf(tables['app-scoped'])).toEqual(['ellipsis']);
    // a resize (the keyboard on the first handle): the table gets .nwl-resized
    Object.values(tables).forEach((table) => table.querySelector('.nwl-col-resize')
      .dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true })));
    await expect(Object.values(tables).map((table) => table.classList.contains('nwl-resized'))).toEqual([true, true, true]);
    // the library's rule: clip, wrapped, also where the app's scoped rule set ellipsis before
    const resizedCells = ['app-scoped', 'no-app'].flatMap((id) => cellsOf(tables[id])
      .map((cell, i) => [`${id}[${i}]`, cell]));
    await checkAll(Object.fromEntries(resizedCells),
      { textOverflow: 'clip', whiteSpace: 'normal', overflowWrap: 'anywhere' });
    // the layers: an unscoped app rule (outside any layer) keeps its ellipsis, whatever the
    // library's specificity; this is why the apps scope theirs
    await expect(overflowOf(tables['app-unscoped'])).toEqual(['ellipsis']);
    // the spacing stays after a resize
    await expect(gapsOf(tables['no-app'])).toEqual(spacedGaps);
  } finally {
    columns.forEach((c) => c.destroy());
    styles.forEach((style) => style.remove());
  }
};
