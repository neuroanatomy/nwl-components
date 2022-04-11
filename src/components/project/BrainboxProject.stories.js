import RangeSlider from "@/components/project/RangeSlider.vue";
import TextAnnotations from "@/components/project/TextAnnotations.vue";
import EditorLayout from "@/components/project/EditorLayout.vue";
import Editor from "@/components/project/Editor.vue";
import ButtonsGroup from "@/components/project/ButtonsGroup.vue";
import Button from "@/components/common/Button.vue";
import Row from "@/components/project/Row.vue";
import { get, forEach } from "lodash-es";
import { action } from "@storybook/addon-actions";
import brainboxFiles from "@/components/project/TextAnnotations.brainbox.fixtures.json";
import { inject } from "vue";

export default {
  title: "Project/Brainbox Editor",
};

const Template = (args) => ({
  components: { EditorLayout, Editor, RangeSlider, TextAnnotations, Button, ButtonsGroup, Row },
  setup() {
    const {baseURL} = inject('config');
    const ret = {
      ...args,
      transformFiles: (files) => files.map((file) => ({
          ...file,
          source: `${baseURL}/mri?url=${file.source}`
        })),
      };
      return ret;
  },
  template: `
    <EditorLayout>
      <template v-slot:left>
        <TextAnnotations
          projectName="bcprimates3"
          :extractKeys="extractKeys"
          :transformFiles="transformFiles"
          currentFileID="624eafaa6c930bb4648d0550"
          @value-change="valueChange"
          @select-file="selectFile"
          :files="files" />
        </template>
        <template v-slot:right>
          <Editor>
            <template v-slot:tools>
              <Row centered>
                <RangeSlider max="100" v-model="value" @input="sliceChange" />
              </Row>
              <Row centered>
                <ButtonsGroup>
                  <Button>Sag</Button>
                  <Button>Cor</Button>
                  <Button>Axi</Button>
                </ButtonsGroup>                
                <ButtonsGroup>
                  <Button>1</Button>
                  <Button>2</Button>
                  <Button>3</Button>
                  <Button>4</Button>
                  <Button>5</Button>
                  <Button>6</Button>
                  <Button>7</Button>
                </ButtonsGroup>                
              </Row>
              <Row centered>
                <Button>A</Button>
                <Button>B</Button>
                <ButtonsGroup>
                  <Button>1</Button>
                  <Button>2</Button>
                  <Button>3</Button>
                  <Button>4</Button>
                </ButtonsGroup>                
                <Button>Col</Button>
                <Button>1</Button>
                <Button>2</Button>
                <Button>3</Button>
                <Button>4</Button>
              </Row>
            </template>
            <template v-slot:content>
              (Viewer)
            </template>
          </Editor>
        </template>
    </EditorLayout>
`,
});

export const Default = Template.bind({});

Default.args = {
  valueChange: action('value changed'),
  selectFile: action('file selected'),
  extractKeys: (props) => {
    let keys = new Map();
    keys.set("Name", "name");
    keys.set("File", "source");
    props.files.forEach((file) => {
      let annotations = get(file, ["mri", "annotations", props.projectName]);
      if (annotations == null) return;
      forEach(annotations, (_value, key) => {
        keys.set(key, ["mri", "annotations", props.projectName, key, "data"]);
      });
    });
    return keys;
  },
  files: brainboxFiles,
  sliceChange: action('slice changed'),
}