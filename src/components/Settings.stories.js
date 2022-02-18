import Settings from "./Settings.vue";

export default {
  title: "Settings/Main",
  component: Settings,
};
const Template = (args) => ({
  components: { Settings },
  setup() {
    return {}
  },
  template: // FIXME projectID should be provided by settings
    `<Settings projectID="testproject" />`,
});

export const Default = Template.bind({});