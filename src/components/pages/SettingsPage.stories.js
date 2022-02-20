import SettingsPage from "@/components/pages/SettingsPage.vue";

export default {
  title: "Pages/Settings",
  component: SettingsPage,
};

const Template = (args) => ({
  components: { SettingsPage },
  setup() {
    return {
      ...args,
    };
  },
  template: `<SettingsPage projectID="test" />`,
});

export const Default = Template.bind({});