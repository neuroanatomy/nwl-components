import { addDecorator } from "@storybook/vue3";
import { defineComponent } from "vue";
import StorybookAppWrapper from "./StorybookAppWrapper.vue";

addDecorator(() => {
  return {
    components: { StorybookAppWrapper },
    template: "<StorybookAppWrapper><story/></StorybookAppWrapper>",
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
      },
      user: {
        _id: "61fbf78ee97e73dc0930e7f4",
        name: "Denis Hovart",
        url: "",
        brainboxURL: "/user/dhovart",
        avatarURL: "https://avatars.githubusercontent.com/u/764576?v=4",
        joined: "2022-02-03T15:41:02.286Z",
        nickname: "dhovart",
      },
  },
  };
});

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
