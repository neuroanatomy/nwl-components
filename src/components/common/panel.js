// Floating panels (widgets.css .nwl-panel) that are moved and resized: pinned by their top-left
// corner from the first press on them. No Vue import here: this file is also built alone as
// `nwl-components/panel` (a UMD global `nwlComponentsPanel` for pages with no bundle).
//
// A panel centred with `top: 50%; left: 50%; transform: translate(-50%, -50%)` keeps its centre
// where it is when its size changes, so a resize grows it in every direction, not only towards
// the corner pulled. At rest it shows centred; at the first
// pointerdown on it (its resize handle, its header, anything in it), before the app's own
// mousedown or touchstart drag handler runs, pinPanel() replaces the transform with explicit
// `left` / `top` in px at the same place: from then on, the edges opposite the corner pulled
// stay put, and a drag moves its top-left corner.

const px = (value) => `${Math.round(value * 100) / 100}px`;

/**
 * Pin a panel by its top-left corner, where it shows now: `transform: none`, `left` and `top`
 * in px (`right` and `bottom` auto). It doesn't move on screen; its size doesn't change.
 *
 * @param {HTMLElement} panel The panel.
 * @returns {void}
 */
export const pinPanel = (panel) => {
  const before = panel.getBoundingClientRect();
  Object.assign(panel.style, { transform: 'none', right: 'auto', bottom: 'auto', left: px(before.left), top: px(before.top) });
  // left and top are from the containing block, which need not be at the viewport's origin
  const after = panel.getBoundingClientRect();
  Object.assign(panel.style, { left: px(2 * before.left - after.left), top: px(2 * before.top - after.top) });
};

/**
 * Whether a panel is still placed by a transform (centred), i.e. not pinned yet.
 *
 * @param {HTMLElement} panel The panel.
 * @returns {boolean} True while it has a transform.
 */
export const isTransformed = (panel) => getComputedStyle(panel).transform !== 'none';

// The resize handle (3.3.0). iOS and iPadOS Safari have no `resize: both` corner, so a finger
// couldn't resize a panel: a resizable panel gets a handle of its own in its bottom-right corner
// (widgets.css .nwl-panel-resize-handle), dragged with pointer events (mouse, pen, finger) or
// moved with the arrow keys, and its native `resize` is turned off (inline `resize: none`), so
// there is one corner and one behaviour everywhere.

export const MIN_WIDTH = 160;
export const MIN_HEIGHT = 100;
const STEP = 10;
const BIG_STEP = 50;
const HANDLE_CLASS = 'nwl-panel-resize-handle';

/**
 * Whether a panel is resizable: the class `nwl-panel-resizable`, or a computed `resize` other
 * than `none` (an app's `resize: both`).
 *
 * @param {HTMLElement} panel The panel.
 * @returns {boolean} True when it is resizable.
 */
export const isResizable = (panel) => panel.classList.contains('nwl-panel-resizable') ||
  getComputedStyle(panel).resize !== 'none';

const clamp = (value, min, max) => Math.min(Math.max(value, min), Math.max(min, max));

/**
 * Size a panel: its border box `width` × `height` px, at least MIN_WIDTH × MIN_HEIGHT, never
 * larger than the viewport nor past its right and bottom edges. Pins it first (pinPanel), so
 * it grows from its bottom-right corner.
 *
 * @param {HTMLElement} panel The panel.
 * @param {number} width The border box width wanted, in px.
 * @param {number} height The border box height wanted, in px.
 * @returns {void}
 */
export const sizePanel = (panel, width, height) => {
  if (isTransformed(panel)) { pinPanel(panel); }
  const rect = panel.getBoundingClientRect();
  const style = getComputedStyle(panel);
  // width and height are the border box (widgets.css box-sizing), or the content box
  const [extraW, extraH] = [rect.width - parseFloat(style.width), rect.height - parseFloat(style.height)];
  const { clientWidth, clientHeight } = panel.ownerDocument.documentElement;
  const w = clamp(Math.round(width), MIN_WIDTH, Math.min(clientWidth, clientWidth - rect.left));
  const h = clamp(Math.round(height), MIN_HEIGHT, Math.min(clientHeight, clientHeight - rect.top));
  Object.assign(panel.style, { width: px(w - (extraW || 0)), height: px(h - (extraH || 0)) });
};

