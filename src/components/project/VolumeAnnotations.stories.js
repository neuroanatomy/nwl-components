import { action } from '@storybook/addon-actions';
import { get, forEach } from 'lodash-es';

import brainboxProject from '@/components/project/TextAnnotations.brainbox.fixtures.json';
import microdrawFiles from '@/components/project/TextAnnotations.microdraw.fixtures.json';
import TextAnnotations from '@/components/project/TextAnnotations.vue';


export default {
  title: 'Project/VolumeAnnotations',
  component: TextAnnotations
};

const Template = (args) => ({
  components: { TextAnnotations },
  setup () {
    return {
      ...args
    };
  },
  template: `
    <TextAnnotations
      projectName="bcprimates3"
      :extractKeys="extractKeys"
      currentFileID="624eafaa6c930bb4648d0550"
      @value-change="valueChange"
      @select-file="selectFile"
      :files="files" />
  `
});

export const Brainbox = Template.bind({});
export const Microdraw = Template.bind({});

const defaultArgs = {
  valueChange: action('value changed'),
  selectFile: action('file selected')
};

Brainbox.args = {
  ...defaultArgs,
  extractKeys: (files) => {
    const keys = new Map();
    keys.set('Name', 'name');
    keys.set('File', 'source');
    files.forEach((file) => {
      const annotations = get(file, ['mri', 'annotations', brainboxProject]);
      if (annotations == null) { return; }
      forEach(annotations, (_value, key) => {
        keys.set(key, ['mri', 'annotations', brainboxProject, key, 'data']);
      });
    });

    return keys;
  },

  files: brainboxProject.files.list
};

Microdraw.args = {
  ...defaultArgs,
  extractKeys: () => {
    const keys = new Map();
    keys.set('Name', 'name');
    keys.set('File', 'source');

    return keys;
  },

  files: microdrawFiles
};
