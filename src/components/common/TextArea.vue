<template>
  <textarea
    v-bind="props"
    v-model="modelValue"
    @input="handleInput"
  />
</template>
<script setup>
const props = defineProps({
  placeholder: String,
  disabled: Boolean,
  modelValue: String,
});
const emit = defineEmits(["update:modelValue"]);
const handleInput = (event) => {
  emit("update:modelValue", event.target.value);
};
</script>
<style scoped>
textarea {
  color: white;
  width: 100%;
  background: #555;
  padding: 10px;
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