<template>
  <div
    class="labelset nwl-panel"
    v-if="ontology != null && open"
    ref="labelsetRef"
    @mouseup="onHeaderMouseUp"
  >
    <div
      class="header nwl-panel-header"
      @mousedown="onHeaderMouseDown"
    >
      <img
        class="close"
        alt="close"
        src="@/icons/times-circle.svg"
        @click="emit('onClose')"
      ><!--<br>
      <b>Labels</b>-->
    </div>

    <!-- the header stays while the body scrolls (widgets.css .nwl-panel, 3.2.0) -->
    <div class="body nwl-panel-body">
      <h3>Label Set</h3>
      <span id="labels-name">{{ ontology.name }}</span>

      <h3>Labels</h3>
      <ul class="label-list">
        <li
          v-for="(label, index) in ontology.labels"
          :key="label.name"
          @click="emit('labelClick', index)"
        >
          <div
            class="label-color"
            :style="`background-color: rgb(${label.color[0]}, ${label.color[1]}, ${label.color[2]});`"
          />
          <span class="label-name">{{ label.name }}</span>
        </li>
      </ul>
      <div v-if="opacity !== null">
        <b>Opacity</b><br>
        <input
          id="labels-opacity"
          type="range"
          min="0"
          max="1"
          step="0.01"
          v-model.number="opacity"
        >
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';

import { floatingPanel, isTransformed, pinPanel } from '@/components/common/panel.js';

defineProps({
  ontology: {
    type: Object,
    required: false,
    default: null
  },
  open: Boolean
});

const emit = defineEmits(['labelClick', 'onClose']);

const opacity = defineModel('opacity', {type: Number, default: null});

const isDragging = ref(false);
const labelsetRef = ref(null);
const clickOffset = ref({ x: 0, y: 0 });

// centred until first pressed (resize handle, header): then pinned by its top-left corner, so
// that a resize grows it towards the corner pulled only (panel.js, 3.2.0); resizable (its
// `resize: both`), it gets the resize handle that works with a finger too (3.3.0). Each
// opening makes a new panel (v-if).
watch(labelsetRef, (panel) => {
  if (panel) { floatingPanel(panel); }
}, { flush: 'post' });

const onHeaderMouseDown = (e) => {
  // the press was a pointerdown first (floatingPanel pinned it), but not always a mouse's
  if (isTransformed(labelsetRef.value)) { pinPanel(labelsetRef.value); }
  isDragging.value = true;
  const {top, left} = labelsetRef.value.getBoundingClientRect();
  clickOffset.value.x = e.clientX - left;
  clickOffset.value.y = e.clientY - top;
};

const onHeaderMouseUp = () => {
  isDragging.value = false;
};

const onMouseMove = (e) => {
  if (!isDragging.value) { return; }
  labelsetRef.value.style.left = e.clientX - clickOffset.value.x + 'px';
  labelsetRef.value.style.top = e.clientY - clickOffset.value.y + 'px';
};

onMounted(() => {
  document.addEventListener('mousemove', onMouseMove);
});

onUnmounted(() => {
  document.removeEventListener('mousemove', onMouseMove);
});

</script>
<style scoped>

/* widgets.css .nwl-panel lays it out: the header stays, the body scrolls */
.labelset {
    position: fixed;
    width: 50%;
    height: 50%;
    top: 50%;
    left: 50%;
    transform: translate( -50%, -50%);
    text-align: left;

    background-color: var(--nwl-black-80);
    border: thin solid var(--nwl-border);
    text-align: left;
    z-index: 21;
    /* a floating panel */
    box-shadow: var(--nwl-shadow-2);
    font-size: 0.8rem;
    resize: both;
}

/* the panel's contents are 14px, as with 1.x's `*` rule (the panel's own 0.8rem doesn't reach them) */
.labelset > * {
    font-size: var(--nwl-text-md);
}

h3 {
    margin: 20px 0 0;
}

.close {
    width: 16px;
    height: 16px;
    cursor: pointer;
}

.header {
    height: 36px;
    background-color: var(--nwl-grey-66);
    padding: 0 5px 0 10px;
}

/* the body's first title stays 20px below the header: 10px of padding, 10px of margin */
.body > h3:first-child {
    margin-top: 10px;
}

.header img {
    float: right;
    width:0.9rem;
    height:0.9rem;
    margin:8px 2px;
    vertical-align:middle;
    cursor:pointer;
}

/* .header {
    display: flex;
    justify-content: flex-end;
    padding: 10px 10px 0 0;
} */

.label-color {
    vertical-align:middle;
    margin:6px;
    display:inline-block;
    width:40px;
    height:30px;
    background-color: var(--nwl-black);
}
.label-list {
    display:flex;
    flex-wrap:wrap;
    text-align:left;
    padding: 0;
    list-style: none;
 }
.label-list li {
    cursor: pointer;
}

</style>
