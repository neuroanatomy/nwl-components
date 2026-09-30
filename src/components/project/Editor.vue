<template>
  <div
    class="area"
    ref="area"
    :class="{ 'area--docked': !overlayTools }"
  >
    <div class="content-wrapper">
      <slot name="content" />
    </div>
    <Teleport
      :disabled="overlayTools || !toolsTarget"
      :to="toolsTarget || 'body'"
    >
      <div
        ref="tools"
        class="tools"
        :class="{
          'tools--overlay': overlayTools,
          'tools--docked': !overlayTools,
          'tools--reduced': reduced
        }"
        :style="overlayTools ? { ...clampedPosition } : null"
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
          :style="overlayTools
            ? {width: toolsWidth, height: toolsHeight, minHeight: toolsMinHeight || 'fit-content'}
            : { height: toolsHeight, minHeight: toolsMinHeight || 'fit-content'}"
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
                v-if="overlayTools"
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
                v-if="overlayTools"
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
    </Teleport>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';

const props = defineProps({
  title: {type: String, default: ''},
  toolsMinHeight: {type: String, default: null},
  // true: the toolbox is a floating palette over the content (default).
  // false: the toolbox is docked in normal flow (e.g. BrainBox-style pages
  // that only want it to float in fullscreen).
  overlayTools: {type: Boolean, default: true},
  // External container to dock the toolbox into when overlayTools is false
  // (e.g. a page's side column): CSS selector or, preferably, a template ref
  // to the target element (reacts to the target being recreated around
  // fullscreen toggles). The toolbox always renders in place when floating.
  // Unset: docked inside the area, below the content (default docked).
  toolsTarget: {type: [String, Object], default: null},
  // Copy of the page-level reduced state (chat and script console both
  // closed) so the reduced rules below travel with a teleported toolbox.
  reduced: {type: Boolean, default: false}
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
  if (!props.overlayTools) { return; }
  const headerRect = tools.value.getBoundingClientRect();
  relativeCoords.value = {
    left: event.clientX - headerRect.left,
    top: event.clientY - headerRect.top
  };
  drag.value = true;
};

const handleTouchStart = (event) => {
  if (!props.overlayTools) { return; }
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
  // Measure the toolbox itself (template ref), not via area.querySelector:
  // the toolbox can be teleported outside the area (toolsTarget), where the
  // querySelector returns null and throws, leaving toolsRect stale — which
  // made the resize start from a wrong reference rect.
  toolsRect.value = tools.value.getBoundingClientRect();
};

const handleResizableMouseDown = (event) => {
  dragResizableHandle.value = true;
  // Measure the toolbox itself (template ref), not via area.querySelector:
  // the toolbox can be teleported outside the area (toolsTarget), where the
  // querySelector returns null and throws, leaving toolsRect stale — which
  // made the resize start from a wrong reference rect.
  toolsRect.value = tools.value.getBoundingClientRect();
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
    // Width (and the derived column count) is CSS-owned in docked mode, where
    // the page clamps the toolbox to the image width; recording it here would
    // carry the full docked column width into the next fullscreen session.
    if (props.overlayTools) {
      toolsWidth.value = parseInt(toolsRect.value.width + offsetRight) + 'px';
      hasTwoCols.value = toolsRect.value.width + offsetRight > 520;
    }
    toolsHeight.value = parseInt(toolsRect.value.height + offsetBottom) + 'px';

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
  if (props.overlayTools) {
    requestAnimationFrame(() => {
      toolsRect.value = tools.value.getBoundingClientRect();
      toolsHeight.value = toolsRect.value.top + toolsRect.value.height;
    });
  }

  const areaObserver = new ResizeObserver(() => {
    requestAnimationFrame(() => {
      areaRect.value = area.value?.getBoundingClientRect();
    });
  });
  areaObserver.observe(area.value);
  // set initial values
  areaRect.value = area.value.getBoundingClientRect();
});

// The toolbox can be docked while the page is not fullscreen and become an
// overlay when it enters fullscreen (the prop is bound to the page's
// fullscreen state). Re-measure the palette when that happens: clampedPosition
// needs a valid rect, and no mouseup ever fires on touch devices to refresh it.
watch(() => props.overlayTools, (isOverlay) => {
  if (!isOverlay) { return; }
  requestAnimationFrame(() => {
    toolsRect.value = tools.value.getBoundingClientRect();
  });
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

/* Floating (overlay) mode: the palette is positioned over the content.
   Docked mode (.area--docked) leaves it in normal flow instead. */
.tools--overlay {
  position: absolute;
  z-index: 11;
}

/* Docked mode: the content shares the area with the toolbox below it, the
   same column layout previous BrainBox used for its in-flow toolbar. */
.area--docked {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}
.area--docked .content-wrapper {
  flex: 1 1 auto;
  min-height: 0;
  height: auto;
}
.tools .palette {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-width: fit-content;
  min-height: fit-content;
  box-shadow: 2px 2px 5px grey;
}
.tools--overlay .palette {
  background-color: rgba(0, 0, 0, 0.7);
}
/* In docked mode the palette header (close button, title, drag) and the
   floating-palette shadow make no sense: the toolbox is in normal flow. */
.tools--docked .palette {
  box-shadow: none;
}
.tools--docked .palette .header {
  display: none;
}
/* No min-height on the docked chat: it is resizable via the handle
   (Chat.vue's own min-height: 60px is the floor). */

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
  padding: 5px 10px 10px;
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

/* .reduced comes from the page as a class on the area; .tools--reduced is
   the same state passed as a prop so it reaches a teleported toolbox. */
.reduced .resizable,
.tools--reduced .resizable {
  min-height: 190px;
  height: auto !important;
}

.resizable--two-cols {
  min-height: 230px;
}

.reduced .resizable--two-cols,
.tools--reduced .resizable--two-cols {
  min-height: 145px;
}

.reduced .resizable-handle,
.tools--reduced .resizable-handle {
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
