<template>
  <div class="content">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
});
</script>
<style scoped>
.content {
    min-height: 400px;
    background: var(--nwl-bg-surface);
    padding: 20px;
}
</style>
