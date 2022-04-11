<template>
  <Table id="annotations">
    <thead>
      <tr>
        <th v-for="[key] in keys" :key="key">{{ key }}</th>
      </tr>
    </thead>
    <tbody>
      <tr
        :class="{ selected: index === selectedIndex }"
        @click="emit('selectFile', file); selectedIndex = index"
        v-for="(file, index) in transformedFiles"
        :key="`file_${index}`"
      >
        <template
          v-for="[key, selector] in keys"
          :key="`${key}_${index}`"
        >
          <AnnotationCell :value="get(file, selector)" :selector="selector" :index="index" @value-change="emit('valueChange', ...$event)" />
        </template>
      </tr>
    </tbody>
  </Table>
</template>
<script setup>
import { ref, computed } from 'vue';
import { get } from 'lodash-es';
import AnnotationCell from '@/components/project/AnnotationCell';

const props = defineProps({
  projectName: {
    type: String,
    required: true,
  },
  files: {
    type: Array,
    required: true,
  },
  extractKeys: {
    type: Function,
    required: false,
  },
  transformFiles: {
    type: Function,
    default: (files) => files,
  },
});

const emit = defineEmits(['valueChange', 'selectFile']);
const keys = props.extractKeys(props);
const selectedIndex = ref(0);
const transformedFiles = computed(() => props.transformFiles(props.files));

</script>
<style scoped>
table {
  border-collapse: collapse;  
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
