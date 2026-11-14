// Resizable table columns without Vue: a handle at the right edge of every column header, for
// plain-DOM tables and for Table.vue alike (Table.vue and ImportFilesDialog call this function).
// No Vue import here: this file is also built alone as `nwl-components/resize`.
//
// Nothing moves until the first drag (or arrow key): the handles are absolutely positioned
// inside their header cells, and the wrapper the helper adds has `display: contents` until then.
// On the first change, every column's rendered width is frozen in px on its header cell and the
// table switches to `table-layout: fixed`, its width the sum of its columns; from then on a
// change resizes that column only. The wrapper scrolls the table only while it is wider than the
// wrapper. A double-click on a handle, or Enter on a focused one, goes back to the automatic
// layout. Widths are never stored. The handle itself is in resizeHandle.js.

import { createHandle, listenHandle, widthOf } from './resizeHandle.js';

export { createHandle };

const MIN_EM = 3;

const instances = new WeakMap();

const px = (value) => parseFloat(value) || 0;
const label = (th) => (th.textContent || '').replace(/\s+/gu, ' ').trim();

/**
 * The header cells a table resizes: the first row of its `thead`, or, without a `thead`, its
 * first row when every cell of that row is a `th`. Key/value tables (a `th` per row) and layout
 * tables have none.
 *
 * @param {HTMLTableElement} table The table.
 * @returns {Array<HTMLTableCellElement>} The header cells, left to right (may be empty).
 */
export const columnHeaders = (table) => {
  const [head] = table.tHead ? table.tHead.rows : [];
  if (head) { return [...head.cells].filter((cell) => cell.tagName === 'TH'); }
  const [first] = table.rows;
  if (!first || first.cells.length === 0) { return []; }
  const cells = [...first.cells];

  return cells.every((cell) => cell.tagName === 'TH') ? cells : [];
};

/**
 * The smallest width of a column, in whole px: 3em of its header's font, or its header's
 * padding, borders and sort icon, whichever is larger, so a header never overlaps its neighbour.
 *
 * @param {HTMLTableCellElement} th The header cell.
 * @returns {number} The minimum border-box width in px.
 */
export const minColumnWidth = (th) => {
  const style = getComputedStyle(th);
  const icon = th.querySelector('.nwl-sort-indicator');
  const iconWidth = icon ? icon.getBoundingClientRect().width : 0;
  const chrome = px(style.paddingLeft) + px(style.paddingRight) +
    px(style.borderLeftWidth) + px(style.borderRightWidth) + iconWidth;

  return Math.ceil(Math.max(MIN_EM * px(style.fontSize), chrome));
};

const STYLE_PROPS = ['width', 'box-sizing'];
const TABLE_PROPS = ['width', 'table-layout'];
const saveStyle = (el, props) => props.map((p) => [p, el.style.getPropertyValue(p), el.style.getPropertyPriority(p)]);
const restoreStyle = (el, saved) => saved.forEach(([p, value, priority]) => {
  if (value) { el.style.setProperty(p, value, priority); } else { el.style.removeProperty(p); }
});
const sum = (numbers) => numbers.reduce((a, b) => a + b, 0);

class ResizableColumns {
  constructor (table, wrapper) {
    this.table = table;
    this.doc = table.ownerDocument;
    this.ownWrapper = !wrapper;
    this.wrap = wrapper || this.addWrapper();
    this.handles = new Map(); // th -> { handle, unlisten }
    this.saved = new Map(); // th -> its own inline width and box-sizing, while frozen
    this.savedTable = null;
    this.extra = 0; // the table's width beyond its columns (border spacing, padding, borders)
    this.frozen = false;
    this.baseOverflow = 0;
    this.resizeObserver = null;
    this.sync();
    this.observer = this.observe();
  }

  addWrapper () {
    const wrap = this.doc.createElement('div');
    wrap.className = 'nwl-resize-wrap';
    this.table.before(wrap);
    wrap.append(this.table);

    return wrap;
  }

  // headers added, removed or relabelled later (by Vue or the page's code)
  observe () {
    const Observer = this.doc.defaultView && this.doc.defaultView.MutationObserver;
    if (!Observer) { return null; }
    const observer = new Observer(() => this.sync());
    observer.observe(this.table, { childList: true, subtree: true, characterData: true });

    return observer;
  }

  headers () { return columnHeaders(this.table); }

  setColumn (th, width) {
    if (!this.saved.has(th)) { this.saved.set(th, saveStyle(th, STYLE_PROPS)); }
    th.style.setProperty('box-sizing', 'border-box');
    th.style.setProperty('width', `${width}px`);
    const known = this.handles.get(th);
    if (known) { known.handle.setAttribute('aria-valuenow', String(width)); }
  }

  fitTable () {
    const width = sum(this.headers().map((th) => px(th.style.width))) + this.extra;
    this.table.style.setProperty('width', `${width}px`);
  }

  // every column's rendered width, in whole px, on its header; then the fixed layout
  freeze () {
    if (this.frozen) { return; }
    const cells = this.headers();
    const exact = cells.map((th) => th.getBoundingClientRect().width);
    const widths = exact.map(Math.round);
    this.savedTable = saveStyle(this.table, TABLE_PROPS);
    this.extra = Math.max(0, Math.round(this.table.getBoundingClientRect().width - sum(exact)));
    cells.forEach((th, i) => this.setColumn(th, widths[i]));
    this.table.style.setProperty('table-layout', 'fixed');
    this.fitTable();
    this.table.classList.add('nwl-resized');
    this.wrap.classList.add('nwl-resize-active');
    this.frozen = true;
    // what already stuck out of the wrapper before the resize (Table's left margin) is no reason
    // to scroll
    this.baseOverflow = Math.max(0, this.wrap.scrollWidth - this.wrap.clientWidth);
    this.watchOverflow();
  }

