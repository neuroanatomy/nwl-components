import { expect, fn, userEvent, waitFor, within } from '@storybook/test';
import { inject, onMounted, onUnmounted, provide } from 'vue';

import SettingsPage from '@/components/pages/SettingsPage.vue';
import { useBatchedFiles } from '@/components/settings/useBatchedFiles.js';

export default {
  title: 'Pages/Settings',
  component: SettingsPage
};

const makeProject = (name) => ({
  name,
  shortname: 'testproject',
  url: '',
  brainboxURL: '/project/testproject',
  created: '2022-02-08T10:14:13.331Z',
  owner: 'dhovart',
  collaborators: {
    list: [
      {
        userID: 'anyone',
        access: {
          collaborators: 'view',
          annotations: 'edit',
          files: 'none'
        },
        username: 'anyone',
        name: 'Any User'
      },
      {
        userID: 'some-collaborator',
        access: {
          collaborators: 'view',
          annotations: 'add',
          files: 'view'
        },
        name: 'Some collaborator',
        username: 'some-collaborator'
      }
    ]
  },
  files: {
    list: ['https://dl.dropbox.com/s/cny5b3so267bv94/p32-f18-uchar.nii.gz']
  },
  annotations: {
    list: [
      {
        type: 'volume',
        name: 'foo',
        values: 'cerebrum.json',
        display: true
      },
      {
        type: 'volume',
        name: 'blah',
        values: 'nimhmacaque.json',
        display: false
      },
      {
        type: 'volume',
        name: 'truc',
        values: 'axolotl_labels.json',
        display: true
      },
      {
        type: 'text',
        name: 'comment',
        values: '',
        display: true
      }
    ]
  },
  modified: '2022-02-20T19:18:15.829Z',
  modifiedBy: 'dhovart'
});

const Template = (args) => ({
  components: { SettingsPage },
  setup () {
    const project = makeProject(args.name);
    if (args.withoutFiles) {
      delete project.files;
    }

    return { project };
  },
  template: '<SettingsPage :project="project" />'
});

const getTitle = (canvasElement) => canvasElement.querySelector('.title[contenteditable]');

// Put the caret at the end of the title and type, the way a user does.
const typeAtEnd = async (title, text) => {
  title.focus();
  const range = document.createRange();
  range.selectNodeContents(title);
  range.collapse(false);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  await userEvent.keyboard(text);
};

export const Default = Template.bind({});
Default.args = { name: 'test project' };
// the project name under the mandala is centred; headings are semibold (3.0.0), not moved
Default.play = async ({ canvasElement }) => {
  const title = canvasElement.querySelector('.description h1');
  await expect(getComputedStyle(title).textAlign).toBe('center');
  await expect(getComputedStyle(title).fontWeight).toBe('600');
};

export const EmptyName = Template.bind({});
EmptyName.args = { name: '' };

// A project document without `files` (older apps): the page must still render.
export const WithoutFiles = Template.bind({});
WithoutFiles.args = { name: 'test project', withoutFiles: true };
WithoutFiles.play = async ({ canvasElement }) => {
  await waitFor(() => expect(canvasElement.querySelector('#numFiles').textContent).toBe('0'));
};

// Interaction tests, run by `npm run test-storybook`.
export const TypeTitle = Template.bind({});
TypeTitle.args = { name: 'test project' };
TypeTitle.play = async ({ canvasElement }) => {
  const title = getTitle(canvasElement);
  // the initial name is rendered
  await expect(title.textContent).toBe('test project');
  await expect(title.classList.contains('empty')).toBe(false);
  // typing appends in order (the title used to be written right to left)
  await typeAtEnd(title, ' 2');
  await waitFor(() => expect(title.textContent).toBe('test project 2'));
};

export const TypeEmptyTitle = Template.bind({});
TypeEmptyTitle.args = { name: '' };
TypeEmptyTitle.play = async ({ canvasElement }) => {
  const title = getTitle(canvasElement);
  // the placeholder shows while the name is empty...
  await expect(title.textContent).toBe('');
  await expect(title.classList.contains('empty')).toBe(true);
  // ...and goes away once something is typed
  await typeAtEnd(title, 'abc');
  await waitFor(() => expect(title.textContent).toBe('abc'));
  await waitFor(() => expect(title.classList.contains('empty')).toBe(false));
};

