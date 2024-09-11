<template>
  <div
    class="labelset"
    v-if="ontology != null && open"
    ref="labelsetRef"
    @mouseup="onHeaderMouseUp"
  >
    <div
      class="header"
      @mousedown="onHeaderMouseDown"
    >
      <img
        class="close"
        alt="close"
        src="@/assets/times-circle.svg"
        @click="emit('onClose')"
      ><!--<br>
      <b>Labels</b>-->
    </div>

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
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

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

const onHeaderMouseDown = (e) => {
  isDragging.value = true;
  const {top, left, width, height} = labelsetRef.value.getBoundingClientRect();
  clickOffset.value.x = e.clientX - left - width / 2;
  clickOffset.value.y = e.clientY - top - height / 2;
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

.labelset {
    overflow: scroll;
    position: fixed;
    width: 50%;
    height: 50%;
    overflow: scroll;
    top: 50%;
    left: 50%;
    transform: translate( -50%, -50%);
    text-align: left;

    background-color: rgba(0, 0, 0, 0.8);
    /* background-color: #333; */
    border: thin solid #777;
    padding: 10px;
    text-align: left;
    z-index: 21;
    font-size: 0.8rem;
    resize: both;
    /* padding: 0 20px 20px; */
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
    background-color: #666;
    padding: 0 5px 0 10px;
    margin: -10px -10px 5px -10px;
    cursor:  pointer;
    /* pointer-events: none; */
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
    background-color:rgb(0,0,0);
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
