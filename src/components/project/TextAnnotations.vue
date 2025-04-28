<template>
  <Table id="annotations">
    <thead>
      <tr>
        <th
          v-for="[key] in keys"
          :key="key"
        >
          {{ key }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        :class="{ selected: index === selectedIndex }"
        @click="emit('selectFile', file); selectedIndex = index"
        v-for="(file, index) in files"
        :key="`file_${index}`"
      >
        <template
          v-for="[key, selector] in keys"
          :key="`${key}_${index}`"
        >
          <AnnotationCell
            :value="get(file, selector)"
            :selector="selector"
            :index="index"
            :link-prefix="linkPrefix"
            @value-change="emit('valueChange', ...$event)"
          />
        </template>
      </tr>
    </tbody>
  </Table>
</template>
<script setup>
import { get } from 'lodash-es';
import { ref, watch } from 'vue';

import Table from '@/components/common/Table.vue';
import AnnotationCell from '@/components/project/AnnotationCell.vue';

const props = defineProps({
  files: {
    type: Object,
    required: true
  },
  extractKeys: {
    type: Function,
    required: true
  },
  linkPrefix: {
    type: String,
    default: ''
  },
  selected: {
    type: Number,
    default: 0
  }
});

const selectedIndex = defineModel('selectedIndex', {
  type: Number,
  default: null
});

const emit = defineEmits(['valueChange', 'selectFile']);
const keys = ref(props.extractKeys(props.files));

watch(props, () => {
  keys.value = props.extractKeys(props.files);
});

</script>
<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 20px;
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
