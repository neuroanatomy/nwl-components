import Settings from "@/components/settings/Settings.vue";

export default {
  title: "Settings/Main",
  component: Settings,
};
const Template = (args) => ({
  components: { Settings },
  setup() {
    return {}
  },
  template:
    `<Settings projectID="testproject" />`,
});

export const Default = Template.bind({});