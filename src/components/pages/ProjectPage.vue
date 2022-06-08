<template>
  <Wrapper>
    <Header v-if="!fullscreen">
      <span class="title">Project name</span>
    </Header>
    <main>
      <div :class="['editor', { fullscreen }]">
        <splitpanes
          :horizontal="!vertical"
          :class="{ vertical, horizontal: !vertical }"
          @resize="emit('resize', $event)"
        >
          <pane class="left" :size="leftSize"  v-if="!fullscreen">
            <div class="left-header">
              <button
                @click="
                  vertical = !vertical;
                  leftSize = 40;
                  rightSize = 60;
                  emit('layoutChange', vertical);
                "
              >
                <img src="@/assets/caret-square-o-right.svg" alt="" />
              </button>
            </div>
            <div class="leftContent">
              <slot name="left" />
            </div>
          </pane>
          <pane class="right" size="rightSize">
            <slot name="right" />
          </pane>
        </splitpanes>
      </div>
    </main>
  </Wrapper>
</template>
<script setup>
import { ref } from "vue";
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";
import Wrapper from "@/components/layout/Wrapper.vue";
import Header from "@/components/layout/Header.vue";
import Footer from "@/components/layout/Footer.vue";
import TwoCols from "@/components/layout/TwoCols.vue";
import Settings from "@/components/settings/Settings.vue";
import useProject from "@/store/project";

const vertical = ref(true);
const leftSize = ref(40);
const rightSize = ref(60);

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
  fullscreen: Boolean
});

const { setProject } = useProject();
setProject(props.project);

const emit = defineEmits(["resize", "layoutChange"]);
</script>
<style scoped>
main {
  padding: 0;
}
.editor {
  display: flex;
  width: 100vw;
  max-width: 100%;
  overflow: hidden;
  border: 1px solid #444;
}

.editor:not(.fullscreen) {
  max-height: calc(100vh - 82px);
}

.left-header {
  padding: 5px 0;
  display: flex;
  border-bottom: 1px solid #333;
  margin-bottom: 10px;
}

.left-header button {
  padding: 0;
  appearance: none;
  border: 0;
  background: transparent;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.left-header button img {
  max-height: 14px;
}

.vertical .left-header button {
  transform: rotate(90deg);
}
.horizontal {
  height: calc(100vh - 82px);
}
.fullscreen .horizontal {
  height: 100vh;
}

.horizontal :deep(.area) {
  height: 100%;
}

.horizontal .left {
  overflow-y: auto;
}

.vertical :deep(.area) {
  height: calc(100vh - 82px);
}

.fullscreen .vertical :deep(.area) {
  height: 100vh;
}

.vertical .left {
  width: 40%;
  padding: 0 5px;
  overflow-y: auto;
  height: calc(100vh - 82px);
}

.vertical .right {
  width: 60%;
  overflow: visible;
}

.horizontal .left,
.horizontal .right {
  width: 100%;
}
</style>
<style>
.splitpanes__splitter {
  background-color: #444;
  box-sizing: border-box;
  position: relative;
  flex-shrink: 0;
}
.splitpanes--vertical > .splitpanes__splitter {
  width: 7px;
  margin-left: -1px;
}

.splitpanes--horizontal > .splitpanes__splitter {
  height: 7px;
  margin-top: -1px;
}

.splitpanes__splitter:before,
.splitpanes__splitter:after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  background-color: #ffffff40;
  transition: background-color 0.3s;
}

.splitpanes--vertical > .splitpanes__splitter:before,
.splitpanes--vertical > .splitpanes__splitter:after {
  transform: translateY(-50%);
  width: 1px;
  height: 30px;
}
.splitpanes--vertical > .splitpanes__splitter:before {
  margin-left: -2px;
}
.splitpanes--vertical > .splitpanes__splitter:after {
  margin-left: 1px;
}

.splitpanes--horizontal > .splitpanes__splitter:before,
.splitpanes--horizontal > .splitpanes__splitter:after {
  transform: translateX(-50%);
  height: 1px;
  width: 30px;
}
.splitpanes--horizontal > .splitpanes__splitter:before {
  margin-top: -2px;
}
.splitpanes--horizontal > .splitpanes__splitter:after {
  margin-top: 1px;
}
</style>