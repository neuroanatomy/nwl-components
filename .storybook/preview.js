import { setTheme } from './theme.js';

import brainboxLogo from '@/assets/brainbox-logo-small_noFont.svg';
import Wrapper from '@/components/layout/Wrapper.vue';
import '@fontsource/roboto/100.css';
import '@/styles/tokens.css';
import '@/styles/base.css';
import '@/styles/widgets.css';

// The toolbar's theme switch: today's look (the default, so every story and its play test runs as
// before) or the 2027 theme (data-nwl-theme="2027" on the preview's <html>, and fonts.css).
export const globalTypes = {
  theme: {
    description: 'nwl-components theme',
    defaultValue: 'today',
    toolbar: {
      title: 'Theme',
      icon: 'paintbrush',
      items: [
        { value: 'today', title: 'Theme: today' },
        { value: '2027', title: 'Theme: 2027' }
      ],
      dynamicTitle: true
    }
  }
};

export default {
  decorators: [
    (story, context) => {
      setTheme(context.globals.theme).catch((error) => console.error(error));

      return { template: '<story/>' };
    },
    () => ({
      components: { Wrapper },
      template: '<Wrapper><story/></Wrapper>',
      provide: {
        config: {
          siteName: 'BrainBox',
          baseURL: window.location.protocol + '//' + window.location.host,
          logoURL: brainboxLogo,
          githubURL: 'https://github.com/neuroanatomy/BrainBox',
          issuesURL: 'https://github.com/neuroanatomy/BrainBox/issues/new',
          searchURL: 'https://openneurolab.github.io/metasearch',
          docURL: 'https://github.com/neuroanatomy/BrainBox',
          userSearchURL: '/api/userNameQuery?q=',
          fetchLabelSets: () => ([
            {'name': 'Axolotl: 80 regions', 'source': 'axolotl_labels.json'},
            {'name': 'Axolotl: 12 structures', 'source': 'axolotl_structures.json'},
            {'name': 'Cerebellum: 28 segments', 'source': 'cerebellum.json'},
            {'name': 'Cerebrum', 'source': 'cerebrum.json'},
            {'name': 'Corpus Callosum: 5 segments', 'source': 'corpus_callosum.json'},
            {'name': 'Ferret 50 Regions', 'source': 'ferret50.json'},
            {'name': 'Foreground', 'source': 'foreground.json'},
            {'name': '10 regions', 'source': 'freestyle.json'}
          ]),
          annotationTypes: ['text', 'volume'],
          usernameField: 'username'
        },
        user: {
          username: 'dhovart'
        }
      }
    })
  ]
};

export const parameters = {
  backgrounds: {
    default: 'black',
    values: [
      {
        name: 'black',
        value: '#222'
      }
    ]
  }
};
