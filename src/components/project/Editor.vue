<template>
  <div
    class="area"
    ref="area"
  >
    <div class="content-wrapper">
      <slot name="content" />
    </div>
    <div
      ref="tools"
      class="tools"
      :style="{ ...clampedPosition }"
    >
      <button
        v-show="!toggled"
        class="show-tools"
        @click="toggled = true"
      >
        <img
          src="@/assets/bars.svg"
          alt="show tools"
        >
      </button>
      <div
        class="resizable"
        :class="{ 'resizable--two-cols': hasTwoCols }"
        v-show="toggled"
        :style="{width: toolsWidth, height: toolsHeight, minHeight: toolsMinHeight || 'fit-content'}"
      >
        <div
          class="resizable-handle"
          @mousedown="handleResizableMouseDown"
          @touchstart="handleResizableTouchStart"
          @touchend="handleMouseLeaveOrUp"
        />
        <div class="palette">
          <div
            class="header"
            @mousedown="handleMouseDown"
            @touchstart="handleTouchStart"
            @touchend="handleTouchEnd"
          >
            <button
              class="toggle"
              @click="hideTools"
              @touchstart.stop="hideTools"
            >
              <img
                src="@/assets/times-circle.svg"
                alt="hide tools"
              >
            </button>
            <span class="title">{{ title }}</span>
            <button
              class="left"
              @mousedown.stop="placeLeft"
              @touchstart.stop="placeLeft"
            >
              <img
                src="@/assets/caret-square-o-left.svg"
                alt="place tools left"
              >
            </button>
            <button
              class="right"
              @mousedown.stop="placeRight"
              @touchstart.stop="placeRight"
            >
              <img
                src="@/assets/caret-square-o-right.svg"
                alt="place tools right"
              >
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
import { ref, onMounted, onUnmounted, computed } from 'vue';

defineProps({
  title: {type: String, default: ''},
  toolsMinHeight: {type: String, default: null}
});
const drag = ref(false);
const dragResizableHandle = ref(false);
const tools = ref(null);
const position = ref({ top: 0, left: 0 });
const relativeCoords = ref({ left: 0, top: 0 });
const toggled = ref(true);
const toolsWidth = ref('275px');
const toolsHeight = ref('275px');
const toolsRect = ref({});
const area = ref(null);
const areaRect = ref({width: 0, height: 0});
const hasTwoCols = ref(false);
const margin = 5;


const handleMouseDown = (event) => {
  const headerRect = tools.value.getBoundingClientRect();
  relativeCoords.value = {
    left: event.clientX - headerRect.left,
    top: event.clientY - headerRect.top
  };
  drag.value = true;
};

const handleTouchStart = (event) => {
  if (event.touches.length !== 1) { return; }
  handleMouseDown(event.touches[0]);
  event.preventDefault();
};

const handleTouchEnd = () => {
  drag.value = false;
};

const handleMouseLeaveOrUp = () => {
  drag.value = false;
  dragResizableHandle.value = false;
  toolsRect.value = area.value.querySelector('.tools').getBoundingClientRect();
};

const handleResizableMouseDown = (event) => {
  dragResizableHandle.value = true;
  toolsRect.value = area.value.querySelector('.tools').getBoundingClientRect();
  event.preventDefault();
};

const handleResizableTouchStart = (event) => {
  if (event.touches.length !== 1) { return; }
  handleResizableMouseDown(event);
  event.preventDefault();
};

const placeLeft = () => {
  drag.value = false;
  position.value = { left: 0, top: 0 };
};

const placeRight = () => {
  drag.value = false;
  position.value = { left: Infinity, top: 0 };
};

const hideTools = () => {
  toggled.value = false;
  if (parseInt(position.value.left) > areaRect.value.width / 2 - toolsRect.value.width / 2) {
    placeRight();
  } else {
    placeLeft();
  }
};

const clampedPosition = computed(() => {
  const posX = Math.max(
    margin,
    Math.min(
      areaRect.value.width - toolsRect.value.width - margin,
      position.value.left
    )
  );
  const posY = Math.max(
    margin,
    Math.min(
      areaRect.value.height - toolsRect.value.height - margin,
      position.value.top
    )
  );

  return {
    left: `${posX}px`,
    top: `${posY}px`
  };
});

// eslint-disable-next-line max-statements
const handleMove = (event) => {
  if (drag.value) {
    areaRect.value = area.value.getBoundingClientRect();
    const posX = Math.min(
      areaRect.value.width - toolsRect.value.width - margin,
      event.clientX - areaRect.value.left - relativeCoords.value.left
    );
    const posY = Math.min(
      areaRect.value.height - toolsRect.value.height - margin,
      event.clientY - areaRect.value.top - relativeCoords.value.top
    );
    position.value = { left: posX, top: posY };

    return true;
  }

  if (dragResizableHandle.value) {
    const initialRight = toolsRect.value.left + toolsRect.value.width;
    const initialBottom = toolsRect.value.top + toolsRect.value.height;
    const offsetRight = event.clientX - initialRight;
    const offsetBottom = event.clientY - initialBottom;
    toolsWidth.value = parseInt(toolsRect.value.width + offsetRight) + 'px';
    toolsHeight.value = parseInt(toolsRect.value.height + offsetBottom) + 'px';

    hasTwoCols.value = toolsRect.value.width + offsetRight > 520;

    return true;
  }

  return false;
};

const handleTouchMove = (event) => {
  if (event.touches) {
    if (event.touches.length !== 1) { return; }
    if (handleMove(event.touches[0])) {
      event.preventDefault();
    }
  }
};

onMounted(() => {
  document.addEventListener('mousemove', handleMove);
  document.addEventListener('touchmove', handleTouchMove, { passive: false });
  document.addEventListener('mouseup', handleMouseLeaveOrUp);
  placeLeft();
  // Wait for the DOM to be updated before getting the bounding rect
  requestAnimationFrame(() => {
    toolsRect.value = area.value.querySelector('.tools').getBoundingClientRect();
    toolsHeight.value = toolsRect.value.top + toolsRect.value.height;
  });

  const areaObserver = new ResizeObserver(() => {
    requestAnimationFrame(() => {
      areaRect.value = area.value?.getBoundingClientRect();
    });
  });
  areaObserver.observe(area.value);
  // set initial values
  areaRect.value = area.value.getBoundingClientRect();
});

onUnmounted(() => {
  document.removeEventListener('touchmove', handleTouchMove);
  document.removeEventListener('mousemove', handleMove);
  document.removeEventListener('mouseup', handleMouseLeaveOrUp);
});
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
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-width: fit-content;
  min-height: fit-content;
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
  min-height: fit-content;
  flex-grow: 1;
  padding: 5px 10px;
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
