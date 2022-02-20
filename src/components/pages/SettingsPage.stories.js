import SettingsPage from "@/components/pages/SettingsPage.vue";

export default {
  title: "Pages/Settings",
  component: SettingsPage,
};

const Template = (args) => ({
  components: { SettingsPage },
  setup() {
    return {
      ...args,
      project: {
        name: "",
        shortname: "testproject",
        url: "",
        brainboxURL: "/project/testproject",
        created: "2022-02-08T10:14:13.331Z",
        owner: "dhovart",
        collaborators: {
          list: [
            {
              userID: "anyone",
              access: {
                collaborators: "view",
                annotations: "edit",
                files: "none",
              },
              username: "anyone",
              name: "Any User",
            },
            {
              userID: "some-collaborator",
              access: {
                collaborators: "view",
                annotations: "add",
                files: "view",
              },
              name: "Some collaborator",
              username: "some-collaborator",
            },
          ],
        },
        files: {
          list: [
            "https://dl.dropbox.com/s/cny5b3so267bv94/p32-f18-uchar.nii.gz",
          ],
        },
        annotations: {
          list: [
            {
              type: "volume",
              name: "foo",
              values: "cerebrum.json",
              display: true,
            },
            {
              type: "volume",
              name: "blah",
              values: "nimhmacaque.json",
              display: false,
            },
            {
              type: "volume",
              name: "truc",
              values: "axolotl_labels.json",
              display: true,
            },
            {
              type: "text",
              name: "comment",
              values: "",
              display: true,
            },
          ],
        },
        modified: "2022-02-20T19:18:15.829Z",
        modifiedBy: "dhovart",
      },
    };
  },
  template: `<SettingsPage :project="project" />`,
});

export const Default = Template.bind({});
