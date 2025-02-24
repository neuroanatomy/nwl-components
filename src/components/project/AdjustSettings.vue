<template>
  <div class="adjust-settings">
    <!-- Transparency -->
    <div class="setting">
      <img
        src="@/assets/alpha.svg"
        class="icon"
      >
      <RangeSlider
        :max="100"
        v-model="alpha"
        :display-buttons="false"
      />
    </div>

    <!-- Brightness -->
    <div class="setting">
      <img
        src="@/assets/sun-o.svg"
        class="icon"
      >
      <RangeSlider
        :max="100"
        v-model="brightness"
        :display-buttons="false"
      />
    </div>

    <!-- Contrast -->
    <div class="setting">
      <img
        src="@/assets/adjust.svg"
        class="icon"
      >
      <RangeSlider
        :max="100"
        v-model="contrast"
        :display-buttons="false"
      />
    </div>
  </div>
</template>
<script setup>
import RangeSlider from '@/components/project/RangeSlider.vue';
const alpha = defineModel('alpha', {type: Number, default: 0});
const brightness = defineModel('brightness', {type: Number, default: 0});
const contrast = defineModel('contrast', {type: Number, default: 0});
</script>
<style scoped>
.icon {
  width: 20px;
  height: 20px;
}
.setting {
  display: flex;
  align-items: center;
}
</style>
