<template>
  <div :class="{group: true, 'full-width': fullWidth}">
    <slot />
  </div>
</template>
<script setup>
const props = defineProps({
  fullWidth: { type: Boolean, default: false }
})
</script>
<style scoped>
.group {
  display: flex;
  align-items: center;
  border-left: 1px solid #fff;
  border-right: 1px solid #fff;
  border-radius: 3px;
}

.full-width {
  flex-basis: 100%;
}

.group :deep(button) {
  border-left: 0;
  margin: 0;
  border-radius: 0;
}
.group :deep(button:last-child) {
  border-right: 0;
}

</style>