<template>
  <div class="col">
    <slot />
  </div>
</template>
<style scoped>
.col {
  flex:1 0 250px;
  display: flex;
  flex-flow: row wrap;
}
</style>
