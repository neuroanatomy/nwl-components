<template>
  <td
    ref="root"
    v-once
    :contenteditable="editable"
    v-html="formattedValue"
    :value="formattedValue"
    class="noEmpty"
    @input="emit('valueChange', [$event.currentTarget.textContent, index, selector]);"
  />
</template>
<script setup>
import DOMPurify from 'dompurify';
import { ref, computed, watch } from 'vue';

const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  index: {
    type: Number,
    required: true
  },
  selector: {
    type: [String, Array],
    required: true
  },
  linkPrefix: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['valueChange']);
const editable = !(typeof props.value === 'string' && props.value.startsWith('http'));

const formattedValue = computed(() => {
  const annotation = DOMPurify.sanitize(props.value);
  if (annotation.startsWith('http')) {
    const link = props.linkPrefix ? `${props.linkPrefix}${annotation}` : annotation;

    return `<a href="${link}">${annotation.substring(annotation.lastIndexOf('/'))}</a>`;
  }

  return annotation;

});

const root = ref(null);

watch(formattedValue, () => {
  if (document.activeElement === root.value) {
    return;
  }
  root.value.innerHTML = formattedValue.value;
});


</script>
<style scoped>
.noEmpty:empty:before {
  content: "Empty";
  color: rgba(255, 255, 255, 0.4);
}
</style>
