import { expect } from '@storybook/test';
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

// the ring (::before) is centred on the disc: both centres within 0.5px
Default.play = async ({ canvasElement }) => {
  const disc = canvasElement.querySelector('[role="checkbox"]');
  const box = disc.getBoundingClientRect();
  const ring = getComputedStyle(disc, '::before');
  const px = (v) => parseFloat(v);
  // the ring is positioned from the disc's padding box (the disc has no border)
  const ringX = box.left + px(ring.left) + px(ring.width) / 2;
  const ringY = box.top + px(ring.top) + px(ring.height) / 2;
  const discX = box.left + box.width / 2;
  const discY = box.top + box.height / 2;
  await expect(Math.abs(ringX - discX)).toBeLessThanOrEqual(0.5);
  await expect(Math.abs(ringY - discY)).toBeLessThanOrEqual(0.5);
};
