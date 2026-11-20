/**
 * Sizing arithmetic of the apps' embeddable viewers (BrainBox's /mri/embed, microdraw's
 * /data/embed): the bodies of view/shared/embedSizing.js and app/public/js/embed-sizing.js,
 * which were the same. The aspect functions stay in the apps (BrainBox's planeAspect,
 * microdraw's imageAspect): they follow each data model.
 *
 * The height an embed needs is computed from the image's aspect ratio, never measured from the
 * DOM: inside an iframe, the document's height is the iframe's, so a measured height could only
 * ever grow.
 */

/**
 * Height the host page should give the iframe, so that the image is not letterboxed
 * @param {object} opts Options
 * @param {number} opts.width Content width of the embed, in px
 * @param {number} opts.aspect The image's aspect ratio (width / height)
 * @param {number} opts.toolbarHeight Height of the toolbar below the image, in px
 * @param {number} [opts.minHeight] Never less than this
 * @param {number} [opts.maxHeight] Never more than this
 * @returns {number} Integer height in px, or NaN when the aspect is unknown
 */
export const desiredEmbedHeight = function ({ width, aspect, toolbarHeight, minHeight = 160, maxHeight = Infinity }) {
  if (!isFinite(width) || width <= 0 || !isFinite(aspect) || aspect <= 0) {
    return NaN;
  }

  const bar = isFinite(toolbarHeight) ? toolbarHeight : 0;
  const ideal = Math.round(width / aspect) + bar;

  // a max below the min is contradictory: keep the min, a smaller box
  // cannot show anything useful
  return Math.max(minHeight, Math.min(maxHeight, ideal));
};

/**
 * A positive integer query parameter (maxHeight)
 * @param {string} value The raw value
 * @returns {number|undefined} The number, or undefined when unusable
 */
export const positiveIntParam = function (value) {
  const n = parseInt(value, 10);

  // eslint-disable-next-line no-undefined
  return (isFinite(n) && n > 0) ? n : undefined;
};
