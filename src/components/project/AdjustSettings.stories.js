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
        v-model:alpha="alphaValue" @update:alpha="changeAlpha"
        v-model:brightness="brightnessValue" @update:brightness="changeBrightness"
        v-model:contrast="contrastValue" @update:contrast="changeContrast"
    />
    <div>Alpha: {{ alphaValue }}</div>
    <div>Brightness: {{ brightnessValue }}</div>
    <div>Contrast: {{ contrastValue }}</div>
  `
});

export const Default = Template.bind({});
