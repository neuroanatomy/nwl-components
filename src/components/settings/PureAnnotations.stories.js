import PureAnnotations from "@/components/settings/PureAnnotations.vue";
import { action } from "@storybook/addon-actions";
import { reactive } from "vue";
import faker from "@faker-js/faker";

export default {
  title: "Settings/Annotations",
  component: PureAnnotations,
};
const Template = (args) => ({
  components: { PureAnnotations },
  setup() {
    return {...args};
  },
  template:
    `<PureAnnotations :annotations="annotations"
                    @add-annotation="addAnnotation"
                    @remove-annotations="removeAnnotations"
                    @update-annotation="updateAnnotation" />`,
});

export const Default = Template.bind({});
Default.args = {
  annotations: reactive([
    {
      "type": "volume",
      "name": "A volume annotation",
      "values": "axolotl_labels.json",
      "display": "true"
    },
    {
      "type": "text",
      "name": "texte",
      "values": "A text annotation",
      "display": "true"
    },
  ]),
  addAnnotation: action("add annotation"),
  removeAnnotations: action("remove annotations"),
  updateAnnotation: action("update annotation"),
};
