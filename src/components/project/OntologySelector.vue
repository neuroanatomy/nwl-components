<template>
  <div
    class="labelset"
    v-if="ontology != null && open"
  >
    <div class="header">
      <img
        class="close"
        alt="close"
        src="@/assets/times-circle.svg"
        @click="emit('onClose')"
      >
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
  </div>
</template>
<script setup>

const props = defineProps({
  ontology: {
    type: Object,
    required: true
  },
  open: Boolean
});

const emit = defineEmits(['labelClick', 'onClose']);

</script>
<style scoped>

.labelset {
    overflow: scroll;
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    text-align: left;
    background-color: #333;
    z-index: 21;
    padding: 0 20px 20px;
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
    display: flex;
    justify-content: flex-end;
    padding: 10px 10px 0 0;
}

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
