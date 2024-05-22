import { action } from '@storybook/addon-actions';
import { get, forEach } from 'lodash-es';
import { inject, ref } from 'vue';

import Button from '@/components/common/Button.vue';
import ProjectPage from '@/components/pages/ProjectPage.vue';
import ButtonsGroup from '@/components/project/ButtonsGroup.vue';
import Editor from '@/components/project/Editor.vue';
import RangeSlider from '@/components/project/RangeSlider.vue';
import Row from '@/components/project/Row.vue';
import brainboxProject from '@/components/project/TextAnnotations.brainbox.fixtures.json';
import TextAnnotations from '@/components/project/TextAnnotations.vue';


export default {
  title: 'Pages/Brainbox Editor'
};

const Template = (args) => ({
  components: {
    ProjectPage,
    Editor,
    RangeSlider,
    TextAnnotations,
    Button,
    ButtonsGroup,
    Row
  },
  setup () {
    const { baseURL } = inject('config');
    const fullscreen = ref(false);
    const ret = {
      ...args,
      handleFullscreen: () => {
        fullscreen.value = !fullscreen.value;
      },
      fullscreen
    };

    return ret;
  },
  template: `
    <ProjectPage :fullscreen="fullscreen" :project="project">
      <template v-slot:left>
        <TextAnnotations
          :projectName="project.shortname"
          :extractKeys="extractKeys"
          currentFileID="624eafaa6c930bb4648d0550"
          @value-change="valueChange"
          @select-file="selectFile"
          :files="files" />
        </template>
        <template v-slot:right>
          <Editor>
            <template v-slot:tools>
              <Row centered>
                <RangeSlider max=100 v-model="value" @input="sliceChange" />
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
                <Button @click="handleFullscreen">FS</Button>
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
              <Row>
                <ButtonsGroup>
                  <Button>1</Button>
                  <Button>2</Button>
                  <Button>3</Button>
                  <Button>5</Button>
                  <Button>10</Button>
                  <Button>15</Button>
              </ButtonsGroup>                
          </Row>
            </template>
            <template v-slot:content>
              (Viewer)
            </template>
          </Editor>
        </template>
    </ProjectPage>
`
});

export const Default = Template.bind({});

Default.args = {
  valueChange: action('value changed'),
  selectFile: action('file selected'),
  extractKeys: (files) => {
    const keys = new Map();
    keys.set('Name', 'name');
    keys.set('File', 'source');
    files.forEach((file) => {
      const annotations = get(file, ['mri', 'annotations', brainboxProject.shortname]);
      if (annotations == null) { return; }
      forEach(annotations, (_value, key) => {
        keys.set(key, ['mri', 'annotations', brainboxProject.shortname, key, 'data']);
      });
    });

    return keys;
  },
  files: brainboxProject.files.list,
  project: { ...brainboxProject, title: brainboxProject.name},
  sliceChange: action('slice changed')
};
