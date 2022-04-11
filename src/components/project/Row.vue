<template>
    <div class="row" :class="classes">
        <slot />
    </div>
</template>
<script setup>
const props = defineProps({
  centered: Boolean,
});

const classes = { centered: props.centered === true };
</script>
<style scoped>
.row {
    display: flex;
    margin-bottom:5px;
}

.row :last-child {
    margin-right: 0;
}
</style>