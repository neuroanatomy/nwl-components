<template>
  <span
    role="checkbox"
    :aria-checked="isChecked"
    @click="toggleCheckbox()"
    @keydown="toggleCheckbox($event.key)"
    tabindex="0"
    aria-label="label"
  />
</template>
<script setup>
import { ref } from 'vue';

const emit = defineEmits(['update:modelValue', 'change']);
const props = defineProps({
  modelValue: Boolean
});
const isChecked = ref(props.modelValue);
if (typeof props.modelValue === 'string') {
  isChecked.value === props.modelValue === 'true';
}
const toggleCheckbox = (key) => {
  if (key != null && key !== ' ') {
    return;
  }
  isChecked.value = !isChecked.value;
  emit('change', isChecked.value);
  emit('update:modelValue', isChecked.value);
};
</script>
<style scoped>
[role="checkbox"] {
  text-decoration: none;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  position: relative;
  display: inline-block;
}
[role="checkbox"]:before {
    content: "";
    position: absolute;
    width: 11px;
    height: 11px;
    top: -2px;
    left: -2px;
    border: 1px solid white;
    border-radius: 50%;
}

[aria-checked="true"] {
  background: white;
}

[aria-checked="false"] {
  background: none;
}
</style>
