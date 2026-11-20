import { expect, spyOn, waitFor } from '@storybook/test';

import { embedScript } from '@/embed/script.js';
import { desiredEmbedHeight, positiveIntParam } from '@/embed/sizing.js';

// nwl-components/embed (3.6.0): the embed page's sizing and the /embed.js builder. No component:
// the play functions call them, and run the generated loaders in this page.
export default {
  title: 'Library/Embed'
};

const show = (lines) => () => ({
  setup: () => ({ lines }),
  template: '<ul class="helpers"><li v-for="line in lines" :key="line">{{ line }}</li></ul>'
});

// the two apps' configs, as they will pass them
const configs = {
  brainbox: {
    prefix: 'brainbox',
    appName: 'BrainBox',
    endpoint: '/mri/embed',
    required: 'url',
    params: { url: 'url', view: 'view', slice: 'slice', project: 'project', annotation: 'annotation', maxHeight: 'maxHeight', brainboxLink: 'brainboxLink' },
    optionsDoc: [
      ['data-url', 'source URL of the MRI            (required)'],
      ['data-view', 'sag | cor | axi'],
      ['data-brainbox-link', '"0" hides the BrainBox button']
    ]
  },
  microdraw: {
    prefix: 'microdraw',
    appName: 'MicroDraw',
    endpoint: '/data/embed',
    required: 'source',
    params: { source: 'source', project: 'project', slice: 'slice', maxHeight: 'maxHeight', microdrawLink: 'microdrawLink' },
    optionsDoc: [
      ['data-source', 'source URL of the dataset          (required)'],
      ['data-microdraw-link', '"0" hides the MicroDraw link']
    ]
  }
};

export const Sizing = show([
  'desiredEmbedHeight({ width, aspect, toolbarHeight, minHeight = 160, maxHeight = Infinity }): round(width / aspect) + toolbar, within min and max, the min winning; NaN without a width or an aspect',
  'positiveIntParam(value): a positive integer, or undefined'
]).bind({});
// eslint-disable-next-line max-statements
Sizing.play = async () => {
  // microdraw's cases (test/api/embed-sizing.spec.js)
  await expect(desiredEmbedHeight({ width: 560, aspect: 2, toolbarHeight: 32 })).toBe(312);
  await expect(desiredEmbedHeight({ width: 560, aspect: 0.5, toolbarHeight: 32 })).toBe(1152);
  await expect(desiredEmbedHeight({ width: 333, aspect: 1.5, toolbarHeight: 0 })).toBe(222);
  await expect(desiredEmbedHeight({ width: 400, aspect: 1, toolbarHeight: NaN })).toBe(400);
  await expect(desiredEmbedHeight({ width: 560, aspect: 0.5, toolbarHeight: 32, maxHeight: 600 })).toBe(600);
  await expect(desiredEmbedHeight({ width: 100, aspect: 10, toolbarHeight: 0 })).toBe(160);
  await expect(desiredEmbedHeight({ width: 100, aspect: 10, toolbarHeight: 0, minHeight: 50, maxHeight: 40 })).toBe(50);
  await expect(desiredEmbedHeight({ width: 0, aspect: 1, toolbarHeight: 0 })).toBeNaN();
  await expect(desiredEmbedHeight({ width: 500, aspect: NaN, toolbarHeight: 0 })).toBeNaN();
  // BrainBox's cases (test/unit/embed.sizing.spec.js); the Sloth Bear's planes, 0.33 mm isotropic
  await expect(desiredEmbedHeight({ width: 512, aspect: 2, toolbarHeight: 54 })).toBe(256 + 54);
  const forAspect = (aspect) => desiredEmbedHeight({ width: 512, aspect, toolbarHeight: 54 });
  const [sag, cor, axi] = [forAspect(300 / 270), forAspect(230 / 270), forAspect(230 / 300)];
  await expect(sag).toBeLessThan(cor);
  await expect(axi).toBeGreaterThan(cor);
  await expect(forAspect(230 / 270)).toBe(cor);
  await expect(desiredEmbedHeight({ width: 300, aspect: 1, toolbarHeight: 0 })).toBe(300);
  await expect(desiredEmbedHeight({ width: 600, aspect: 1, toolbarHeight: 0 })).toBe(600);
  await expect(desiredEmbedHeight({ width: 1000, aspect: 0.5, toolbarHeight: 54, maxHeight: 700 })).toBe(700);
  await expect(desiredEmbedHeight({ width: 100, aspect: 10, toolbarHeight: 0, minHeight: 160 })).toBe(160);
  await expect(desiredEmbedHeight({ width: 500, aspect: 1, toolbarHeight: 0, minHeight: 300, maxHeight: 100 })).toBe(300);
  await expect(desiredEmbedHeight({ width: 512, aspect: NaN, toolbarHeight: 54 })).toBeNaN();
  await expect(desiredEmbedHeight({ width: 0, aspect: 1, toolbarHeight: 54 })).toBeNaN();
  await expect(desiredEmbedHeight({ width: 400, aspect: 2, toolbarHeight: NaN })).toBe(200);
  // positiveIntParam (microdraw's cases; BrainBox's embed page had the same function)
  await expect(positiveIntParam('600')).toBe(600);
  // eslint-disable-next-line no-undefined
  await expect(['0', '-5', 'abc', '', null].map(positiveIntParam)).toEqual(Array(5).fill(undefined));
};

