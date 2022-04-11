import Editor from "@/components/project/Editor.vue";

export default {
  title: "Project/Editor",
  component: Editor,
};

const Template = (args) => ({
  components: { Editor },
  setup() {
    return {
      ...args,
    };
  },
  template: `
    <Editor />
  `,
});

export const Default = Template.bind({});
