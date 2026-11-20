import loader from './loader.js?raw';

// embedScript(config): the text of an app's /embed.js, the loader a host page includes to get an
// iframe of the app's embed page, kept at the height the viewer asks for (BrainBox's
// public/embed.js and microdraw's app/public/embed.js, which were line-for-line ports of each
// other). The text is src/embed/loader.js as written, unminified and with its comments: whoever
// decides whether to trust the script reads it. embedScript puts the app's header comment on its
// first line and the app's names, as a JSON literal, in `const CONFIG` at its top; nothing else
// changes.

const HEADER_MARK = '/* @nwl-embed-header */';
const GLOBAL_LINE = '/* global __NWL_EMBED_CONFIG__ */\n';
const CONFIG_MARK = '__NWL_EMBED_CONFIG__';

const NAME = /^[a-z][a-z0-9]*$/;
const KEY = /^[a-zA-Z][a-zA-Z0-9]*$/;

// dataset key -> attribute: maxHeight -> data-max-height
const dataAttribute = (key) => 'data-' + key.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());

const fail = (message) => {
  throw new Error('embedScript: ' + message);
};

// eslint-disable-next-line max-statements, complexity
const check = ({ prefix, appName, endpoint, required, params, optionsDoc }) => {
  if (typeof prefix !== 'string' || !NAME.test(prefix)) { fail('prefix must be lower case letters and digits'); }
  if (typeof appName !== 'string' || !appName.trim()) { fail('appName is required'); }
  if (typeof endpoint !== 'string' || !endpoint.startsWith('/')) { fail('endpoint must start with /'); }
  if (!params || typeof params !== 'object' || Object.keys(params).length === 0) { fail('params is required'); }
  for (const [key, query] of Object.entries(params)) {
    if (!KEY.test(key) || typeof query !== 'string' || !query) { fail(`params.${key} is not usable`); }
  }
  if (typeof required !== 'string' || !Object.prototype.hasOwnProperty.call(params, required)) { fail('required must be one of the params'); }
  if (!Array.isArray(optionsDoc) || !optionsDoc.every((line) => Array.isArray(line) && line.length === 2 &&
      line.every((s) => typeof s === 'string'))) {
    fail('optionsDoc must be a list of [attribute, description]');
  }
  // the names go in the header comment
  const texts = [appName, endpoint, ...optionsDoc.flat()];
  if (texts.some((s) => s.includes('*/'))) { fail('no */ in appName, endpoint or optionsDoc'); }
};

// the options all apps have, after the app's own
const COMMON_OPTIONS = [
  ['data-width', 'CSS width of the box     (default 100%)'],
  ['data-max-width', 'CSS max-width of the box (default 560px)'],
  ['data-height', 'CSS height to start from (default 420px)'],
  ['data-target', 'CSS selector of the element to render into; by\ndefault the viewer appears where the script tag is']
];

const header = ({ appName, endpoint, required, optionsDoc }) => {
  const options = [...optionsDoc, ...COMMON_OPTIONS];
  const width = Math.max(...options.map(([name]) => name.length)) + 2;
  const optionLines = options.flatMap(([name, text]) => text.split('\n')
    .map((line, i) => '   ' + (i === 0 ? name : '').padEnd(width) + line));

  return [
    '/**',
    ` * ${appName} embed loader.`,
    ' *',
    ' * Drop one line into a page and get a viewer:',
    ' *',
    ` *   <script src="https://<${appName}'s address>/embed.js"`,
    ` *           ${dataAttribute(required)}="..."></script>`,
    ' *',
    ` * The script inserts an <iframe> pointing at ${endpoint} where it sits, and`,
    ' * keeps that iframe at the height the viewer asks for. It is what a host page',
    ' * can write by hand; this only removes the copy-pasting.',
    ' *',
    ' * Dependency-free and unbundled: it is served from a fixed, cacheable URL, and',
    ' * whoever decides whether to trust it can read it. Made by embedScript() of',
    ' * nwl-components/embed (src/embed/loader.js).',
    ' *',
    ` * Options, all optional except ${dataAttribute(required)}:`,
    ...optionLines.map((line) => ' *' + line.trimEnd()),
    ' */'
  ].join('\n');
};

/**
 * The text of an app's /embed.js
 * @param {object} config The app's names
 * @param {string} config.prefix Message prefix and names: 'brainbox' gives brainbox:embed-resize,
 *   window.__brainboxEmbeds, data-brainbox-embedded and the iframe class brainbox-embed
 * @param {string} config.appName Name in the console messages, the iframe title and the header
 * @param {string} config.endpoint Path of the embed page ('/mri/embed')
 * @param {string} config.required Dataset key of the required attribute ('url': data-url)
 * @param {object} config.params Dataset key -> query parameter, in the order of the query string
 * @param {Array<Array<string>>} config.optionsDoc [attribute, description] of the app's options,
 *   for the header comment (the CSS options all apps have are added after them)
 * @returns {string} JavaScript, to serve as application/javascript
 */
export const embedScript = function (config) {
  check(config);
  const { prefix, appName, endpoint, required, params } = config;
  const names = {
    prefix,
    appName,
    endpoint,
    required,
    requiredAttribute: dataAttribute(required),
    params,
    resizeMessage: `${prefix}:embed-resize`,
    registry: `__${prefix}Embeds`,
    marker: `data-${prefix}-embedded`
  };
  // indented as the line it is put in
  const literal = JSON.stringify(names, null, 2).replace(/\n/g, '\n  ');

  return loader
    .replace(HEADER_MARK, () => header(config))
    .replace(GLOBAL_LINE, '')
    .replace(CONFIG_MARK, () => literal);
};