// Stories for the optional config settings (see README, "Configuration").
// The decorator adds settings to the config provided by .storybook/preview.js.
const withConfig = (extra) => () => ({
  setup () {
    provide('config', { ...inject('config'), ...extra });
  },
  template: '<story/>'
});

// Replace window.fetch while `run` executes, and return the mock.
const withMockedFetch = async (run) => {
  const originalFetch = window.fetch;
  const mockFetch = fn(() => Promise.resolve(new Response(JSON.stringify({ success: true, message: 'Saved' }))));
  window.fetch = mockFetch;
  try {
    await run();
  } finally {
    window.fetch = originalFetch;
  }

  return mockFetch;
};

export const WithoutEmbedButton = Template.bind({});
WithoutEmbedButton.args = { name: 'test project' };
WithoutEmbedButton.decorators = [withConfig({ showEmbedButton: false })];
WithoutEmbedButton.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await expect(canvas.getByText('Save Changes')).toBeTruthy();
  await expect(canvas.queryByText('Embed Project')).toBeNull();
};

const cancelSave = fn(() => Promise.resolve(false));
export const BeforeSaveCancels = Template.bind({});
BeforeSaveCancels.args = { name: 'test project' };
BeforeSaveCancels.decorators = [withConfig({ beforeSaveProject: cancelSave })];
BeforeSaveCancels.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await expect(canvas.getByText('Embed Project')).toBeTruthy();
  cancelSave.mockClear();
  const mockFetch = await withMockedFetch(async () => {
    await userEvent.click(canvas.getByText('Save Changes'));
    await waitFor(() => expect(cancelSave).toHaveBeenCalledTimes(1));
  });
  await expect(cancelSave.mock.calls[0][0].shortname).toBe('testproject');
  await expect(mockFetch).not.toHaveBeenCalled();
};

const allowSave = fn(() => Promise.resolve(true));
export const BeforeSaveAllows = Template.bind({});
BeforeSaveAllows.args = { name: 'test project' };
BeforeSaveAllows.decorators = [withConfig({ beforeSaveProject: allowSave })];
BeforeSaveAllows.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  allowSave.mockClear();
  const mockFetch = await withMockedFetch(async () => {
    await userEvent.click(canvas.getByText('Save Changes'));
    await waitFor(() => expect(canvas.getByText('Saved')).toBeTruthy());
  });
  await expect(allowSave).toHaveBeenCalledTimes(1);
  await expect(mockFetch).toHaveBeenCalledTimes(1);
  await expect(mockFetch.mock.calls[0][1].method).toBe('POST');
};

// The batched files loader (useBatchedFiles, 3.5.0), as the apps' settings pages use it: the
// project comes without its files, which are fetched from /project/json/<shortname>/files.
// A mocked server holds each files request until the play function answers it, so every step
// of the load can be checked without waiting.
const filesServer = {};
const isFilesRequest = (url) => (/^\/project\/json\/[^/]+\/files\?/u).test(String(url));
const withFilesServer = (fileCount) => () => ({
  setup () {
    const originalFetch = window.fetch;
    Object.assign(filesServer, { fileCount, requests: [], pending: [] });
    window.fetch = (url, options) => {
      if (!isFilesRequest(url)) { return originalFetch(url, options); }

      return new Promise((resolve) => {
        const request = { url: String(url), at: performance.now(), resolve };
        filesServer.requests.push(request);
        filesServer.pending.push(request);
      });
    };
    onUnmounted(() => { window.fetch = originalFetch; });
  },
  template: '<story/>'
});
// answer the oldest pending request with the files it asks for, or with an error status
const answer = (status = 200) => {
  const request = filesServer.pending.shift();
  const params = new URL(request.url, window.location.origin).searchParams;
  const start = Number(params.get('start'));
  const end = Math.min(start + Number(params.get('length')), filesServer.fileCount);
  const list = Array.from({ length: Math.max(end - start, 0) }, (_, i) => ({ source: `https://example.org/file${start + i}.nii.gz`, name: `file ${start + i}` }));
  request.answeredAt = performance.now();
  request.resolve(status === 200 ? new Response(JSON.stringify(list)) : new Response('', { status }));
};
const nextRequest = async (count) => {
  await waitFor(() => expect(filesServer.requests.length).toBe(count));
  await expect(filesServer.pending.length).toBe(1);

  return filesServer.requests[count - 1];
};

