<template>
  <div class="wrapper">
    <Button small @click="emit('input', Math.max(0, value--))">-</Button>
    <input type="range" min="0" :max="max" step="1" v-model="value" @change="emit('input', parseInt($event.target.value))" />
    <Button small @click="emit('input', Math.min(max, value++))">+</Button>
  </div>
</template>
<script setup>
import Button from '@/components/common/Button';
const props = defineProps({
  max: {
    type: Number,
    required: true,
  },
  value: {
    type: Number,
    default: 0,
  }
});

const emit = defineEmits(['input']);
</script>
<style scoped>
.wrapper {
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