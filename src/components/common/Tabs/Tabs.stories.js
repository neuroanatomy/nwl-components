import Tabs from "@/components/common/Tabs/Tabs.vue";
import Tab from "@/components/common/Tabs/Tab.vue";

export default {
  title: "Common/Tabs",
  component: Tabs,
};

const Template = (args) => ({
  components: { Tabs, Tab },
  setup() {
    return {
      ...args,
    };
  },
  template: `
    <Tabs>
      <tab title="Tab 1">Hello From Tab 1</tab>
      <tab title="Tab 2">Hello From Tab 2</tab>
      <tab title="Tab 3">Hello From Tab 3</tab>
      <tab title="Tab 4">Hello From Tab 4</tab>
    </Tabs>
  `,
});

export const Default = Template.bind({});