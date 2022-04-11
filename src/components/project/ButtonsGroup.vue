<template>
  <div class="group">
    <slot />
  </div>
</template>
<style scoped>
.group {
  display: flex;
  align-items: center;
  border-left: 1px solid #fff;
  border-right: 1px solid #fff;
  border-radius: 3px;
}

.group + :deep(*) {
  margin-left: 5px;
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