// what the play functions read: the loader and the promise of its first load
const page = {};
const LoaderTemplate = (args) => ({
  components: { SettingsPage },
  setup () {
    const project = makeProject(args.name);
    project.shortname = args.shortname;
    delete project.files;
    page.loader = useBatchedFiles({ shortname: args.shortname, filesTotal: args.filesTotal, ...(args.retryDelays ? { retryDelays: args.retryDelays } : {}) });
    project.filesLoaded = page.loader.filesLoaded;
    onMounted(() => { page.load = page.loader.loadFiles(); });

    return { project, files: page.loader.files };
  },
  template: '<SettingsPage :project="project" :files="files" />'
});

const filesStatus = (canvasElement) => canvasElement.querySelector('#files')
  .closest('.wrapper')
  .querySelector('h2 .filesStatus');
const filesSection = (canvasElement) => canvasElement.querySelector('#files').closest('.wrapper');
const fileRows = (canvasElement) => canvasElement.querySelectorAll('#files tbody tr').length;

// 250 files in batches of 100: the status line counts them, the files can't be edited while
// they load, a second loadFiles() does nothing, and the count saved is the number of files
export const BatchedFiles = LoaderTemplate.bind({});
BatchedFiles.args = { name: 'test project', shortname: 'testproject', filesTotal: 250 };
BatchedFiles.decorators = [withFilesServer(250)];
// eslint-disable-next-line max-statements
BatchedFiles.play = async ({ canvasElement }) => {
  const first = await nextRequest(1);
  await expect(first.url).toBe('/project/json/testproject/files?start=0&length=100&names=true');
  const section = filesSection(canvasElement);
  await expect(filesStatus(canvasElement).textContent).toBe(' (loading… 0 / 250)');
  // the status colour is --nwl-text-3 (#999)
  await expect(getComputedStyle(filesStatus(canvasElement)).color).toBe('rgb(153, 153, 153)');
  await expect(section.classList.contains('filesLoading')).toBe(true);
  const table = canvasElement.querySelector('#files');
  await expect(getComputedStyle(table).pointerEvents).toBe('none');
  await expect(getComputedStyle(table).opacity).toBe('0.6');
  await expect(getComputedStyle(section.querySelector('.actions')).pointerEvents).toBe('none');
  await expect(getComputedStyle(section.querySelector('h2')).pointerEvents).toBe('auto');
  // a second call during the load does nothing
  await page.loader.loadFiles();
  await expect(filesServer.requests.length).toBe(1);

  answer();
  const second = await nextRequest(2);
  await expect(second.url).toBe('/project/json/testproject/files?start=100&length=100&names=true');
  await waitFor(() => expect(fileRows(canvasElement)).toBe(100));
  await expect(page.loader.filesLoaded.count).toBe(100);
  await expect(filesStatus(canvasElement).textContent).toBe(' (loading… 100 / 250)');

  answer();
  await expect((await nextRequest(3)).url).toBe('/project/json/testproject/files?start=200&length=100&names=true');
  answer();
  await page.load;
  // the last batch wasn't full: no other request, the status is gone, the files can be edited
  await expect(filesServer.requests.length).toBe(3);
  await expect(page.loader.filesLoaded.count).toBe(250);
  await waitFor(() => expect(fileRows(canvasElement)).toBe(250));
  await expect(filesStatus(canvasElement)).toBeNull();
  await expect(section.classList.contains('filesLoading')).toBe(false);
  await expect(getComputedStyle(table).pointerEvents).toBe('auto');
  await expect(getComputedStyle(table).opacity).toBe('1');

  // the count is sent with the project when saving
  const mockFetch = await withMockedFetch(async () => {
    await userEvent.click(within(canvasElement).getByText('Save Changes'));
    await waitFor(() => expect(within(canvasElement).getByText('Saved')).toBeTruthy());
  });
  const { data } = JSON.parse(mockFetch.mock.calls[0][1].body);
  await expect(data.filesLoaded).toEqual({ count: 250 });
  await expect(data.files.list.length).toBe(250);
};

