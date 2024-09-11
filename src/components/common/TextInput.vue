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
  color: white;
  width: 100%;
  background: transparent;
  padding: 5px 0;
  border: none;
  box-sizing: border-box;
}
input[type="text"][disabled] {
  color: #bbb;
}
::placeholder {
  color: #ccc;
}
</style>
