import { expect } from '@storybook/test';

import Footer from '@/components/layout/Footer.vue';

export default {
  title: 'Layout/Footer',
  component: Footer
};

const Template = (args) => ({
  components: { Footer },
  setup () {
    return {
      ...args
    };
  },
  template: '<Footer />'
});

export const Default = Template.bind({});
// the text link has no underline at rest; the test runner hovers it with the real mouse
// (`parameters.hoverStyles`, .storybook/test-runner.js) and checks the underline
Default.parameters = {
  hoverStyles: [{ selector: 'footer a.text-link', styles: { textDecorationLine: 'underline' } }]
};
Default.play = async ({ canvasElement }) => {
  const link = canvasElement.querySelector('footer a.text-link');
  await expect(getComputedStyle(link).textDecorationLine).toBe('none');
};
