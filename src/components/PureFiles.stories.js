import PureFiles from "./PureFiles.vue";
import { action } from "@storybook/addon-actions";
import { reactive } from "vue";

export default {
  title: "Settings/Files",
  component: PureFiles,
};
const Template = (args) => ({
  components: { PureFiles },
  setup() {
    return { ...args };
  },
  template: `<PureFiles :files="files"
                @add-file="addFile"
                @remove-files="removeFiles"
                @update-file="updateFile" />`,
});

export const Default = Template.bind({});
Default.args = {
  files: reactive([
    {
      source: "http://foo.bar",
      name: "Name",
    },
    {
      source: "http://baz.foo",
      name: "Another Name",
    },
  ]),
  addFile: action("add file"),
  removeFiles: action("remove files"),
  updateFile: action("update file"),
};
