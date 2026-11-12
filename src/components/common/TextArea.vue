<template>
  <textarea
    v-bind="props"
    @input="handleInput"
    v-model="model"
  />
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
textarea {
  background: var(--nwl-bg-input);
  color: var(--nwl-text);
  font-family: inherit;
  font-size: var(--nwl-text-sm);
  padding: 0;
  border: none;
  box-sizing: border-box;
}
textarea[disabled] {
  background: var(--nwl-bg-pressed);
  color: var(--nwl-grey-bb);
}
::placeholder {
  color: var(--nwl-text-placeholder);
}
</style>
