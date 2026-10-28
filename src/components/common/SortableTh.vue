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
           Icons: Tabler Icons (MIT, https://tabler.io/icons): arrows-sort, arrow-up, arrow-down. -->
      <svg
        class="nwl-sort-indicator"
        :data-state="dir"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <template v-if="dir === 'ascending'">
          <path d="M12 5l0 14" /><path d="M18 11l-6 -6" /><path d="M6 11l6 -6" />
        </template>
        <template v-else-if="dir === 'descending'">
          <path d="M12 5l0 14" /><path d="M18 13l-6 6" /><path d="M6 13l6 6" />
        </template>
        <template v-else>
          <path d="M3 9l4 -4l4 4m-4 -4v14" /><path d="M21 15l-4 4l-4 -4m4 4v-14" />
        </template>
      </svg>
    </button>
  </th>
</template>
<script setup>
import { computed } from 'vue';

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

const dir = computed(() => props.sort.direction(props.column));
</script>
<style scoped>
th.nwl-sortable {
  padding: 0;
}
th.nwl-sortable:hover {
  background: #444;
}
.nwl-sort-button {
  all: unset;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 0;
  white-space: nowrap;
  font: inherit;
  color: inherit;
  text-align: inherit;
  cursor: pointer;
  user-select: none;
}
.nwl-sort-button:focus-visible {
  outline: 1px solid currentColor;
  outline-offset: 1px;
}
.nwl-sort-indicator {
  display: block;
  flex: none;
  width: 1.1em;
  height: 1.1em;
}
/* not the sort column: a neutral grey "sort" icon, brighter on hover;
   the sort column: one arrow in the header's text colour */
.nwl-sort-indicator[data-state="none"] {
  color: #7a7a7a;
}
.nwl-sort-button:hover .nwl-sort-indicator[data-state="none"],
.nwl-sort-button:focus-visible .nwl-sort-indicator[data-state="none"] {
  color: #bbb;
}
</style>
