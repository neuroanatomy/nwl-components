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

// The push variant (className "push-button") is the .nwl-push-button widget of
// nwl-components/widgets.css; the `push-button` class stays, for the apps' own CSS.
const push = props.className === 'push-button';
const classes = { small: props.small === true, 'nwl-push-button': push };
if (props.className !== null) {
  classes[props.className] = true;
}
</script>
<style scoped>
/* the push variant's look is .nwl-push-button (widgets.css); these rules are the other
   variants' (a bordered button, or a 20px square with `small`) */
button {
  margin-right: 5px;
}

button:where(:not(.nwl-push-button)) {
  background: transparent;
  color: var(--nwl-text);
  border: 1px solid var(--nwl-border);
  border-radius: var(--nwl-radius-sm);
  cursor: pointer;
  padding: 10px;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
}

.small {
  width: 20px;
  height: 20px;
}

button:where(:not(.nwl-push-button)):hover {
  background: var(--nwl-bg-pressed);
}

button:where(:not(.nwl-push-button)):disabled {
  opacity: 0.4;
  cursor: default;
}
button :deep(img) {
  width: 20px;
  height: 20px;
}
</style>
