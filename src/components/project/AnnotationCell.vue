<template>
    <td
        :contenteditable="editable"
        @input="emit('valueChange', [$event.currentTarget.textContent, index, selector]);"
        v-html="formattedValue"
        ref="root"
    >
    </td>
</template>
<script setup>
import { ref, computed, watch } from 'vue';
import DOMPurify from 'dompurify';

const props = defineProps({
    value: {
        type: String,
        required: true,
    },
    index: {
        type: Number,
        required: true,
    },
    selector: {
        type: String,
        required: true,
    },
    linkPrefix: String,
});

const emit = defineEmits(['valueChange']);
const editable = !(typeof props.value === 'string' && props.value.startsWith('http'));

const formattedValue = computed(() => {
  let annotation = DOMPurify.sanitize(props.value);
  if (annotation.startsWith('http')) {
    const link = props.linkPrefix ? `${props.linkPrefix}${annotation}` : annotation;
    return `<a href="${link}">${annotation.substring(annotation.lastIndexOf('/'))}</a>`;
  }
  return annotation;

});

const root = ref(null);

function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined"
            && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapseToEnd();
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapseToEnd();
        textRange.select();
    };
}

watch(formattedValue, () => {
    if (document.activeElement === root.value) {
        placeCaretAtEnd(root.value);
    }
});


</script>