<template>
    <button v-bind="props">
        <slot />
    </button>
</template>
<script setup>
const props = defineProps({
    class: String,
    title: String,
    disabled: Boolean
})
</script>
<style scoped>
button {
  background: #333;
  color: white;
  padding: 2px 10px;
  border: 1px solid #555;
  border-radius: 2px;
  margin-right: 5px;
  cursor: pointer;
}

button:hover {
  background: #555;
}

button:disabled {
  background: #555;
  color: #aaa;
  cursor: default;
}
</style>