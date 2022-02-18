import { addDecorator } from '@storybook/vue3';
import { defineComponent } from 'vue';
import StorybookAppWrapper from './StorybookAppWrapper.vue';

addDecorator(() => {
  return {
    components: {StorybookAppWrapper},
    template: '<StorybookAppWrapper><story/></StorybookAppWrapper>',
    provide: { baseURL: 'https://brainbox.pasteur.fr' }
  }
});

export const parameters = {
  backgrounds: {
    default: 'black',
    values: [
      {
        name: 'black',
        value: '#333',
      },
    ],
  },
};