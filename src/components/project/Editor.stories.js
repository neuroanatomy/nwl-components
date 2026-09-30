import { reactive, ref } from 'vue';

import Button from '@/components/common/Button.vue';
import ButtonsGroup from '@/components/project/ButtonsGroup.vue';
import Chat from '@/components/project/Chat.vue';
import Editor from '@/components/project/Editor.vue';
import RangeSlider from '@/components/project/RangeSlider.vue';
import Row from '@/components/project/Row.vue';

export default {
  title: 'Project/Editor',
  component: Editor
};

// The story mirrors how the app uses the Editor: a dark #222 frame (the
// pane the toolbox sits on — the docked palette is transparent and takes
// the pane color), a fixed-height content placeholder (without it the
// .area is 0 px tall in overlay mode and the palette cannot be dragged
// vertically), and a populated tools slot so the palette is not empty.
const Template = (args) => ({
  components: { Editor, Row, RangeSlider, ButtonsGroup, Button, Chat },
  setup () {
    const messages = reactive([]);
    const handleSend = (msg) => messages.push(msg);

    return {
      args,
      messages,
      handleSend,
      value: ref(50)
    };
  },
  template: `
    <div style="background: #222; padding: 10px; box-sizing: border-box">
      <Editor v-bind="args">
        <template #content>
          <div
            style="height: 400px; background: #111; color: #777;
                   display: flex; align-items: center; justify-content: center"
          >
            (Viewer)
          </div>
        </template>
        <template #tools>
          <Row centered>
            <RangeSlider :max="100" v-model="value" />
          </Row>
          <Row centered>
            <ButtonsGroup>
              <Button>Sag</Button>
              <Button>Cor</Button>
              <Button>Axi</Button>
            </ButtonsGroup>
          </Row>
          <Row centered>
            <ButtonsGroup>
              <Button>1</Button>
              <Button>2</Button>
              <Button>3</Button>
              <Button>5</Button>
            </ButtonsGroup>
            <Button>Col</Button>
          </Row>
          <Chat :received-messages="messages" @send-message="handleSend" />
        </template>
      </Editor>
    </div>
  `
});

export const Default = Template.bind({});
Default.args = {
  title: 'Slice 180'
};

// Docked: toolbox in normal flow below the content instead of a floating
// palette (overlayTools = false). Controlled by the overlayTools prop, which
// is independent of any fullscreen state the host application may have.
export const Docked = Template.bind({});
Docked.args = {
  title: 'Slice 180',
  overlayTools: false
};
