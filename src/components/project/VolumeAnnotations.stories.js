import { action } from '@storybook/addon-actions';

import brainboxProject from '@/components/project/TextAnnotations.brainbox.fixtures.json';
import VolumeAnnotations from '@/components/project/VolumeAnnotations.vue';


export default {
  title: 'Project/VolumeAnnotations',
  component: VolumeAnnotations
};

const Template = (args) => ({
  components: { VolumeAnnotations },
  setup () {
    return {
      ...args
    };
  },
  template: `
    <VolumeAnnotations
        :extract-keys="extractKeys"
        :annotations="volumeAnnotations"
        @select-annotation="selectVolumeAnnotation" />
  `
});

export const Brainbox = Template.bind({});

Brainbox.args = {
  extractKeys: (files) => {
    const keys = new Map();
    keys.set('Name', 'name');
    keys.set('Labels sets', 'labels');

    return keys;
  },
  selectVolumeAnnotation: action('select annotation'),
  volumeAnnotations: brainboxProject.files.list[0].mri.atlas
};