// a <script> as a host page writes it, but not fetched (not JavaScript): the loader finds it by
// its src, document.currentScript being null under new Function. Port 9 refuses at once.
const hostScript = (parent, data) => {
  const script = document.createElement('script');
  script.type = 'text/x-embed-test';
  script.src = 'http://127.0.0.1:9/embed.js';
  Object.assign(script.dataset, data);
  parent.appendChild(script);

  return script;
};

// post `data` to this page from inside `frame` (same origin once it shows about:blank), and
// resolve once this page's listeners have seen it (Storybook posts messages too: `sent` tells ours)
let sent = 0;
const postFrom = async (frame, data) => {
  sent += 1;
  const message = { ...data, sent };
  const seen = new Promise((resolve) => {
    const done = (event) => {
      if (!event.data || event.data.sent !== message.sent) { return; }
      window.removeEventListener('message', done);
      resolve();
    };
    window.addEventListener('message', done);
  });
  frame.contentWindow.eval(`parent.postMessage(${JSON.stringify(message)}, '*')`);
  await seen;
};

const toBlank = async (frame) => {
  frame.src = 'about:blank';
  await waitFor(() => expect(frame.contentWindow.location.href).toBe('about:blank'));
};

// eslint-disable-next-line max-statements
const playLoader = (name, data, expectedSrc) => async ({ canvasElement }) => {
  const config = configs[name];
  const text = embedScript(config);
  // no placeholder left, and it parses
  await expect(text).not.toMatch(/__NWL_|@nwl-embed/);
  await expect(text).toContain(`"${name}:embed-resize"`);
  await expect(text).toContain(`"__${name}Embeds"`);
  await expect(text).toContain(`"${config.endpoint}"`);
  await expect(text).toContain(` * Options, all optional except data-${config.required}:`);
  // eslint-disable-next-line no-new-func
  const run = new Function(text);

  delete window[`__${name}Embeds`];
  const listeners = spyOn(window, 'addEventListener');
  // the message listeners a run of the loader adds (Storybook adds its own meanwhile)
  const listenersAdded = (fn) => {
    const count = () => listeners.mock.calls.filter(([type]) => type === 'message').length;
    const before = count();
    fn();

    return count() - before;
  };

  // one script, one iframe, where the script is
  const first = hostScript(canvasElement, data);
  await expect(listenersAdded(run)).toBe(1);
  const frames = () => canvasElement.querySelectorAll(`iframe.${name}-embed`);
  await expect(frames().length).toBe(1);
  const [frame] = frames();
  await expect(frame.nextElementSibling).toBe(first);
  await expect(frame.getAttribute('src')).toBe(expectedSrc);
  await expect(frame.title).toBe(`${config.appName} viewer`);
  await expect(frame.style.height).toBe('420px');
  await expect(frame.style.maxWidth).toBe('560px');
  await expect(first.hasAttribute(`data-${name}-embedded`)).toBe(true);
  // running again finds no new script: nothing more
  run();
  await expect(frames().length).toBe(1);

  // its frame's resize message sets its height, up to 4000; another app's, or one from this
  // page, doesn't
  await toBlank(frame);
  await postFrom(frame, { type: `${name}:embed-resize`, height: 512 });
  await expect(frame.style.height).toBe('512px');
  await postFrom(frame, { type: `${name}:embed-resize`, height: 4000 });
  await expect(frame.style.height).toBe('4000px');
  await postFrom(frame, { type: `${name}:embed-resize`, height: 4001 });
  await expect(frame.style.height).toBe('4000px');
  await postFrom(frame, { type: 'other:embed-resize', height: 300 });
  await expect(frame.style.height).toBe('4000px');
  window.postMessage({ type: `${name}:embed-resize`, height: 300 }, '*');
  await postFrom(frame, { type: 'flush' });
  await expect(frame.style.height).toBe('4000px');

  // a second copy on the page: its frame is in the same registry, no second listener
  const target = document.createElement('div');
  target.id = `${name}-target`;
  canvasElement.appendChild(target);
  hostScript(canvasElement, { ...data, target: `#${name}-target`, height: '300px', maxWidth: '400px' });
  await expect(listenersAdded(run)).toBe(0);
  await expect(frames().length).toBe(2);
  const second = target.querySelector('iframe');
  await expect(second.style.height).toBe('300px');
  await expect(second.style.maxWidth).toBe('400px');
  await expect(window[`__${name}Embeds`].frames).toEqual([frame, second]);
  await expect(window[`__${name}Embeds`].listening).toBe(true);
  await toBlank(second);
  await postFrom(second, { type: `${name}:embed-resize`, height: 222 });
  await expect(second.style.height).toBe('222px');
  await expect(frame.style.height).toBe('4000px');
  listeners.mockRestore();

  // without the required attribute: an error in the console, no frame
  const errors = spyOn(console, 'error').mockImplementation(() => null);
  hostScript(canvasElement, { project: 'p' });
  run();
  await expect(errors).toHaveBeenCalledWith(`${config.appName} embed: data-${config.required} is required`);
  errors.mockRestore();
  await expect(frames().length).toBe(2);
};

