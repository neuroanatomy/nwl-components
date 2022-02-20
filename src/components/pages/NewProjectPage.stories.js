import NewProjectPage from "@/components/pages/NewProjectPage.vue";
import { ref } from "vue";

export default {
  title: "Pages/New Project",
  component: NewProjectPage,
};

const Template = (args) => ({
  components: { NewProjectPage },
  setup() {
    const existingProject = ref(false);
    const validInput = ref(true);
    return {
      ...args,
      existingProject,
      validInput,
      checkInput(event) {
        // if a project with the name 'existing' already exists
        existingProject.value = event.target.value === "existing";
        // if valid input
        validInput.value = /^[a-zA-Z0-9]*$/.test(event.target.value);
      },
    };
  },
  template: `
    <NewProjectPage :onKeyDown="checkInput" :existing-project="existingProject" :validInput="validInput">
        Some introductory text here. Try with invalid characters or with the 'existing' string for a warning.
    </NewProjectPage>`,
});

export const Default = Template.bind({});
