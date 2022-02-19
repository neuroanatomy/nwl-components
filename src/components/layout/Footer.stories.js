import Footer from "@/components/layout/Footer.vue";

export default {
  title: "Layout/Footer",
  component: Footer,
};

const Template = (args) => ({
  components: { Footer },
  setup() {
    return {
      ...args,
    };
  },
  template: `<Footer />`,
});

export const Default = Template.bind({});