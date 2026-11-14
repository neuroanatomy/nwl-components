import { expect } from '@storybook/test';
import { onMounted, ref } from 'vue';

import resizeCss from '@/components/common/resize.css?raw';
import {
  columnHeaders, minColumnWidth, resizableColumns
} from '@/components/common/resize.js';

// Unit tests of resizableColumns() (`nwl-components/resize`) on tables built without Vue, as
// BrainBox's and microdraw's pages build theirs. The tables live in a shadow root whose only
// stylesheets are resize.css, shipped as `nwl-components/resize/style.css`, and the few rules
// below (a plain page's own table CSS): neither the storybook page's styles nor dist/style.css
// reach them. Widths are compared in whole px; nothing is compared as pixels of an image.
export default {
  title: 'Common/PlainResize'
};

const pageCss = `
  table { border-spacing: 2px; font-size: 16px; }
  th, td { padding: 0 4px; text-align: left; }
  th.wide-icon { padding: 0 10px; }
  .nwl-sort-indicator { display: inline-block; width: 60px; height: 10px; }
`;
const plainPage = (host) => {
  const root = host.attachShadow({ mode: 'open' });
  root.innerHTML = `<style>${resizeCss}</style><style>${pageCss}</style><div class="page" style="width: 800px"></div>`;

  return root.querySelector('.page');
};
const pageOf = (canvasElement) => canvasElement.querySelector('.plain-host').shadowRoot.querySelector('.page');

const tableHtml = `<table class="files">
  <thead><tr><th>Name</th><th>Size</th><th class="wide-icon">Date<svg class="nwl-sort-indicator"></svg></th></tr></thead>
  <tbody>
    <tr><td>brain.nii.gz</td><td>12</td><td>2026-01-01</td></tr>
    <tr><td>a much longer file name.nii.gz</td><td>1234</td><td>2026-10-20</td></tr>
  </tbody>
</table>
<table class="keyvalue"><tr><th>Name</th><td>brain</td></tr><tr><th>Source</th><td>url</td></tr></table>
<table class="nothead"><tr><th>A</th><th style="width: 120px">B</th></tr><tr><td>1</td><td>2</td></tr></table>`;

export const UnitTests = () => ({
  setup () {
    const host = ref(null);
    onMounted(() => { plainPage(host.value).innerHTML = tableHtml; });

    return { host };
  },
  template: '<div ref="host" class="plain-host"></div>'
});

const widths = (table) => columnHeaders(table).map((th) => th.getBoundingClientRect().width);
const pointer = (target, type, clientX, extra = {}) => target.dispatchEvent(new PointerEvent(type, {
  bubbles: true, cancelable: true, composed: true, pointerId: 7, pointerType: 'pen', isPrimary: true, button: 0, clientX, ...extra
}));
const drag = (handle, dx, extra) => {
  pointer(handle, 'pointerdown', 100, extra);
  pointer(handle, 'pointermove', 100 + dx, extra);
  pointer(handle, 'pointerup', 100 + dx, extra);
};
const key = (handle, k, shiftKey = false) => handle.dispatchEvent(new KeyboardEvent('keydown', { key: k, shiftKey, bubbles: true, cancelable: true }));
const handlesOf = (table) => [...table.querySelectorAll('.nwl-col-resize')];
const nearly = (actual, expected) => actual.forEach((w, i) => expect(Math.abs(w - expected[i])).toBeLessThan(0.5));

// which tables have column headers
const scope = async (page) => {
  const [files, keyvalue, nothead] = ['files', 'keyvalue', 'nothead'].map((c) => page.querySelector(`table.${c}`));
  await expect(columnHeaders(files).map((th) => th.textContent)).toEqual(['Name', 'Size', 'Date']);
  await expect(columnHeaders(keyvalue)).toEqual([]);
  await expect(columnHeaders(nothead).map((th) => th.textContent)).toEqual(['A', 'B']);
  resizableColumns(keyvalue);
  await expect(handlesOf(keyvalue)).toEqual([]);
};

