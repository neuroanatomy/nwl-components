import Settings from "@/components/pages/Settings.vue";

export default {
  title: "Pages/Settings",
  component: Settings,
};

const Template = (args) => ({
  components: { Settings },
  setup() {
    return {
      ...args,
    };
  },
  template: `<Settings projectID="testproject" />`,
});

export const Default = Template.bind({});