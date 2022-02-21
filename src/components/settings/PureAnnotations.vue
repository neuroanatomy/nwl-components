<template>
  <div class="wrapper">
    <h2>Annotations</h2>
    <Table id="annotations">
      <thead>
        <tr>
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
          :class="{ selected: selected === idx }"
          @click="handleRowClick($event, idx)"
        >
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
                v-for="opt in annotationTypes"
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
              v-if="annotation.type !== 'text'"
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
            <Checkbox
              v-model="annotation.display"
              @change="handleDisplayChange(annotation, $event)"
            />
          </td>
        </tr>
      </tbody>
    </Table>
    <div class="actions">
      <Button
        :small="true"
        @click="$emit('addAnnotation')"
        title="Add annotation"
      >
        +
      </Button>
      <Button
        :small="true"
        @click="$emit('removeAnnotations', [selected])"
        title="Remove selected annotations"
        :disabled="selected == null"
      >
        -
      </Button>
    </div>
  </div>
</template>
<script setup>
import { inject, ref, reactive } from "vue";
import Select from "@/components/common/Select.vue";
import TextInput from "@/components/common/TextInput.vue";
import Button from "@/components/common/Button.vue";
import Checkbox from "@/components/common/Checkbox.vue";
import Table from "@/components/common/Table.vue";

const { baseURL, fetchLabelSets, annotationTypes } = inject("config");

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

const labelSets = reactive([]);

const updateLabelSets = async () => {
  labelSets.push(...await fetchLabelSets());
};

updateLabelSets();

const selected = ref(null);
const handleRowClick = (event, idx) => {
  selected.value = idx;
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
  if (type === "text") {
    payload.values = "";
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
  font-size: 14px;
  padding-bottom: 4px;
}
.actions {
  text-align: right;
  margin-top: 20px;
}
</style>