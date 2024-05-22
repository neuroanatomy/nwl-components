import Wrapper from "@/components/layout/Wrapper.vue";

export default {
  decorators: [() => {
    return {
      components: { Wrapper },
      template: "<Wrapper><story/></Wrapper>",
      provide: {
        config: {
          siteName: "BrainBox",
          baseURL: "https://brainbox.pasteur.fr",
          logoURL:
            "https://brainbox.pasteur.fr/img/brainbox-logo-small_noFont.svg",
          githubURL: "https://github.com/neuroanatomy/BrainBox",
          issuesURL: "https://github.com/neuroanatomy/BrainBox/issues/new",
          searchURL: "https://openneurolab.github.io/metasearch",
          docURL: "https://github.com/neuroanatomy/BrainBox",
          userSearchURL: 'https://brainbox.pasteur.fr/api/userNameQuery?q=',
          fetchLabelSets: async () => {
            return (await (await fetch(`https://brainbox.pasteur.fr/api/getLabelsets`)).json())
          },
          annotationTypes: ['text', 'volume'],
          usernameField: 'username',
        },
        user: {
          username: "dhovart",
        },
      },
    };
  }]
}

export const parameters = {
  backgrounds: {
    default: "black",
    values: [
      {
        name: "black",
        value: "#222",
      },
    ],
  },
};
