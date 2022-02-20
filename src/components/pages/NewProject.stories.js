import NewProject from "@/components/pages/NewProject.vue";

export default {
  title: "Pages/New Project",
  component: NewProject,
};

const Template = (args) => ({
  components: { NewProject },
  setup() {
    return {
      ...args,
    };
  },
  template: `
    <NewProject>
        A project contains a list of MRI files, a set of volume or text
        annotations, and a list of collaborators with their access rights.
        The short name of a project can only contain letters and numbers,
        but you can choose a longer display name later.
    </NewProject>`,
});

export const Default = Template.bind({});