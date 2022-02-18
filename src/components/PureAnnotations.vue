<template>
  <div class="wrapper">
    <h2>Annotations</h2>
    <Table id="annotations">
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Type</th>
          <th>Value</th>
          <th>Display</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(annotation, idx) in annotations"
          :key="idx"
          @click="handleRowClick($event, idx)"
        >
          <td>
            <input
              type="checkbox"
              :checked="selected.has(idx)"
              @click="toggleSelected(idx)"
            />
          </td>
          <td>
            <TextInput
              v-model="annotation.name"
              placeholder="Enter annotation name"
              @blur="handleNameChange(annotation, $event.target.value)"
              @keyup.enter="handleNameChange(annotation, $event.target.value)"
            />
          </td>
          <td>
            <Select
              v-model="annotation.type"
              @change="handleTypeChange(annotation, $event.target.value)"
            >
              <option
                v-for="opt in annotationType"
                :key="`${annotation.name}${opt}`"
                :value="opt"
                :selected="opt === annotation.type"
              >
                {{ opt }}
              </option>
            </Select>
          </td>
          <td>
            <Select
              v-if="annotation.type === 'volume'"
              v-model="annotation.values"
              @change="handleValueChange(annotation, $event.target.value)"
            >
              <option
                v-for="opt in labelSets"
                :value="opt.source"
                :key="`${annotation.name}${opt.source}`"
                :selected="opt.source === annotation.values"
              >
                {{ opt.name }}
              </option>
            </Select>
          </td>
          <td>
            <input type="checkbox" v-model="annotation.display" @change="handleDisplayChange(annotation, $event.target.checked)" />
          </td>
        </tr>
      </tbody>
    </Table>
    <div class="actions">
      <Button @click="$emit('addAnnotation')" title="Add annotation">
        +
      </Button>
      <Button
        @click="$emit('removeAnnotations', [...selected])"
        title="Remove selected annotations"
        :disabled="selected.size === 0"
      >
        -
      </Button>
    </div>
  </div>
</template>
<script setup>
import { inject, reactive } from "vue";
import Select from "./Select.vue";
import TextInput from "./TextInput.vue";
import Button from "./Button.vue";
import Table from "./Table.vue";

const baseURL = inject("baseURL");

const props = defineProps({
  annotations: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits([
  "addAnnotation",
  "removeAnnotations",
  "updateAnnotation",
]);

const annotationType = ["volume", "text"];
const labelSets = reactive([]);

const fetchLabelSets = async () => {
  labelSets.push(
    ...(await (await fetch(`${baseURL}/api/getLabelsets`)).json())
  );
};

fetchLabelSets();

const selected = reactive(new Set());
const toggleSelected = (idx) => {
  selected.has(idx) ? selected.delete(idx) : selected.add(idx);
};

const handleRowClick = (event, idx) => {
  if (["BUTTON", "INPUT", "SELECT"].includes(event.target.tagName)) {
    return;
  }
  toggleSelected(idx);
};

const emitAnnotationUpdate = (idx, properties) => {
  emit("updateAnnotation", idx, {
    ...props.annotations[idx],
    ...properties,
  });
};

const handleNameChange = (annotation, name) => {
  const idx = props.annotations.indexOf(annotation);
  if (idx < 0) return;
  emitAnnotationUpdate(idx, { name });
};

const handleTypeChange = (annotation, type) => {
  const idx = props.annotations.indexOf(annotation);
  if (idx < 0) return;
  const payload = { type };
  if (type === 'text') {
    payload.values = '';
  }
  emitAnnotationUpdate(idx, payload);
};

const handleValueChange = (annotation, values) => {
  const idx = props.annotations.indexOf(annotation);
  if (idx < 0) return;
  emitAnnotationUpdate(idx, { values });
};

const handleDisplayChange = (annotation, display) => {
  const idx = props.annotations.indexOf(annotation);
  if (idx < 0) return;
  emitAnnotationUpdate(idx, { display });
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

td:first-child {
  text-align: center;
  padding: 5px;
}
.actions {
  text-align: right;
  margin-top: 20px;
}
</style>