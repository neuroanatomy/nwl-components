<template>
  <table :id="props.id">
    <slot />
  </table>
</template>
<script setup>
const props = defineProps({
  id: String,
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
}

table :deep(td),
table :deep(th) {
  padding-right: 20px;
  padding-bottom: 5px;
  padding: 10px 20px 10px 0;
  vertical-align: middle;
}
table :deep(th) {
  font-weight: normal;
  font-weight: 700;
}
table :deep(thead) {
  border-bottom: 1px solid #fff;
}
table :deep(tbody tr) {
  border-bottom: 1px solid #555;
}
table :deep(tbody tr:hover) {
  background: #444;
}
</style>