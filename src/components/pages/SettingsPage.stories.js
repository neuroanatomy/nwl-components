import { expect, fn, userEvent, waitFor, within } from '@storybook/test';
import { inject, provide } from 'vue';

import SettingsPage from '@/components/pages/SettingsPage.vue';

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