// nothing moves when the helper is added; the wrapper has no box; calling it twice does nothing
const noChangeAndIdempotent = async (table) => {
  const before = widths(table);
  const tableWidth = table.getBoundingClientRect().width;
  const columns = resizableColumns(table);
  nearly(widths(table), before);
  await expect(Math.abs(table.getBoundingClientRect().width - tableWidth)).toBeLessThan(0.5);
  const wrap = table.parentNode;
  await expect([wrap.className, getComputedStyle(wrap).display]).toEqual(['nwl-resize-wrap', 'contents']);
  await expect(resizableColumns(table)).toBe(columns);
  await expect([handlesOf(table).length, wrap.parentNode.className, table.parentNode]).toEqual([3, 'page', wrap]);

  return { columns, before };
};

// widths in whole px; one column changes; the table is the sum of its columns plus its spacing
const dragWidths = async (table, before) => {
  const [, size] = handlesOf(table);
  drag(size, 37.4);
  const frozen = before.map(Math.round);
  await expect(getComputedStyle(table).tableLayout).toBe('fixed');
  await expect(columnHeaders(table).map((th) => th.style.width)).toEqual([`${frozen[0]}px`, `${frozen[1] + 37}px`, `${frozen[2]}px`]);
  await expect(widths(table)).toEqual([frozen[0], frozen[1] + 37, frozen[2]]);
  // border-spacing 2px: 4 gaps of 2px
  await expect(table.getBoundingClientRect().width).toBe(frozen[0] + frozen[1] + 37 + frozen[2] + 8);

  return frozen;
};

// keyboard: 10px, 50px with Shift, both ways; other buttons and other pointers do nothing
const keysAndPointers = async (table, frozen) => {
  const [name, size] = handlesOf(table);
  key(name, 'ArrowRight');
  key(name, 'ArrowRight', true);
  key(name, 'ArrowLeft');
  await expect(widths(table)[0]).toBe(frozen[0] + 50);
  await expect(name.getAttribute('aria-valuenow')).toBe(String(frozen[0] + 50));
  // a button other than the main one, or a move of another pointer, does nothing
  drag(size, 30, { button: 2 });
  pointer(size, 'pointerdown', 0);
  pointer(size, 'pointermove', 30, { pointerId: 8 });
  pointer(size, 'pointerup', 0);
  await expect(widths(table)[1]).toBe(frozen[1] + 37);
};

const frames = () => new Promise((resolve) => { requestAnimationFrame(() => requestAnimationFrame(resolve)); });
// the wrapper getting narrower (its panel resized) makes it scroll too
const overflowOnPanelResize = async (table) => {
  const wrap = table.parentNode;
  const overflowX = () => getComputedStyle(wrap).overflowX;
  wrap.parentNode.style.width = '200px';
  await frames();
  await expect(overflowX()).toBe('auto');
  wrap.parentNode.style.width = '800px';
  await frames();
  await expect(overflowX()).toBe('visible');
};

// the wrapper scrolls only while the table is wider than it (popups in cells stay unclipped)
const overflowOnlyWhenWider = async (table) => {
  const wrap = table.parentNode;
  const overflowX = () => getComputedStyle(wrap).overflowX;
  // resized, still narrower than the 800px page: a block, no scroll container
  await expect([getComputedStyle(wrap).display, overflowX()]).toEqual(['block', 'visible']);
  const [, size] = handlesOf(table);
  drag(size, 600);
  await expect(table.getBoundingClientRect().width).toBeGreaterThan(wrap.getBoundingClientRect().width);
  await expect(overflowX()).toBe('auto');
  await expect(wrap.scrollWidth).toBeGreaterThan(wrap.clientWidth);
  drag(size, -600);
  await expect(overflowX()).toBe('visible');
  await overflowOnPanelResize(table);
};

// the minimum: 3em, or the header's padding and sort icon when larger
const minimum = async (table) => {
  const [name, , date] = handlesOf(table);
  const [nameTh, , dateTh] = columnHeaders(table);
  await expect([minColumnWidth(nameTh), minColumnWidth(dateTh)]).toEqual([48, 80]);
  drag(name, -1000);
  drag(date, -1000);
  await expect([widths(table)[0], widths(table)[2]]).toEqual([48, 80]);
  key(name, 'ArrowLeft', true);
  await expect(widths(table)[0]).toBe(48);
};

