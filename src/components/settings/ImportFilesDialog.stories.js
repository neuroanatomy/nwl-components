import { action } from '@storybook/addon-actions';
import { expect } from '@storybook/test';

import ImportFilesDialog from '@/components/settings/ImportFilesDialog.vue';

// The settings page's "Upload CSV" dialog. Its table is a plain .nwl-table (widgets.css,
// 3.4.0): a 1em gap after every cell but the last of a row. Read with getComputedStyle.
export default {
  title: 'Settings/ImportFilesDialog',
  component: ImportFilesDialog
};

export const Default = (args) => ({
  components: { ImportFilesDialog },
  setup () {
    return { args, onImport: action('import'), onCancel: action('cancel') };
  },
  template: '<ImportFilesDialog :files="args.files" @import="onImport" @cancel="onCancel" />'
});
Default.args = {
  files: [
    { source: 'https://example.org/data/brain-1.nii.gz', name: 'brain-1' },
    { source: 'https://example.org/data/brain-2.nii.gz', name: 'brain-2' }
  ]
};
Default.play = async ({ canvasElement }) => {
  const table = canvasElement.querySelector('.dialog table');
  await expect(table.classList.contains('nwl-table')).toBe(true);
  await expect(getComputedStyle(table).fontSize).toBe('14px');
  // the last cell of a row keeps the browser's 1px
  const gaps = [...table.querySelectorAll('tr')].map((tr) => [...tr.children]
    .map((cell) => getComputedStyle(cell).paddingRight));
  await expect(gaps).toEqual([['14px', '1px'], ['14px', '1px'], ['14px', '1px']]);
};
