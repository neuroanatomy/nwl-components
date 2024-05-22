import RangeSlider from "@/components/project/RangeSlider.vue";
import TextAnnotations from "@/components/project/TextAnnotations.vue";
import EditorLayout from "@/components/project/EditorLayout.vue";
import Editor from "@/components/project/Editor.vue";
import ButtonsGroup from "@/components/project/ButtonsGroup.vue";
import Button from "@/components/common/Button.vue";
import Row from "@/components/project/Row.vue";
import Col from "@/components/project/Col.vue";
import Chat from "@/components/project/Chat.vue";
import { get, forEach } from "lodash-es";
import { action } from "@storybook/addon-actions";
import brainboxProject from "@/components/project/TextAnnotations.brainbox.fixtures.json";
import { ref, inject } from "vue";

export default {
  title: "Project/Brainbox Editor",
};

const Template = (args) => ({
  components: { EditorLayout, Editor, RangeSlider, TextAnnotations, Button, ButtonsGroup, Row, Col, Chat },
  setup() {
    const {baseURL} = inject('config');
    const ret = {
      ...args,
      alpha: require('@/assets/alpha.svg'),
      isChatDisplayed: ref(true),
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
          :projectName="project.shortname"
          :extractKeys="extractKeys"
          :transformFiles="transformFiles"
          currentFileID="624eafaa6c930bb4648d0550"
          @value-change="valueChange"
          @select-file="selectFile"
          :files="files" />
        </template>
        <template v-slot:right>
          <Editor :class="{ reduced: !isChatDisplayed }">
            <template v-slot:tools>
            <Row centered>
            <RangeSlider
              :max="totalSlices"
              v-model="currentSlice"
              @update:modelValue="sliceChange"
            />
          </Row>
          <Row>

          <Col>
            <ButtonsGroup fullWidth>
              <Button
                :class="{ pressed: currentView === 'sag' }"
                @click="changeView('sag')"
                >Sag</Button
              >
              <Button
                :class="{ pressed: currentView === 'cor' }"
                @click="changeView('cor')"
                >Cor</Button
              >
              <Button
                :class="{ pressed: currentView === 'axi' }"
                @click="changeView('axi')"
                >Axi</Button
              >
            </ButtonsGroup>

            <Button @click="isChatDisplayed = !isChatDisplayed" title="Full screen">
            <img class="icon" alt="Full screen" :src="alpha" />
          </Button>
          <Button @click="render3D()" title="3D render">
            <img class="icon" alt="3D Render" :src="alpha" />
          </Button>
          <ButtonsGroup>
            <Button
              @click="toggleChat()"
              title="Chat"
              :class="{ pressed: displayChat }"
            >
              <img class="icon" alt="Chat" :src="alpha" />
            </Button>
            <Button
              @click="toggleScript()"
              title="Script"
              :class="{ pressed: displayScript }"
            >
              <img class="icon" alt="Script" :src="alpha" />
            </Button>
          </ButtonsGroup>
          <Button @click="link()" title="Link">
            <img class="icon" alt="Link" :src="alpha" />
          </Button>
          <Button
            @click="preciseCursor()"
            title="Precise Cursor"
            :class="{ pressed: usePreciseCursor }"
          >
            <img
              class="icon"
              alt="Precise Cursor"
              :src="alpha"
            />
          </Button>

          </Col>

          <Col>


          <ButtonsGroup fullWidth>
          <Button
            @click="changeTool('Show')"
            :class="{ pressed: currentTool === 'Show' }"
          >
            <img class="icon" alt="Show" :src="alpha" />
          </Button>
          <Button
            @click="changeTool('Paint')"
            :class="{ pressed: currentTool === 'Paint' }"
          >
            <img class="icon" alt="Paint" :src="alpha" />
          </Button>
          <Button
            @click="changeTool('Erase')"
            :class="{ pressed: currentTool === 'Erase' }"
          >
            <img class="icon" alt="Erase" :src="alpha" />
          </Button>
          <Button
            @click="changeTool('Landmark')"
            :class="{ pressed: currentTool === 'Landmark' }"
          >
            <img class="icon" alt="Landmark" :src="alpha" />
          </Button>
          <Button
            @click="changeTool('Measure')"
            :class="{ pressed: currentTool === 'Measure' }"
          >
            <img class="icon" alt="ruler" :src="alpha" />
          </Button>
          <Button
            @click="toggleImageSettings()"
            :class="{ pressed: displayAdjustSettings }"
          >
            <img class="icon" alt="Adjust" :src="alpha" />
          </Button>
          <Button
            @click="changeTool('Eyedrop')"
            :class="{ pressed: currentTool === 'Eyedropper' }"
          >
            <img class="icon" alt="Eyedropper" :src="alpha" />
          </Button>
        </ButtonsGroup>


            <Button
              style="padding: 1px"
              @click="toggleOntology()"
              v-if="
                ontology != null &&
                ontology.labels != null &&
                ontology.labels[currentLabel] != null
              "
            >
              <div
                class="color"
              ></div>
            </Button>
            <Button @click="fill()" title="Fill" :class="{ pressed: doFill }">
              <img class="icon" alt="Fill" :src="alpha" />
            </Button>
            <Button @click="undo()" title="Undo">
              <img class="icon" alt="Undo" :src="alpha" />
            </Button>
            <Button @click="upload()" title="Upload">
              <img class="icon" alt="Upload" :src="alpha" />
            </Button>
            <Button @click="download()" title="Download">
              <img class="icon" alt="Download" :src="alpha" />
            </Button>
            <Button @click="save()" title="Save">
              <img class="icon" alt="Save" :src="alpha" />
            </Button>

          </Row>
          </Col>
          <Row>
            <ButtonsGroup>
            <Button
              @click="changePenSize(1)"
              :class="{ pressed: currentPenSize === 1 }"
              title="Change pen size to 1"
              >1</Button
            >
            <Button
              @click="changePenSize(2)"
              :class="{ pressed: currentPenSize === 2 }"
              title="Change pen size to 2"
              >2</Button
            >
            <Button
              @click="changePenSize(3)"
              :class="{ pressed: currentPenSize === 3 }"
              title="Change pen size to 3"
              >3</Button
            >
            <Button
              @click="changePenSize(5)"
              :class="{ pressed: currentPenSize === 5 }"
              title="Change pen size to 5"
              >5</Button
            >
            <Button
              @click="changePenSize(10)"
              :class="{ pressed: currentPenSize === 10 }"
              title="Change pen size to 10"
              >10</Button
            >
            <Button
              @click="changePenSize(15)"
              :class="{ pressed: currentPenSize === 15 }"
              title="Change pen size to 15"
              >15</Button
            >
          </ButtonsGroup>
        </Row>

          <Row style="flex: 1; min-height:60px; margin: 0 0 30px" v-if="isChatDisplayed">
            <div class="text" style="width: 100%;">
              <Chat
                :receivedMessages="receivedMessages"
                notification="notification"
                @send-message="sendChatMessage"
              />
            </div>
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
  extractKeys: () => {
    let keys = new Map();
    keys.set("Name", "name");
    keys.set("File", "source");
  },
  files: brainboxProject.files.list,
  project: brainboxProject,
  sliceChange: action('slice changed'),
}