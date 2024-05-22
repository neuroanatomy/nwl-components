import { ref } from 'vue';

import Checkbox from '@/components/common/Checkbox.vue';

export default {
  title: 'Common/Checkbox',
  component: Checkbox
};

const Template = (args) => ({
  components: { Checkbox },
  setup () {
    return {
      ...args,
      toggled: ref(true)
    };
  },
  template: `
    <Checkbox v-model="toggled" />
  `
});

export const Default = Template.bind({});