const handles = new WeakMap();

// the handle's markup: empty, its corner mark drawn by widgets.css
const createPanelHandle = (doc) => {
  const handle = doc.createElement('span');
  handle.className = HANDLE_CLASS;
  handle.setAttribute('role', 'button');
  handle.setAttribute('tabindex', '0');
  handle.setAttribute('aria-label', 'Resize');
  handle.title = 'Resize';

  return handle;
};

const KEYS = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };

// the handle's pointer and keyboard listeners
const listenPanelHandle = (panel, handle) => {
  let drag = null;
  const onPointerDown = (e) => {
    if (e.button !== 0) { return; }
    // no text selection, no emulated mouse events, no drag of the panel or of what is behind it
    e.preventDefault();
    e.stopPropagation();
    if (isTransformed(panel)) { pinPanel(panel); }
    const { width, height } = panel.getBoundingClientRect();
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, width, height };
    try { handle.setPointerCapture(e.pointerId); } catch (err) { /* not an active pointer (synthetic event) */ }
    handle.classList.add('nwl-dragging');
  };
  const onPointerMove = (e) => {
    if (!drag || e.pointerId !== drag.id) { return; }
    e.preventDefault();
    sizePanel(panel, drag.width + e.clientX - drag.x, drag.height + e.clientY - drag.y);
  };
  const onPointerEnd = (e) => {
    if (!drag || e.pointerId !== drag.id) { return; }
    drag = null;
    handle.classList.remove('nwl-dragging');
    try { handle.releasePointerCapture(e.pointerId); } catch (err) { /* already released */ }
  };
  const onKeyDown = (e) => {
    if (!KEYS[e.key]) { return; }
    e.preventDefault();
    e.stopPropagation();
    const step = e.shiftKey ? BIG_STEP : STEP;
    const [dx, dy] = KEYS[e.key];
    const { width, height } = panel.getBoundingClientRect();
    sizePanel(panel, width + dx * step, height + dy * step);
  };
  const stop = (e) => { e.stopPropagation(); };
  [
    ['pointerdown', onPointerDown], ['pointermove', onPointerMove], ['pointerup', onPointerEnd],
    ['pointercancel', onPointerEnd], ['lostpointercapture', onPointerEnd], ['keydown', onKeyDown],
    ['mousedown', stop], ['touchstart', stop], ['click', stop]
  ].forEach(([type, fn]) => handle.addEventListener(type, fn));
};

/**
 * Give a panel its resize handle: a `<span class="nwl-panel-resize-handle" role="button"
 * tabindex="0" aria-label="Resize">` as its last child, dragged with pointer events (pointer
 * capture, `touch-action: none`) or the arrow keys (10px, 50px with Shift); a drag pins the
 * panel first. Turns the native `resize` off (inline `resize: none`). A panel that isn't
 * positioned becomes `position: relative`, so the handle sits in its corner. A second call
 * does nothing.
 *
 * @param {HTMLElement} panel The panel.
 * @returns {HTMLElement} The handle.
 */
export const resizablePanel = (panel) => {
  if (handles.has(panel)) { return handles.get(panel); }
  const handle = createPanelHandle(panel.ownerDocument);
  handles.set(panel, handle);
  panel.style.resize = 'none';
  if (getComputedStyle(panel).position === 'static') { panel.style.position = 'relative'; }
  listenPanelHandle(panel, handle);
  panel.appendChild(handle);

  return handle;
};

const ready = new WeakSet();

/**
 * Make a floating panel pin itself (pinPanel) at the first pointerdown on it while it is still
 * centred by a transform, and, when it is resizable (isResizable), give it its resize handle
 * (resizablePanel). Call it once the panel exists (a second call does nothing). Its drag
 * handler then places the panel's top-left corner: `left = pointerX - (pressX - rect.left)`.
 *
 * @param {HTMLElement} panel The panel.
 * @returns {HTMLElement} The panel.
 */
export const floatingPanel = (panel) => {
  if (!panel || ready.has(panel)) { return panel; }
  ready.add(panel);
  // capture: before any handler inside the panel
  panel.addEventListener('pointerdown', () => {
    if (isTransformed(panel)) { pinPanel(panel); }
  }, true);
  if (isResizable(panel)) { resizablePanel(panel); }

  return panel;
};

