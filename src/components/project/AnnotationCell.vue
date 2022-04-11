<template>
    <td
        :contenteditable="editable"
        @input="emit('valueChange', $event.currentTarget.textContent, index, selector)"
    >
        <template v-if="formattedValue != null">
            <div v-html="formattedValue" />
        </template>
    </td>
</template>
<script setup>
import { computed } from 'vue';
import DOMPurify from 'dompurify';

const props = defineProps({
    value: {
        type: String,
        required: true,
    }
});

const editable = props.value != null && !props.value.startsWith('http');

const formattedValue = computed(() => {
  let annotation = DOMPurify.sanitize(props.value);
  if (annotation.startsWith('http')) {
    return `<a href="${annotation}">${annotation.substring(annotation.lastIndexOf('/'))}</a>`;
  }
  return annotation;

});

</script>