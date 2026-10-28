<template>
  <table :id="props.id">
    <slot />
  </table>
</template>
<script setup>
const props = defineProps({
  id: {
    type: String,
    default: null
  }});
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
/* a 1em gap between columns: every cell but the last of its row */
table :deep(:is(td, th):not(:last-child)) {
  padding-right: 1em;
}
table :deep(th) {
  font-weight: 700;
  white-space: nowrap;
}
/* long unbroken words (private project names) wrap, so the table is never wider than its
   panel; `anywhere`, unlike `break-word`, also lowers the min-content width */
table :deep(td) {
  overflow-wrap: anywhere;
}
table :deep(thead), table :deep(tbody) {
  border-bottom: 1px solid #fff;
}
table :deep(tbody tr:hover) {
  background: #444;
}
</style>