  resize (th, width) {
    this.freeze();
    this.setColumn(th, Math.max(minColumnWidth(th), Math.round(width)));
    this.fitTable();
    this.updateOverflow();
  }

  // the wrapper scrolls (class nwl-resize-overflow) only while the table is wider than it, so
  // popups in cells (Autocomplete) are not clipped otherwise
  updateOverflow () {
    const { wrap } = this;
    const scrolling = wrap.classList.contains('nwl-resize-overflow');
    // a scroll container's own scrollbar doesn't count
    const room = scrolling ? wrap.getBoundingClientRect().width : wrap.clientWidth;
    const over = this.frozen && wrap.scrollWidth - room > this.baseOverflow + 1;
    wrap.classList.toggle('nwl-resize-overflow', over);
  }

  watchOverflow () {
    const View = this.doc.defaultView;
    if (this.resizeObserver || !View || !View.ResizeObserver) { return; }
    this.resizeObserver = new View.ResizeObserver(() => this.updateOverflow());
    this.resizeObserver.observe(this.wrap);
  }

  unwatchOverflow () {
    if (this.resizeObserver) { this.resizeObserver.disconnect(); }
    this.resizeObserver = null;
    this.wrap.classList.remove('nwl-resize-overflow');
  }

  reset () {
    if (!this.frozen) { return; }
    this.saved.forEach((style, th) => restoreStyle(th, style));
    this.saved.clear();
    restoreStyle(this.table, this.savedTable);
    this.table.classList.remove('nwl-resized');
    this.wrap.classList.remove('nwl-resize-active');
    this.frozen = false;
    this.unwatchOverflow();
    this.handles.forEach(({ handle }, th) => handle.setAttribute('aria-valuenow', String(widthOf(th))));
  }

  removeHandle (th) {
    const { handle, unlisten } = this.handles.get(th);
    unlisten();
    handle.remove();
    this.handles.delete(th);
  }

  addHandle (th) {
    const handle = createHandle(this.doc, label(th));
    th.classList.add('nwl-resizable');
    th.append(handle);
    handle.setAttribute('aria-valuenow', String(widthOf(th)));
    this.handles.set(th, { handle, unlisten: listenHandle(this, th, handle) });
  }

  // a handle on every header without one (new headers included), labels kept up to date
  sync () {
    const cells = this.headers();
    this.handles.forEach(({ handle }, th) => {
      if (!cells.includes(th) || handle.parentNode !== th) { this.removeHandle(th); }
    });
    let added = false;
    cells.forEach((th) => {
      const known = this.handles.get(th);
      if (known) {
        const text = `Resize column ${label(th)}`;
        if (known.handle.getAttribute('aria-label') !== text) { known.handle.setAttribute('aria-label', text); }

        return;
      }
      this.addHandle(th);
      // a frozen column whose handle the page removed (Vue rewriting the header's text) is no
      // new column
      if (!this.saved.has(th)) { added = true; }
    });
    // a column added or removed after a resize: back to the automatic layout, since the
    // frozen widths no longer describe the table
    if (this.frozen && (added || [...this.saved.keys()].some((th) => !cells.includes(th)))) { this.reset(); }
  }

  destroy () {
    if (this.observer) { this.observer.disconnect(); }
    this.reset();
    [...this.handles.keys()].forEach((th) => {
      this.removeHandle(th);
      th.classList.remove('nwl-resizable');
    });
    if (this.ownWrapper && this.wrap.parentNode) {
      this.wrap.before(this.table);
      this.wrap.remove();
    }
    instances.delete(this.table);
  }
}

/**
 * Makes every column of a table resizable: a handle at the right edge of each column header
 * (see columnHeaders), dragged with a mouse, pen or finger, or moved with ArrowLeft/ArrowRight
 * (10px, 50px with Shift). Headers added later (by Vue or the page's own code) get their handle
 * too. Calling it again on the same table returns the first call's result and does nothing else.
 *
 * @param {HTMLTableElement} table The table.
 * @param {Object} [options] `{ wrapper }`: an element around the table that scrolls it
 *   horizontally when it gets wider than its panel (used as it is; give it `overflow-x: auto`).
 *   Without it, the helper wraps the table in `<div class="nwl-resize-wrap">`, which has no box
 *   (`display: contents`) until the first resize, and then scrolls (`overflow-x: auto`). Either
 *   way the wrapper has the class `nwl-resize-active` while the columns are resized, and also
 *   `nwl-resize-overflow` while the table is wider than it, so a given wrapper with the class
 *   `nwl-resize-wrap` behaves as the helper's own.
 * @returns {Object} `{ reset(), destroy() }`: reset() goes back to the automatic layout;
 *   destroy() also removes the handles and the wrapper the helper added.
 */
export const resizableColumns = (table, { wrapper } = {}) => {
  if (instances.has(table)) { return instances.get(table); }
  const columns = new ResizableColumns(table, wrapper);
  const api = { reset: () => columns.reset(), destroy: () => columns.destroy() };
  instances.set(table, api);

  return api;
};
