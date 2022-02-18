<template>
  <select
    ref="root"
    v-bind="props"
    @input="handleInput"
  >
    <slot />
  </select>
</template>
<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  disabled: Boolean,
  modelValue: String,
});

const emit = defineEmits(["update:modelValue"]);
const root = ref(null);

onMounted(() => {
    const options = Array.from(root.value.options);
    const optionToSelect = options.find(element => element.value == props.modelValue);
    if (optionToSelect != null) {
        optionToSelect.selected = true;
    }
});

const handleInput = (event) => {
  emit("update:modelValue", event.target.value);
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