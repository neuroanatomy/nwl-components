<template>
  <div class="range-slider">
    <Button
      small
      @click="handleMinusClick"
      v-if="displayButtons"
    >
      -
    </Button>
    <input
      type="range"
      min="0"
      :max="max"
      :value="innerValue"
      step="1"
      @input="handleInput"
    >
    <Button
      small
      @click="handlePlusClick"
      v-if="displayButtons"
    >
      +
    </Button>
  </div>
</template>
<script setup>
import { ref, watch, computed } from 'vue';

import Button from '@/components/common/Button.vue';

const props = defineProps({
  max: {
    type: Number,
    required: true
  },
  modelValue: {
    type: Number,
    default: 0
  },
  displayButtons: {
    type: Boolean,
    default: true
  }
});

const innerValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});
const emit = defineEmits(['update:modelValue']);

const handleInput = ($event) => {
  innerValue.value = parseInt($event.target.value);
};

const handlePlusClick = () => {
  const value = (innerValue.value || props.modelValue) + 1;
  innerValue.value = Math.min(value, props.max);
};

const handleMinusClick = () => {
  const value = (innerValue.value || props.modelValue) - 1;
  innerValue.value = Math.max(value, 0);
};
</script>
<style scoped>
.range-slider {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}
input[type=range] {
  -webkit-appearance: none;
  margin: 18px 5px;
  width: 100%;
  background: transparent;
}
input[type=range]:focus {
  outline: none;
}
input[type=range]::-webkit-slider-runnable-track {
  width: 100%;
  height: 1px;
  cursor: pointer;
  background: white;
  border: 0;
}
input[type=range]::-webkit-slider-thumb {
  box-shadow: none;
  border: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #ffffff;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -10px;
}
input[type=range]:focus::-webkit-slider-runnable-track {
  background: white;
}
input[type=range]::-moz-range-track {
  width: 100%;
  height: 1px;
  background: #ffffff;
  cursor: pointer;
  box-shadow: none;
  border: none;
}
input[type=range]::-moz-range-thumb {
  box-shadow: none;
  border: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
}
input[type=range]::-ms-track {
  width: 100%;
  height: 1px;
  cursor: pointer;
  background: transparent;
  border-color: transparent;
  border-width: 16px 0;
  color: transparent;
}
input[type=range]::-ms-thumb {
  box-shadow: none;
  border: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #ffffff;
  cursor: pointer;
}
input[type=range]:focus::-ms-fill-lower {
  background: white;
}
input[type=range]:focus::-ms-fill-upper {
  background: white;
}
</style>
