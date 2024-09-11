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
  background: transparent;
  color: white;
  font-family: inherit;
  font-size: 12px;
  padding: 0;
  border: none;
  box-sizing: border-box;
}
textarea[disabled] {
  background: #555;
  color: #bbb;
}
::placeholder {
  color: #ccc;
}
</style>
