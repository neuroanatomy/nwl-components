import RangeSlider from "@/components/project/RangeSlider.vue";
import { action } from "@storybook/addon-actions";
import { ref } from 'vue';

export default {
  title: "Project/RangeSlider",
  component: RangeSlider,
};

const Template = (args) => ({
  components: { RangeSlider },
  setup() {
    return {
      ...args,
      value: ref(0),
      change: action('input'),
    };
  },
  template: `
    <RangeSlider max="100" v-model="value" @update:modelValue="change" />
  `,
});

export const Default = Template.bind({});
