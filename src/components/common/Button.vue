<template>
    <button :class="{ small }" v-bind="props">
        <slot />
    </button>
</template>
<script setup>
const props = defineProps({
    class: String,
    title: String,
    disabled: Boolean,
    small: Boolean
})
</script>
<style scoped>
button {
    background: transparent;
    color: white;
    border: 1px solid #555;
    border-radius: 3px;
    margin-right: 5px;
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

button:hover {
  background: #555;
}

button:disabled {
  background: #555;
  color: #aaa;
  cursor: default;
}
button :deep(img) {
  width: 20px;
  height: 20px;
}
</style>