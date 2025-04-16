import { action } from '@storybook/addon-actions';
import { ref, inject } from 'vue';

import alpha from '@/assets/alpha.svg';
import chat from '@/assets/chat.svg';
import scroll from '@/assets/scroll.svg';
import Button from '@/components/common/Button.vue';
import ButtonsGroup from '@/components/project/ButtonsGroup.vue';
import Chat from '@/components/project/Chat.vue';
import Col from '@/components/project/Col.vue';
import Editor from '@/components/project/Editor.vue';
import EditorLayout from '@/components/project/EditorLayout.vue';
import RangeSlider from '@/components/project/RangeSlider.vue';
import Row from '@/components/project/Row.vue';
import ScriptConsole from '@/components/project/ScriptConsole.vue';
import brainboxProject from '@/components/project/TextAnnotations.brainbox.fixtures.json';
import TextAnnotations from '@/components/project/TextAnnotations.vue';

export default {
  title: 'Project/Brainbox Editor'
};

const displayChat = ref(true);
const displayScript = ref(false);

const Template = (args) => ({
  components: { EditorLayout, Editor, RangeSlider, TextAnnotations, Button, ButtonsGroup, Row, Col, Chat, ScriptConsole },
  setup () {
    const {baseURL} = inject('config');
    const ret = {
      ...args,
      alpha,
      chat,
      scroll,
      displayChat,
      displayScript,
      transformFiles: (files) => files.map((file) => ({
        ...file,
        source: `${baseURL}/mri?url=${file.source}`
      }))
    };

    return ret;
  },
  template: `
    <EditorLayout>
      <template #left>
        <TextAnnotations
          :project-name="project.shortname"
          :extract-keys="extractKeys"
          :transform-files="transformFiles"
          current-file-i-d="624eafaa6c930bb4648d0550"
          @value-change="valueChange"
          @select-file="selectFile"
          :files="files"
        />
      </template>
      <template #right>
        <Editor :class="{ reduced: !displayChat && !displayScript }">
          <template #tools>
            <Row centered>
              <RangeSlider
                :max="totalSlices"
                v-model="currentSlice"
                @update:model-value="sliceChange"
              />
            </Row>
            <Row>
              <Col>
                <ButtonsGroup full-width>
                  <Button
                    @click="changeView('sag')"
                  >
                    Sag
                  </Button>
                  <Button
                    @click="changeView('cor')"
                  >
                    Cor
                  </Button>
                  <Button
                    @click="changeView('axi')"
                  >
                    Axi
                  </Button>
                </ButtonsGroup>

                <Button
                  title="Full screen"
                >
                  <img
                    class="icon"
                    alt="Full screen"
                    :src="alpha"
                  >
                </Button>
                <Button
                  title="3D render"
                >
                  <img
                    class="icon"
                    alt="3D Render"
                    :src="alpha"
                  >
                </Button>
                <ButtonsGroup>
                  <Button
                    @click="toggleChat()"
                    title="Chat"
                    :class="{ pressed: displayChat }"
                  >
                    <img
                      class="icon"
                      alt="Chat"
                      :src="chat"
                    >
                  </Button>
                  <Button
                    @click="toggleScript()"
                    title="Script"
                    :class="{ pressed: displayScript }"
                  >
                    <img
                      class="icon"
                      alt="Script"
                      :src="scroll"
                    >
                  </Button>
                </ButtonsGroup>
                <Button
                  title="Link"
                >
                  <img
                    class="icon"
                    alt="Link"
                    :src="alpha"
                  >
                </Button>
                <Button
                  title="Precise Cursor"
                >
                  <img
                    class="icon"
                    alt="Precise Cursor"
                    :src="alpha"
                  >
                </Button>
              </Col>

              <Col>
                <ButtonsGroup full-width>
                  <Button
                    title="Show"
                  >
                    <img
                      class="icon"
                      alt="Show"
                      :src="alpha"
                    >
                  </Button>
                  <Button
                    title="Paint"
                  >
                    <img
                      class="icon"
                      alt="Paint"
                      :src="alpha"
                    >
                  </Button>
                  <Button
                    title="Erase"
                  >
                    <img
                      class="icon"
                      alt="Erase"
                      :src="alpha"
                    >
                  </Button>
                  <Button
                    title="Landmark"
                  >
                    <img
                      class="icon"
                      alt="Landmark"
                      :src="alpha"
                    >
                  </Button>
                  <Button

                  >
                    <img
                      class="icon"
                      alt="ruler"
                      :src="alpha"
                    >
                  </Button>
                  <Button
                  >
                    <img
                      class="icon"
                      alt="Adjust"
                      :src="alpha"
                    >
                  </Button>
                  <Button
                  >
                    <img
                      class="icon"
                      alt="Eyedropper"
                      :src="alpha"
                    >
                  </Button>
                </ButtonsGroup>

                <Button
                  style="padding: 1px"
                >
                  <div
                    class="color"
                  />
                </Button>
                <Button
                  title="Fill"
                >
                  <img
                    class="icon"
                    alt="Fill"
                    :src="alpha"
                  >
                </Button>
                <Button
                  title="Undo"
                >
                  <img
                    class="icon"
                    alt="Undo"
                    :src="alpha"
                  >
                </Button>
                <Button
                  title="Upload"
                >
                  <img
                    class="icon"
                    alt="Upload"
                    :src="alpha"
                  >
                </Button>
                <Button
                  title="Download"
                >
                  <img
                    class="icon"
                    alt="Download"
                    :src="alpha"
                  >
                </Button>
                <Button
                  title="Save"
                >
                  <img
                    class="icon"
                    alt="Save"
                    :src="alpha"
                  >
                </Button>
              </Col>
            </Row>
            <Row>
              <ButtonsGroup>
                <Button
                  @click="changePenSize(1)"
                  title="Change pen size to 1"
                >
                  1
                </Button>
                <Button
                  @click="changePenSize(2)"
                  title="Change pen size to 2"
                >
                  2
                </Button>
                <Button
                  @click="changePenSize(3)"
                  title="Change pen size to 3"
                >
                  3
                </Button>
                <Button
                  @click="changePenSize(5)"
                  title="Change pen size to 5"
                >
                  5
                </Button>
                <Button
                  @click="changePenSize(10)"
                  title="Change pen size to 10"
                >
                  10
                </Button>
                <Button
                  @click="changePenSize(15)"
                  title="Change pen size to 15"
                >
                  15
                </Button>
              </ButtonsGroup>
            </Row>

            <Row style="flex: 1;">
              <Chat
                v-show="displayChat"
                :received-messages="receivedMessages"
                notification="notification"
                @send-message="sendChatMessage"
              />
              <ScriptConsole v-show="displayScript" />
            </Row>
          </template>
          <template #content>
            (Viewer)
          </template>
        </Editor>
      </template>
    </EditorLayout>
`
});

export const Default = Template.bind({});

const receivedMessages = ref([]);

Default.args = {
  valueChange: action('value changed'),
  selectFile: action('file selected'),
  extractKeys: () => {
    const keys = new Map();
    keys.set('Name', 'name');
    keys.set('File', 'source');
  },
  files: brainboxProject.files.list,
  project: brainboxProject,
  sliceChange: action('slice changed'),
  totalSlices: 100,
  currentSlice: ref(50),
  usePreciseCursor: ref(true),
  changePenSize: action('changePenSize'),
  changeView: action('changeView'),
  receivedMessages,
  sendChatMessage: (msg) => receivedMessages.value.push(msg),
  displayChat,
  displayScript,
  toggleChat: () => {
    displayChat.value = !displayChat.value;
    if (displayChat.value) {
      displayScript.value = false;
    }
  },
  toggleScript: () => {
    displayScript.value = !displayScript.value;
    if (displayScript.value) {
      displayChat.value = false;
    }
  }
};
