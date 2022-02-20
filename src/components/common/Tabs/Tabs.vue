<template>
  <div class="tabs">
    <ul>
      <li
        v-for="(tab, index) in children"
        :key="tab.props.title"
        @click="selectTab(index)"
        :class='{"selected": (index == selectedIndex)}'
      >
        {{ tab.props.title }}
      </li>
    </ul>
    <template v-if="false"><slot /></template>
    <CurrentTab :key="selectedIndex" />
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from "vue";
const selectedIndex = ref(0);
const instance = getCurrentInstance();
const children = instance.vnode.children.default();
const CurrentTab = {
  render: () => children[selectedIndex.value]
};
const selectTab = (i) => {
  selectedIndex.value = i;
};
</script>

<style scoped>
ul { 
  list-style: none;
  display: flex;
  padding: 0;
  margin: 0;
}
li {
    padding-right: 12px;
    padding-left: 12px;
    padding-bottom: 4px;
    cursor: pointer;
    height: 20px;
}

.selected {
  background: #333;
}
</style>
 