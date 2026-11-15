// Floating panels (widgets.css .nwl-panel) that are moved and resized: pinned by their top-left
// corner from the first press on them. No Vue import here: this file is also built alone as
// `nwl-components/panel` (a UMD global `nwlComponentsPanel` for pages with no bundle).
//
// A panel centred with `top: 50%; left: 50%; transform: translate(-50%, -50%)` keeps its centre
// where it is when its size changes, so its resize corner (`resize: both`) grows it in every
// direction, not only towards the corner pulled. At rest it shows centred; at the first
// pointerdown on it (its resize corner, its header, anything in it), before the app's own
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

const ready = new WeakSet();

/**
 * Make a floating panel pin itself (pinPanel) at the first pointerdown on it while it is still
 * centred by a transform. Call it once the panel exists (a second call does nothing). Its
 * drag handler then places the panel's top-left corner: `left = pointerX - (pressX - rect.left)`.
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

  return panel;
};
