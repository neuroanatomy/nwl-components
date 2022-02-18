<template>
  <input
    type="text"
    v-bind="props"
    :value="modelValue"
    @input="handleInput"
  />
</template>
<script setup>
const props = defineProps({
    placeholder: String,
    disabled: Boolean,
    modelValue: String,
});
const emit = defineEmits(['update:modelValue']);
const handleInput = (event) => {
    emit('update:modelValue', event.target.value);
}
</script>
<style scoped>
input[type="text"] {
  color: white;
  width: 100%;
  background: #555;
  padding: 10px;
  border: none;
  box-sizing: border-box;
}
input[type="text"][disabled] {
  background: #555;
  color: #bbb;
}
::placeholder {
  color: #ccc;
} 
</style>