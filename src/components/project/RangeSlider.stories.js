import RangeSlider from "@/components/project/RangeSlider.vue";
import { action } from "@storybook/addon-actions";

export default {
  title: "Project/RangeSlider",
  component: RangeSlider,
};

const Template = (args) => ({
  components: { RangeSlider },
  setup() {
    return {
      ...args,
      change: action('input'),
    };
  },
  template: `
    <RangeSlider max="100" v-model="value" @input="change" />
  `,
});

export const Default = Template.bind({});
