<template>
  <Table id="volAnnotations">
    <thead>
      <tr>
        <th v-for="[key] in keys" :key="key">{{ key }}</th>
      </tr>
    </thead>
    <tbody>
      <tr
        :class="{ selected: index === selectedIndex }"
        @click="emit('selectAnnotation', atlas); selectedIndex = index"
        v-for="(atlas, index) in annotations"
        :key="`annotation_${index}`"
      >
        <td
          v-for="[key, selector] in keys"
          :key="`${key}_${index}`"
        >
          {{get(atlas, selector)}}
        </td>
      </tr>
    </tbody>
  </Table>
</template>
<script setup>
import { ref, watch } from 'vue';
import { get } from 'lodash-es';
import Table from '@/components/common/Table.vue';

const props = defineProps({
  annotations: {
    type: Array,
    required: true,
  },
  extractKeys: {
    type: Function,
    required: false,
  },
});

const emit = defineEmits(['selectAnnotation']);
const keys = ref(props.extractKeys(props.annotations));
const selectedIndex = ref(0);

watch(props, () => {
  keys.value = props.extractKeys(props.annotations);
  selectedIndex.value = 0;
});

</script>
<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}
th {
  text-align: left;
}

td {
  overflow-wrap: break-word;
  word-wrap: break-word;

  -ms-word-break: break-all;
  word-break: break-all;
  word-break: break-word;

  hyphens: auto;  
}
.selected {
  background: #444;
}
</style>
