import { action } from '@storybook/addon-actions';
import { ref } from 'vue';

import AdjustSettings from '@/components/project/AdjustSettings.vue';

export default {
  title: 'Project/Adjust Settings',
  component: AdjustSettings
};

const Template = (args) => ({
  components: { AdjustSettings },
  setup () {
    return {
      ...args,
      alphaValue: ref(0),
      brightnessValue: ref(0),
      contrastValue: ref(0),
      changeAlpha: action('changeAlpha'),
      changeBrightness: action('changeBrightness'),
      changeContrast: action('changeContrast')
    };
  },
  template: `
    <AdjustSettings
        :alpha="alphaValue" @change-alpha="changeAlpha"
        :brightness="brightnessValue" @change-brightness="changeBrightness"
        :contrast="contrastValue" @change-contrast="changeContrast"
    />
  `
});

export const Default = Template.bind({});
