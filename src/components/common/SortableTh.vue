<template>
  <th
    class="nwl-sortable"
    :aria-sort="dir"
  >
    <button
      type="button"
      class="nwl-sort-button"
      @click="sort.sortBy(column)"
    >
      <span class="nwl-sort-label"><slot>{{ column }}</slot></span>
      <!-- One fixed-size box in every state: only the drawing inside changes, so the header
           never moves or resizes when the sort or the hover changes.
           The icon (attributes and paths) comes from sort.js, as for plain-DOM headers. -->
      <svg
        v-bind="SORT_ICON_ATTRS"
        :data-state="dir"
      >
        <path
          v-for="d in SORT_ICON_PATHS[dir]"
          :key="d"
          :d="d"
        />
      </svg>
    </button>
  </th>
</template>
<script setup>
import { computed } from 'vue';

import { SORT_ICON_ATTRS, SORT_ICON_PATHS, ariaSort } from './sort.js';

const props = defineProps({
  // what useSortable() returns
  sort: {
    type: Object,
    required: true
  },
  // the column name, as in useSortable's columns; also the label when the slot is empty
  column: {
    type: String,
    required: true
  }
});

const dir = computed(() => ariaSort(props.sort.direction(props.column)));
</script>
<!-- the same rules twice: scoped, so they win over Table's cell rules as before, and global,
     so plain-DOM headers made with sortableHeader() (sort.js) look the same -->
<style scoped src="./sortable.css"></style>
<style src="./sortable.css"></style>
