<template>
  <div
    class="area"
    @mouseup="drag = false"
    ref="area"
    @mousleave="drag = false"
  >
    <div class="content-wrapper">
      <slot name="content" />
    </div>
    <div ref="tools" class="tools" :style="{ ...position }">
      <button v-show="!toggled" class="show-tools" @click="toggled = true">
        <img src="@/assets/bars.svg" alt="show tools" />
      </button>
      <VueResizable
        v-show="toggled"
        :active="['rb', 'b', 'r']"
        :min-width="275"
        :min-height="dense ? 220 : 320"
        :width="275"
        :height="dense ? 220 : 320"
        @resize:end="onResizeEnd"
      >
        <div class="palette">
          <div class="header" @mousedown="handleMouseDown">
            <button class="toggle" @click="hideTools()">
              <img src="@/assets/times-circle.svg" alt="hide tools" />
            </button>
            <span class="title">{{ title }}</span>
            <button class="left" @mousedown.stop="placeLeft">
              <img
                src="@/assets/caret-square-o-left.svg"
                alt="place tools left"
              />
            </button>
            <button class="right" @mousedown.stop="placeRight">
              <img
                src="@/assets/caret-square-o-right.svg"
                alt="place tools right"
              />
            </button>
          </div>
          <div class="content">
            <slot name="tools" />
          </div>
        </div>
      </VueResizable>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import VueResizable from "vue-resizable";

const drag = ref(false);
const position = ref({ top: 5, left: 5, right: "auto" });
const relativeCoords = ref({ left: 0, top: 0 });
const toggled = ref(true);
const toolsRect = ref({});
const area = ref(null);

const props = defineProps({ title: String, dense: Boolean });

const handleMouseDown = (event) => {
  const headerRect = event.target.getBoundingClientRect();
  relativeCoords.value = {
    left: event.clientX - headerRect.left,
    top: event.clientY - headerRect.top,
  };
  drag.value = true;
};

const placeLeft = () => {
  drag.value = false;
  position.value = { left: `${margin}px`, top: `${margin}px`, right: "auto" };
};

const placeRight = () => {
  drag.value = false;
  position.value = { left: "auto", top: `${margin}px`, right: `${margin}px` };
};

const hideTools = () => {
  toggled.value = false;
  const areaRect = area.value.getBoundingClientRect();
  if (position.value.left === "auto") return;
  parseInt(position.value.left) > areaRect.width / 2 - toolsRect.value.width / 2
    ? placeRight()
    : placeLeft();
};

const onResizeEnd = () => {
    const resizable = area.value.querySelector('.resizable-component');
    const paletteRect = area.value.querySelector('.palette').getBoundingClientRect();
    resizable.style.height = paletteRect.height + 'px';
}

onMounted(() => {
  document.addEventListener("mousemove", handleMove);
  placeLeft();
  toolsRect.value = area.value.querySelector(".tools").getBoundingClientRect();
});

onUnmounted(() => {
  document.removeEventListener("mousemove", handleMove);
});

const handleMove = (event) => {
  if (!drag.value) return;
  const areaRect = area.value.getBoundingClientRect();
  const posX = Math.max(
    0,
    Math.min(
      areaRect.width - toolsRect.value.width,
      event.clientX - areaRect.left - relativeCoords.value.left
    )
  );
  const posY = Math.max(
    0,
    Math.min(
      areaRect.height - toolsRect.value.height,
      event.clientY - areaRect.top - relativeCoords.value.top
    )
  );
  position.value = { left: `${posX}px`, top: `${posY}px` };
};

const margin = 5;
</script>
<style>
</style>
<style scoped>
.area {
  position: relative;
}
.show-tools {
  width: 32px;
  height: 32px;
  border: thin solid #777;
  border-radius: 50%;
  background-color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
}

.show-tools img {
  width: 28px;
}

.tools {
  position: absolute;
  z-index: 11;
}
.tools .palette {
  width: 100%;
  height: 100%;
  min-width: 274px;
  background-color: rgba(0, 0, 0, 0.7);
  box-shadow: 2px 2px 5px grey;
}

.tools .palette .content :deep(button),
.tools .palette .content :deep(.group) {
  flex-grow: 1;
  flex-shrink: 1;
  margin: 1px;
}

.tools .palette .content :deep(button) {
  padding: 3px 6px;
}
.tools .palette .content :deep(.group button) {
  padding: 3px 6px;
  margin: 0;
}

.tools .content {
  padding: 5px 10px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  background: #333;
  user-select: none;
  align-items: center;
}

.header button {
  padding: 0;
  appearance: none;
  border: 0;
  background: transparent;
  padding: 5px;
  display: flex;
  align-items: center;
}

.header button img {
  max-height: 14px;
}

.title {
  margin-left: 5px;
  margin-right: auto;
}

.content-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>