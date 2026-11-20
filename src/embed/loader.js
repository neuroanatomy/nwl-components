/* @nwl-embed-header */
/* global __NWL_EMBED_CONFIG__ */
/* eslint max-statements: ["error", 15] */
(function () {
  'use strict';

  // this app's names; embedScript(config), in nwl-components/embed, wrote them here
  const CONFIG = __NWL_EMBED_CONFIG__;

  const RESIZE_MESSAGE = CONFIG.resizeMessage;
  const MAX_SANE_HEIGHT = 4000;

  // data-* attribute (camelCased by dataset) -> embed page query parameter
  const QUERY_ATTRIBUTES = CONFIG.params;

  // the frames of this page, shared by every copy of the script it loads
  const registry = window[CONFIG.registry] || (window[CONFIG.registry] = { frames: [], listening: false });

  /**
   * The <script> element being executed. document.currentScript covers the
   * normal case; the fallback covers async/deferred loading, where it is null.
   * @returns {Element|null} The script element that pulled us in
   */
  const findScript = function () {
    if (document.currentScript) { return document.currentScript; }
    const candidates = document.querySelectorAll('script[src*="embed.js"]:not([' + CONFIG.marker + '])');

    return candidates.length ? candidates[candidates.length - 1] : null;
  };

  /**
   * @param {Element} script The script element
   * @returns {string} Origin the app is served from
   */
  const appOrigin = function (script) {
    const link = document.createElement('a');
    link.href = script.src;

    return link.protocol + '//' + link.host;
  };

  /**
   * @param {Element} script The script element carrying the data-* options
   * @returns {string} Query string for the embed page
   */
  const queryString = function (script) {
    const parts = [];
    Object.keys(QUERY_ATTRIBUTES).forEach(function (key) {
      const value = script.dataset[key];
      if (value) {
        parts.push(QUERY_ATTRIBUTES[key] + '=' + encodeURIComponent(value));
      }
    });

    return parts.join('&');
  };

  /**
   * Resize the iframe a message came from. The sender is identified by its
   * window, so one embed cannot resize another and an unrelated page cannot
   * resize any of them.
   * @param {MessageEvent} event The postMessage event
   * @returns {void}
   */
  const onMessage = function (event) {
    if (!event.data || event.data.type !== RESIZE_MESSAGE) { return; }
    const { height } = event.data;
    if (typeof height !== 'number' || !isFinite(height) || height <= 0 || height > MAX_SANE_HEIGHT) { return; }

    const target = registry.frames.find(function (frame) {
      return event.source === frame.contentWindow;
    });
    if (target) { target.style.height = height + 'px'; }
  };

  /**
   * @param {Element} script The script element
   * @returns {Element} The iframe to show the viewer in
   */
  const buildFrame = function (script) {
    const frame = document.createElement('iframe');
    frame.className = CONFIG.prefix + '-embed';
    frame.title = CONFIG.appName + ' viewer';
    frame.setAttribute('allow', 'fullscreen');
    frame.setAttribute('allowfullscreen', '');
    frame.style.display = 'block';
    frame.style.border = '0';
    frame.style.background = '#222';
    frame.style.width = script.dataset.width || '100%';
    frame.style.maxWidth = script.dataset.maxWidth || '560px';
    // a starting guess only: the viewer reports the height it needs as soon
    // as it knows the shape of the image
    frame.style.height = script.dataset.height || '420px';

    return frame;
  };

  /**
   * @param {Element} script The script element
   * @param {Element} frame The iframe to place
   * @returns {void}
   */
  const place = function (script, frame) {
    const target = script.dataset.target ? document.querySelector(script.dataset.target) : null;
    if (target) {
      target.appendChild(frame);
    } else if (script.parentNode) {
      script.parentNode.insertBefore(frame, script);
    }
  };

  const init = function () {
    const script = findScript();
    if (!script || script.hasAttribute(CONFIG.marker)) { return; }
    script.setAttribute(CONFIG.marker, '');

    if (!script.dataset[CONFIG.required]) {
      console.error(CONFIG.appName + ' embed: ' + CONFIG.requiredAttribute + ' is required');

      return;
    }

    const frame = buildFrame(script);
    frame.src = appOrigin(script) + CONFIG.endpoint + '?' + queryString(script);
    place(script, frame);
    registry.frames.push(frame);

    // one listener for the whole page, however many embeds it has
    if (!registry.listening) {
      registry.listening = true;
      window.addEventListener('message', onMessage);
    }
  };

  init();
}());
