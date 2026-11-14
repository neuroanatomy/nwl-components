// The resize handle of resizableColumns() (resize.js): its markup and its listeners.
// No Vue import here: built into `nwl-components/resize` with resize.js.

const HANDLE_CLASS = 'nwl-col-resize';
const STEP = 10;
const BIG_STEP = 50;

export const widthOf = (el) => Math.round(el.getBoundingClientRect().width);

/**
 * The handle's markup: `<span class="nwl-col-resize" role="separator" aria-orientation="vertical"
 * tabindex="0" aria-label="Resize column …">`, empty (its line is drawn by resize.css).
 *
 * @param {Document} doc The document that will hold it.
 * @param {string} name The column's header text.
 * @returns {HTMLSpanElement} The handle, not yet in the page.
 */
export const createHandle = (doc, name) => {
  const handle = doc.createElement('span');
  handle.className = HANDLE_CLASS;
  handle.setAttribute('role', 'separator');
  handle.setAttribute('aria-orientation', 'vertical');
  handle.setAttribute('tabindex', '0');
  handle.setAttribute('aria-label', `Resize column ${name}`);

  return handle;
};

// a handle's pointer, keyboard and mouse listeners; returns the function that removes them
export const listenHandle = (columns, th, handle) => {
  let drag = null;
  const onPointerDown = (e) => {
    if (e.button !== 0) { return; }
    // no text selection, no focus change, no click on the header
    e.preventDefault();
    e.stopPropagation();
    drag = { id: e.pointerId, x: e.clientX, width: widthOf(th) };
    try { handle.setPointerCapture(e.pointerId); } catch (err) { /* not an active pointer (synthetic event) */ }
    handle.classList.add('nwl-dragging');
  };
  const onPointerMove = (e) => {
    if (!drag || e.pointerId !== drag.id) { return; }
    const dx = e.clientX - drag.x;
    if (dx !== 0 || columns.frozen) { columns.resize(th, drag.width + dx); }
  };
  const onPointerEnd = (e) => {
    if (!drag || e.pointerId !== drag.id) { return; }
    drag = null;
    handle.classList.remove('nwl-dragging');
    try { handle.releasePointerCapture(e.pointerId); } catch (err) { /* already released */ }
  };
  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const step = (e.shiftKey ? BIG_STEP : STEP) * (e.key === 'ArrowLeft' ? -1 : 1);
      columns.resize(th, widthOf(th) + step);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      columns.reset();
    }
  };
  const onFocus = () => { handle.setAttribute('aria-valuenow', String(widthOf(th))); };
  const stop = (e) => { e.stopPropagation(); };
  const onDoubleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    columns.reset();
  };
  const events = [
    ['pointerdown', onPointerDown], ['pointermove', onPointerMove], ['pointerup', onPointerEnd],
    ['pointercancel', onPointerEnd], ['lostpointercapture', onPointerEnd], ['keydown', onKeyDown],
    ['focus', onFocus], ['click', stop], ['mousedown', stop], ['dblclick', onDoubleClick]
  ];
  events.forEach(([type, fn]) => handle.addEventListener(type, fn));

  return () => events.forEach(([type, fn]) => handle.removeEventListener(type, fn));
};
