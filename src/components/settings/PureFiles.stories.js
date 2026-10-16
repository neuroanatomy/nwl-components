import { action } from '@storybook/addon-actions';
import { expect, userEvent, waitFor, within } from '@storybook/test';
import { reactive } from 'vue';

import PureFiles from '@/components/settings/PureFiles.vue';

export default {
  title: 'Settings/Files',
  component: PureFiles
};
const Template = (args) => ({
  components: { PureFiles },
  setup () {
    return { ...args };
  },
  template: `<PureFiles :files="files"
                @add-file="addFile"
                @remove-files="removeFiles"
                @update-file="updateFile" />`
});

export const Default = Template.bind({});
Default.args = {
  files: reactive([
    {
      source: 'http://foo.bar',
      name: 'Name'
    },
    {
      source: 'http://baz.foo',
      name: 'Another Name'
    }
  ]),
  addFile: action('add file'),
  removeFiles: action('remove files'),
  updateFile: action('update file')
};

// Interaction test, run by `npm run test-storybook`: after "+", the new row's
// empty URL cell can be clicked (it used to be an empty inline span, 0 px wide,
// so only the Name cell could be reached with the mouse).
export const AddFile = () => ({
  components: { PureFiles },
  setup () {
    const files = reactive([{ source: 'http://foo.bar', name: 'Name' }]);
    const addFile = () => files.push({ source: '', name: '' });

    return { files, addFile };
  },
  template: '<PureFiles :files="files" @add-file="addFile" />'
});
AddFile.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByTitle('Add file'));
  const rows = () => canvasElement.querySelectorAll('#files tbody tr');
  await waitFor(() => expect(rows().length).toBe(2));
  const url = rows()[1].querySelector('[contenteditable]');
  await expect(url.textContent).toBe('');
  // the empty URL cell has a size, shows its placeholder, and is what is under the pointer
  const box = url.getBoundingClientRect();
  await expect([box.width > 20, box.height > 10]).toEqual([true, true]);
  await expect(getComputedStyle(url, '::before').content).toBe('"File URL"');
  await expect(url.contains(document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2))).toBe(true);
  // clicking it puts the caret there, and typing fills it
  await userEvent.click(url);
  await expect(document.activeElement).toBe(url);
  await userEvent.keyboard('http://new.file');
  await waitFor(() => expect(url.textContent).toBe('http://new.file'));
};
