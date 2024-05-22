<template>
  <select
    v-bind="props"
    :value="modelValue"
    @input="handleInput"
  >
    <slot />
  </select>
</template>
<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  disabled: Boolean,
  modelValue: String
});

const emit = defineEmits(['update:modelValue']);

const handleInput = (event) => {
  emit('update:modelValue', event.target.value);
};
</script>

<style scoped>
select {
  border: none;
  background: none;
  color: white;
  appearance: none;
  outline: none;
  cursor: pointer;
}
</style>
