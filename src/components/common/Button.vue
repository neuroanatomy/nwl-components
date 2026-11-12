<template>
  <button
    :title="title"
    :disabled="disabled"
    :class="classes"
    tabindex="-1"
  >
    <slot />
  </button>
</template>
<script setup>
const props = defineProps({
  className: {
    type: String,
    default: null
  },
  title: {
    type: String,
    default: null
  },
  disabled: Boolean,
  small: Boolean
});

const classes = { small: props.small === true };
if (props.className !== null) {
  classes[props.className] = true;
}
</script>
<style scoped>
button {
  background: transparent;
  color: var(--nwl-text);
  border: 1px solid var(--nwl-border);
  border-radius: var(--nwl-radius-sm);
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
  border: 1px solid var(--nwl-border-strong);
  border-radius: var(--nwl-radius-md);
  color: var(--nwl-grey-dd);
  text-align: center;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
  padding: 5px 0;
  font-weight: var(--nwl-weight-bold);
}

.small {
  width: 20px;
  height: 20px;
}

button:hover {
  background: var(--nwl-bg-pressed);
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
