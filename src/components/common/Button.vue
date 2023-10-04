<template>
  <button :title="title" :disabled="disabled" :class="classes">
    <slot />
  </button>
</template>
<script setup>
const props = defineProps({
  className: String,
  title: String,
  disabled: Boolean,
  small: Boolean,
});

const classes = { small: props.small === true };
if (props.className != null) {
  classes[props.className] = true;
}
</script>
<style scoped>
button {
  background: transparent;
  color: white;
  border: 1px solid #777;
  border-radius: 3px;
  margin-right: 5px;
  cursor: pointer;
  padding: 10px;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  outline: none;
}

.push-button {
  border: 1px solid #ddd;
  border-radius: 6px;
  color: #ddd;
  text-align: center;
  -webkit-appearance: none;
  cursor: pointer;
  padding: 5px 0;
  font-weight: bold;
}

.small {
  width: 20px;
  height: 20px;
}

button:hover {
  background: #555;
}

button:disabled {
  opacity: 0.4;
  cursor: default;
}
button :deep(img) {
  width: 20px;
  height: 20px;
}
</style>