<script setup>
// Adapted from https://www.digitalocean.com/community/tutorials/vuejs-vue-a11y-autocomplete
import { nanoid } from 'nanoid';
import { watch, reactive, ref, onMounted, onUnmounted } from 'vue';

import TextInput from './TextInput.vue';

const props = defineProps({
  items: {
    type: Array,
    required: false
  },
  isAsync: {
    type: Boolean,
    required: false,
    default: false
  },
  ariaLabel: {
    type: String,
    required: true
  },
  defaultValue: {
    type: String,
    required: false,
    default: ''
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false
  },
  extraSelectArgs: {
    type: Array,
    default: () => []
  },
  extractResultText: {
    type: Function,
    default: (r) => r
  }
});

const state = reactive({
  isOpen: false,
  results: [],
  search: props.defaultValue,
  isLoading: false,
  arrowCounter: 0,
  activedescendant: ''
});

const root = ref(null);

watch(props.items, () => {
  state.results = props.items;
  state.isLoading = false;
});

const emit = defineEmits(['input', 'select']);

const onChange = (event) => {
  emit('input', state.search);
  state.isOpen = true;
  if (props.isAsync) {
    state.isLoading = true;
  } else {
    filterResults();
  }
};

const filterResults = () => {
  state.results = state.items.filter((item) => item.toLowerCase().indexOf(state.search.toLowerCase()) > -1);
};

const getId = (index) => `result-item-${index}`;

const setActiveDescendent = () => {
  state.activedescendant = getId(state.arrowCounter);
};

const isSelected = (i) => i === state.arrowCounter;

const setResult = (result) => {
  state.search = props.extractResultText(result);
  state.isOpen = false;
  emit('select', result, ...props.extraSelectArgs);

  return false;
};

const onArrowDown = (evt) => {
  if (state.isOpen) {
    state.arrowCounter = (state.arrowCounter + 1) % state.results.length;
    setActiveDescendent();
  }
};

const onArrowUp = () => {
  if (state.isOpen) {
    state.arrowCounter =
      state.arrowCounter > 0
        ? state.arrowCounter - 1
        : state.results.length - 1;
    setActiveDescendent();
  }
};

const onEnter = () => {
  setResult(state.results[state.arrowCounter]);
};

const handleClickOutside = (evt) => {
  if (!root.value.contains(evt.target)) {
    state.isOpen = false;
    state.arrowCounter = -1;
  }
};

const uid = nanoid();

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
<template>
  <div
    ref="root"
    class="autocomplete"
    role="combobox"
    aria-haspopup="listbox"
    :aria-owns="`${uid}-autocomplete-results`"
    :aria-expanded="state.isOpen"
  >
    <TextInput
      @input="onChange"
      v-model="state.search"
      @keydown.down="onArrowDown"
      @keydown.up="onArrowUp"
      @keydown.enter="onEnter"
      role="searchbox"
      aria-autocomplete="list"
      :aria-controls="`${uid}-autocomplete-results`"
      :aria-label="ariaLabel"
      :aria-activedescendant="state.activedescendant"
      :disabled="props.disabled"
    />
    <ul
      :id="`${uid}-autocomplete-results`"
      v-show="state.isOpen"
      class="autocomplete-results"
      role="listbox"
    >
      <li
        class="loading"
        v-if="state.isLoading"
      >
        Loading results...
      </li>
      <li
        v-else
        v-for="(result, i) in state.results"
        :key="i"
        @click="setResult(result)"
        class="autocomplete-result"
        :class="{ 'is-active': isSelected(i) }"
        role="option"
        :id="getId(i)"
        :aria-selected="isSelected(i)"
      >
        {{ props.extractResultText(result) }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.autocomplete-results {
  position: absolute;
  top: 30px;
  z-index: 10;
  background: #222;
  width: auto;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  list-style: none;
}
.autocomplete-results li {
  padding: 10px;
  border-bottom: 1px solid #333;
  cursor: pointer;
}
.autocomplete-results li:hover,
.is-active {
  background: #444;
  color: #fff;
}
</style>
