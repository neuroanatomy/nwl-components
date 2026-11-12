<template>
  <input
    type="text"
    v-bind="props"
    @input="handleInput"
    v-model="model"
  >
</template>
<script setup>
const props = defineProps({
  placeholder: {
    type: String,
    default: ''
  },
  disabled: Boolean
});
const model = defineModel({
  type: String,
  default: ''
});
const emit = defineEmits(['update:modelValue']);
const handleInput = (event) => {
  emit('update:modelValue', event.target.value);
};
</script>
<style scoped>
input[type="text"] {
  color: var(--nwl-text);
  width: 100%;
  background: var(--nwl-bg-input);
  padding: 5px 0;
  border: none;
  box-sizing: border-box;
}
input[type="text"][disabled] {
  color: var(--nwl-grey-bb);
}
::placeholder {
  color: var(--nwl-text-placeholder);
}
</style>
