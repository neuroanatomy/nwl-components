<template>
  <div class="chat">
    <div class="notifications">
      {{ notification }}
    </div>
    <ul
      class="messages"
      ref="messagesRef"
    >
      <li
        v-for="(msg, index) in receivedMessages"
        :key="index"
      >
        <span v-html="msg" />
      </li>
    </ul>
    <input
      type="text"
      @keyup.enter="handleEnter"
    >
  </div>
</template>
<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  notification: {
    type: String,
    default: ''
  },
  receivedMessages: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['sendMessage']);

const messagesRef = ref(null);

watch(props.receivedMessages, () => {
  // scroll to bottom
  setTimeout(() => { messagesRef.value.scrollTop = messagesRef.value.scrollHeight; }, 100);
});

const handleEnter = (event) => {
  emit('sendMessage', event.target.value);
  event.target.value = '';
};
</script>
<style scoped>
.chat {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.messages {
    border: thin solid #777;
    background: #000;
    opacity: 0.5;
    border-radius: 3px;
    margin: 1px;
    user-select: text;
    overflow: auto;
    min-height: 40px;
    padding: 3px;
    list-style: none;
    flex: 1;
}

input {
    width: 100%;
    color: black;
    height: 22px;
}
</style>