// rows added later keep the widths; Enter goes back to the automatic layout
const rowsAndReset = async (table, before) => {
  const kept = widths(table);
  table.tBodies[0].insertAdjacentHTML('beforeend', '<tr><td>an even longer file name than before.nii.gz</td><td>1</td><td>2026</td></tr>');
  await expect(widths(table)).toEqual(kept);
  table.tBodies[0].rows[2].remove();
  key(handlesOf(table)[1], 'Enter');
  await expect([getComputedStyle(table).tableLayout, table.getAttribute('style') || '', getComputedStyle(table.parentNode).display])
    .toEqual(['auto', '', 'contents']);
  await expect([getComputedStyle(table.parentNode).overflowX, table.parentNode.className]).toEqual(['visible', 'nwl-resize-wrap']);
  await expect(columnHeaders(table).map((th) => th.getAttribute('style') || '')).toEqual(['', '', '']);
  nearly(widths(table), before);
};

const flush = () => new Promise((resolve) => { setTimeout(resolve, 0); });
// a header added later gets its handle; after a resize, a new column goes back to automatic
const newHeaders = async (table) => {
  key(handlesOf(table)[0], 'ArrowRight');
  await expect(getComputedStyle(table).tableLayout).toBe('fixed');
  table.tHead.rows[0].insertAdjacentHTML('beforeend', '<th>Owner</th>');
  [...table.tBodies[0].rows].forEach((tr) => tr.insertAdjacentHTML('beforeend', '<td>katja</td>'));
  await flush();
  await expect(handlesOf(table).map((h) => h.getAttribute('aria-label')))
    .toEqual(['Name', 'Size', 'Date', 'Owner'].map((n) => `Resize column ${n}`));
  await expect(getComputedStyle(table).tableLayout).toBe('auto');
  // a header's text rewritten (as Vue does): the handle comes back, with the new label
  const [, , , owner] = columnHeaders(table);
  owner.textContent = 'Uploader';
  await flush();
  await expect(owner.querySelector('.nwl-col-resize').getAttribute('aria-label')).toBe('Resize column Uploader');
};
const removeLastColumn = async (table) => {
  [...table.rows].forEach((tr) => tr.lastElementChild.remove());
  await flush();
  await expect(handlesOf(table).length).toBe(3);
};

// destroy(): no handle, no wrapper, the page's own inline styles back; then it can start again
const destroyAndAgain = async (page) => {
  const table = page.querySelector('table.nothead');
  const columns = resizableColumns(table);
  key(handlesOf(table)[0], 'ArrowRight', true);
  await expect(table.rows[0].cells[1].style.width).not.toBe('120px');
  columns.destroy();
  await expect([handlesOf(table).length, table.parentNode, table.rows[0].cells[1].getAttribute('style')])
    .toEqual([0, page, 'width: 120px;']);
  await expect(table.querySelectorAll('.nwl-resizable').length).toBe(0);
  const again = resizableColumns(table);
  await expect(again).not.toBe(columns);
  await expect(handlesOf(table).length).toBe(2);
  again.destroy();
};

// reset() from the page's code, then destroy(): the table as it was
const resetAndDestroy = async (page, table, { columns, before }) => {
  key(handlesOf(table)[2], 'ArrowLeft');
  await expect(getComputedStyle(table).tableLayout).toBe('fixed');
  columns.reset();
  nearly(widths(table), before);
  columns.destroy();
  await expect([handlesOf(table).length, table.parentNode]).toEqual([0, page]);
};

UnitTests.play = async ({ canvasElement }) => {
  // widths measured before the web fonts load would not be the widths after
  await document.fonts.ready;
  const page = pageOf(canvasElement);
  // the page's only rules from the kit: the handles', the wrapper's and the resized table's
  const selectors = [...page.getRootNode().styleSheets[0].cssRules].flatMap((r) => r.selectorText.split(/,(?![^(]*\))/u).map((x) => x.trim()));
  await expect(selectors.filter((x) => !(/^(\.nwl-resize-wrap|th\.nwl-resizable|\.nwl-col-resize|\.nwl-resized)/u).test(x))).toEqual([]);
  await scope(page);
  const table = page.querySelector('table.files');
  const { columns, before } = await noChangeAndIdempotent(table);
  await keysAndPointers(table, await dragWidths(table, before));
  await overflowOnlyWhenWider(table);
  await minimum(table);
  await rowsAndReset(table, before);
  await newHeaders(table);
  await removeLastColumn(table);
  await destroyAndAgain(page);
  await resetAndDestroy(page, table, { columns, before });
};
