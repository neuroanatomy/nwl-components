import Header from "@/components/layout/Header.vue";

export default {
  title: "Layout/Header",
  component: Header,
};

const Template = (args) => ({
  components: { Header },
  setup() {
    return {
      ...args,
    };
  },
  template: `<Header />`,
});

export const Default = Template.bind({});