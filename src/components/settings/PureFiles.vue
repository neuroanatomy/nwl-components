<template>
  <div class="wrapper">
    <h2>Files</h2>
    <Table id="access">
      <thead>
        <tr>
          <th>URL</th>
          <th>Name</th>
          <th>Batch</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(file, idx) in files"
          :key="file.source"
          @click="handleRowClick($event, idx)"
        >
          <td>
            <TextInput
              v-model="file.source"
              placeholder="File URL"
              @blur="handleSourceChange(file, $event.target.value)"
              @keyup.enter="handleSourceChange(file, $event.target.value)"
            />
          </td>
          <td>
            <TextInput
              v-model="file.name"
              placeholder="File Name"
              @blur="handleNameChange(file, $event.target.value)"
              @keyup.enter="handleNameChange(file, $event.target.value)"
            />
          </td>
          <td>
            <input
              type="checkbox"
              :checked="selected.has(idx)"
              @click="toggleSelected(idx)"
            />
          </td>
        </tr>
      </tbody>
    </Table>
    <div class="actions">
      <Button :small="true" @click="$emit('uploadCSV')" title="Upload CSV">
        <img src="@/assets/upload.svg" alt="Upload CSV" />
      </Button>
      <Button :small="true" @click="$emit('downloadCSV')" title="Download CSV">
        <img src="@/assets/download.svg" alt="Download CSV" />
      </Button>
      <Button :small="true" @click="$emit('addFile')" title="Add file">
        +
      </Button>
      <Button :small="true"
        @click="$emit('removeFiles', [...selected])"
        title="Remove selected files"
        :disabled="selected.size === 0"
      >
        -
      </Button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import TextInput from "@/components/common/TextInput.vue";
import Button from "@/components/common/Button.vue";
import Table from "@/components/common/Table.vue";

const props = defineProps({
  files: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits([
  "addFile",
  "removeFiles",
  "updateFile",
  "uploadCSV",
  "downloadCSV"
]);

const selected = reactive(new Set());
const toggleSelected = (idx) => {
  selected.has(idx) ? selected.delete(idx) : selected.add(idx);
};

const handleRowClick = (event, idx) => {
  if (["BUTTON", "INPUT", "LI"].includes(event.target.tagName)) {
    return;
  }
  toggleSelected(idx);
};

const emitFileUpdate = (idx, properties) => {
  emit("updateFile", idx, {
    ...props.files[idx],
    ...properties,
  });
};

const handleNameChange = (file, name) => {
  const idx = props.files.indexOf(file);
  if (idx < 0) return;
  emitFileUpdate(idx, { name });
};

const handleSourceChange = (file, source) => {
  const idx = props.files.indexOf(file);
  if (idx < 0) return;
  emitFileUpdate(idx, { source });
};
</script>
<style scoped>
h2 {
  margin: 0 0 10px;
  font-size: 16px;
}
.wrapper {
  padding: 10px;
}

th:last-child, td:last-child {
  text-align: right;
  padding: 5px;
}
.actions {
  text-align: right;
  margin-top: 20px;
}
</style>