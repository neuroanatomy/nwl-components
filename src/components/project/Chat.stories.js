import Chat from "@/components/project/Chat.vue";
import { reactive } from "vue";

export default {
  title: "Project/Chat",
  component: Chat,
};

const Template = (args) => ({
  components: { Chat },
  setup() {
    const messages = reactive([]);
    const handleSend = (msg) => messages.push(msg);
    return {
      ...args,
      messages,
      handleSend,
    };
  },
  template: `
    <Chat :received-messages="messages" @send-message="handleSend" />
  `,
});

export const Default = Template.bind({});