export const LoaderBrainBox = show([
  'embedScript({ prefix: \'brainbox\', appName: \'BrainBox\', endpoint: \'/mri/embed\', required: \'url\', params, optionsDoc })',
  'one iframe per script, /mri/embed?<params>, resized by brainbox:embed-resize from its own frame (up to 4000 px), one listener per page'
]).bind({});
LoaderBrainBox.play = playLoader(
  'brainbox',
  { url: 'https://example.org/brain.nii.gz', view: 'sag', maxHeight: '600', brainboxLink: '0' },
  'http://127.0.0.1:9/mri/embed?url=https%3A%2F%2Fexample.org%2Fbrain.nii.gz&view=sag&maxHeight=600&brainboxLink=0'
);

export const LoaderMicroDraw = show([
  'embedScript({ prefix: \'microdraw\', appName: \'MicroDraw\', endpoint: \'/data/embed\', required: \'source\', params, optionsDoc })',
  'one iframe per script, /data/embed?<params>, resized by microdraw:embed-resize from its own frame (up to 4000 px), one listener per page'
]).bind({});
LoaderMicroDraw.play = playLoader(
  'microdraw',
  { source: 'https://example.org/data.json', project: 'my project', slice: '3' },
  'http://127.0.0.1:9/data/embed?source=https%3A%2F%2Fexample.org%2Fdata.json&project=my%20project&slice=3'
);

export const BadConfig = show(['embedScript throws on a config it cannot use, and on */ in the header texts']).bind({});
BadConfig.play = async () => {
  const bad = (change) => () => embedScript({ ...configs.microdraw, ...change });
  await expect(bad({ prefix: 'Micro-draw' })).toThrow('embedScript: prefix');
  await expect(bad({ endpoint: 'data/embed' })).toThrow('embedScript: endpoint');
  await expect(bad({ required: 'url' })).toThrow('embedScript: required');
  await expect(bad({ params: {} })).toThrow('embedScript: params');
  await expect(bad({ optionsDoc: [['data-source', 'ends */ here']] })).toThrow('*/');
  await expect(bad({ appName: '' })).toThrow('embedScript: appName');
};
