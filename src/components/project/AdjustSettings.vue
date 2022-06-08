<template>
  <div class="adjust-settings">
    <!-- Transparency -->
    <div class="setting">
      <img src="@/assets/alpha.svg" class="icon" />
      <RangeSlider
        :max="100"
        v-model="alpha"
        @update:modelValue="emit('changeAlpha', $event)"
        :display-buttons="false"
      />
    </div>

    <!-- Brightness -->
    <div class="setting">
      <img src="@/assets/sun-o.svg" class="icon" />
      <RangeSlider
        :max="100"
        v-model="brightness"
        @update:modelValue="emit('changeBrightness', $event)"
        :display-buttons="false"
      />
    </div>

    <!-- Contrast -->
    <div class="setting">
      <img src="@/assets/adjust.svg" class="icon" />
      <RangeSlider
        :max="100"
        v-model="contrast"
        @update:modelValue="emit('changeContrast', $event)"
        :display-buttons="false"
      />
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import RangeSlider from "@/components/project/RangeSlider.vue";
const props = defineProps({
  alpha: Number,
  brightness: Number,
  contrast: Number,
});

const alpha = ref(props.alpha);
const brightness = ref(props.brightness);
const contrast = ref(props.contrast);

const emit = defineEmits(["changeAlpha", "changeBrightness", "changeContrast"]);
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