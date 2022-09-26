<template>
  <div
    class="area"
    @mouseup="handleMouseLeaveOrUp"
    @mouseleave="handleMouseLeaveOrUp"
    ref="area"
  >
    <div class="content-wrapper">
      <slot name="content" />
    </div>
    <div ref="tools" class="tools" :style="{ ...position }">
      <button v-show="!toggled" class="show-tools" @click="toggled = true">
        <img src="@/assets/bars.svg" alt="show tools" />
      </button>
      <div class="resizable"
        :class="{ 'resizable--two-cols': hasTwoCols }"
        v-show="toggled"
        :style="{width: toolsWidth, height: toolsHeight, minHeight: toolsMinHeight}"
      >
        <div
          class="resizable-handle"
          @mousedown="handleResizableMouseDown"
        />
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
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps({ title: String, height: Number, toolsMinHeight: String });

const drag = ref(false);
const dragResizableHandle = ref(false);
const position = ref({ top: 5, left: 5, right: "auto" });
const relativeCoords = ref({ left: 0, top: 0 });
const toggled = ref(true);
const toolsWidth = ref("275px");
const toolsHeight = ref(props.toolsMinHeight);
const toolsRect = ref({});
const area = ref(null);
const hasTwoCols = ref(false);


const handleMouseDown = (event) => {
  const headerRect = event.target.getBoundingClientRect();
  relativeCoords.value = {
    left: event.clientX - headerRect.left,
    top: event.clientY - headerRect.top,
  };
  drag.value = true;
};

const handleMouseLeaveOrUp = () => {
  drag.value = false;
  dragResizableHandle.value = false;
  toolsRect.value = area.value.querySelector(".tools").getBoundingClientRect();
}

const handleResizableMouseDown = (event) => {
  dragResizableHandle.value = true;
  toolsRect.value = area.value.querySelector(".tools").getBoundingClientRect();
  event.preventDefault()
}

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

onMounted(() => {
  document.addEventListener("mousemove", handleMove);
  placeLeft();
  toolsRect.value = area.value.querySelector(".tools").getBoundingClientRect();
});

onUnmounted(() => {
  document.removeEventListener("mousemove", handleMove);
});

const handleMove = (event) => {
  if (drag.value) {
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
  }

  if (dragResizableHandle.value) {
    const initialRight = toolsRect.value.left + toolsRect.value.width;
    const initialBottom = toolsRect.value.top + toolsRect.value.height;
    const offsetRight = event.clientX - initialRight;
    const offsetBottom = event.clientY - initialBottom;
    toolsWidth.value = parseInt(toolsRect.value.width + offsetRight) + "px";
    toolsHeight.value = parseInt(toolsRect.value.height + offsetBottom) + "px";

    hasTwoCols.value = toolsRect.value.width + offsetRight > 520;
  }
};

const margin = 5;
</script>
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
  padding: 1px 6px;
}
.tools .palette .content :deep(.group button) {
  padding: 1px 6px;
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

.resizable {
    position: relative;
    min-width: 275px;
}

.reduced .resizable {
  min-height: 190px;
  height: auto !important;
}

.resizable--two-cols {
  min-height: 230px;
}

.reduced .resizable--two-cols {
  min-height: 145px;
}

.reduced .resizable-handle {
  display: none;
}

.resizable-handle {
    display: block;
    right: 0;
    bottom: 0;
    position: absolute;
    z-index: 100;
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACC2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjE8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOlBob3RvbWV0cmljSW50ZXJwcmV0YXRpb24+MjwvdGlmZjpQaG90b21ldHJpY0ludGVycHJldGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KD0UqkwAAACJJREFUCB1jYMABPn/+/B+rFA0l4EbDGVAXwPlwBroEkA8ARSMmcY29DXYAAAAASUVORK5CYII=");
    background-position: bottom right;
    background-repeat: no-repeat;
    opacity: 0.6;
    width: 15px;
    height: 15px;
    cursor: nwse-resize;
}
</style>