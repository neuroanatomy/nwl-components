import { expect, userEvent, within } from '@storybook/test';
import { ref } from 'vue';

import NewProjectPage from '@/components/pages/NewProjectPage.vue';

export default {
  title: 'Pages/New Project',
  component: NewProjectPage
};

const Template = (args) => ({
  components: { NewProjectPage },
  setup () {
    const existingProject = ref(false);
    const validInput = ref(true);

    return {
      ...args,
      existingProject,
      validInput,
      checkInput (event) {
        // if a project with the name 'existing' already exists
        existingProject.value = event.target.value === 'existing';
        // if valid input
        // as both apps' pages: letters, numbers and hyphens (decided 2026-11-11)
        validInput.value = (/^[a-zA-Z0-9-]*$/).test(event.target.value);
      }
    };
  },
  template: `
    <NewProjectPage :onKeyDown="checkInput" :existing-project="existingProject" :validInput="validInput">
        Some introductory text here. Try with invalid characters or with the 'existing' string for a warning.
    </NewProjectPage>`
});

export const Default = Template.bind({});

// the warning names the characters allowed, hyphens included (both apps accept them since 2026-11-11)
export const InvalidName = Template.bind({});
InvalidName.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const input = canvas.getByPlaceholderText('Enter the project short name');
  const [, warning] = canvasElement.querySelectorAll('.warning');
  await userEvent.type(input, 'my-project');
  await expect(warning).not.toBeVisible();
  await userEvent.type(input, '_2');
  await expect(warning).toBeVisible();
  await expect(warning).toHaveTextContent('letters, numbers and hyphens');
};
