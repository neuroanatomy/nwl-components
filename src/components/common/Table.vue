<template>
  <table :id="props.id">
    <slot />
  </table>
</template>
<script setup>
const props = defineProps({
  id: String
});
</script>
<style scoped>
table {
  text-align: left;
  border-collapse: collapse;
  width: 100%;
  padding: 10px;
  display: table;
  margin-bottom: 20px;
  margin-left: 10px;
}

table :deep(.selected) {
  background: #444;
}

table :deep(td),
table :deep(th) {
  padding: 2px 0;
  vertical-align: middle;
}
table :deep(th) {
  font-weight: 700;
}
table :deep(thead), table :deep(tbody) {
  border-bottom: 1px solid #fff;
}
table :deep(tbody tr:hover) {
  background: #444;
}
</style>