// The shortname is encoded in the URL; the total shown is never less than the files received
export const BatchedFilesEncoded = LoaderTemplate.bind({});
BatchedFilesEncoded.args = { name: 'test project', shortname: 'my project/x', filesTotal: 1 };
BatchedFilesEncoded.decorators = [withFilesServer(120)];
BatchedFilesEncoded.play = async ({ canvasElement }) => {
  await expect((await nextRequest(1)).url).toBe('/project/json/my%20project%2Fx/files?start=0&length=100&names=true');
  await expect(filesStatus(canvasElement).textContent).toBe(' (loading… 0 / 1)');
  answer();
  await expect((await nextRequest(2)).url).toBe('/project/json/my%20project%2Fx/files?start=100&length=100&names=true');
  await expect(filesStatus(canvasElement).textContent).toBe(' (loading… 100 / 100)');
  answer();
  await page.load;
  await expect(page.loader.filesLoaded.count).toBe(120);
  await expect(filesStatus(canvasElement)).toBeNull();
};

// A failing batch is tried again after each retry delay (40 and 80 ms here, 500 and 1000 by
// default), then the error shows with a Retry button, which finishes the load
const retryDelays = [40, 80];
export const BatchedFilesRetry = LoaderTemplate.bind({});
BatchedFilesRetry.args = { name: 'test project', shortname: 'testproject', filesTotal: 5, retryDelays };
BatchedFilesRetry.decorators = [withFilesServer(5)];
// eslint-disable-next-line max-statements
BatchedFilesRetry.play = async ({ canvasElement }) => {
  await nextRequest(1);
  answer(500);
  for (const [i, ms] of retryDelays.entries()) {
    // eslint-disable-next-line no-await-in-loop
    const retry = await nextRequest(i + 2);
    // eslint-disable-next-line no-await-in-loop
    await expect(retry.url).toBe('/project/json/testproject/files?start=0&length=100&names=true');
    // eslint-disable-next-line no-await-in-loop
    await expect(retry.at - filesServer.requests[i].answeredAt).toBeGreaterThanOrEqual(ms - 1);
    answer(500);
  }
  await page.load;
  await expect(filesServer.requests.length).toBe(3);
  const status = filesStatus(canvasElement);
  await expect(status.textContent).toBe(' (could not load all the files: the server answered with status 500) Retry');
  const retryButton = status.querySelector('button');
  await expect(retryButton.textContent).toBe('Retry');
  const button = getComputedStyle(retryButton);
  await expect([button.backgroundColor, button.borderTopStyle, button.borderTopWidth, button.marginLeft, button.paddingLeft, button.cursor])
    .toEqual(['rgba(0, 0, 0, 0)', 'solid', '1px', '5px', '10px', 'pointer']);
  await expect(filesSection(canvasElement).classList.contains('filesLoading')).toBe(true);
  await expect(page.loader.filesLoaded.count).toBe(0);

  await userEvent.click(retryButton);
  await expect((await nextRequest(4)).url).toBe('/project/json/testproject/files?start=0&length=100&names=true');
  await expect(filesStatus(canvasElement).textContent).toBe(' (loading… 0 / 5)');
  answer();
  await waitFor(() => expect(filesStatus(canvasElement)).toBeNull());
  await expect(page.loader.filesLoaded.count).toBe(5);
  await expect(fileRows(canvasElement)).toBe(5);
  await expect(filesSection(canvasElement).classList.contains('filesLoading')).toBe(false);
};

// A project without files (filesTotal 0) asks for nothing
export const BatchedFilesNone = LoaderTemplate.bind({});
BatchedFilesNone.args = { name: 'test project', shortname: 'testproject', filesTotal: 0 };
BatchedFilesNone.decorators = [withFilesServer(0)];
BatchedFilesNone.play = async ({ canvasElement }) => {
  await page.load;
  await expect(filesServer.requests.length).toBe(0);
  await expect(page.loader.filesLoaded.count).toBe(0);
  await expect(filesStatus(canvasElement)).toBeNull();
  await expect(filesSection(canvasElement).classList.contains('filesLoading')).toBe(false);
};
