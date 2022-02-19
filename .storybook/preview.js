import { addDecorator } from '@storybook/vue3';
import { defineComponent } from 'vue';
import StorybookAppWrapper from './StorybookAppWrapper.vue';

addDecorator(() => {
  return {
    components: {StorybookAppWrapper},
    template: '<StorybookAppWrapper><story/></StorybookAppWrapper>',
    provide: {
      siteName: 'BrainBox',
      baseURL: 'https://brainbox.pasteur.fr',
      logoURL: 'https://brainbox.pasteur.fr/img/brainbox-logo-small_noFont.svg',
      githubURL: 'https://github.com/neuroanatomy/BrainBox',
      issuesURL: 'https://github.com/neuroanatomy/BrainBox/issues/new',
      searchURL: 'https://openneurolab.github.io/metasearch',
      docURL: 'https://github.com/neuroanatomy/BrainBox',
    }
  }
});

export const parameters = {
  backgrounds: {
    default: 'black',
    values: [
      {
        name: 'black',
        value: '#222',
      },
    ],
  },
};