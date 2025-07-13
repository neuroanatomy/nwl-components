import brainboxLogo from '@/assets/brainbox-logo-small_noFont.svg';
import Wrapper from '@/components/layout/Wrapper.vue';
import '@fontsource/roboto/100.css';

export default {
  decorators: [
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
