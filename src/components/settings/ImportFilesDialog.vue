<template>
  <div class="dialog">
    <div class="contents">
      <div class="scrollable">
        <table>
          <thead>
            <tr>
              <th>URL</th>
              <th>Name</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="file in filesToImport" :key="file.source">
              <td
                contentEditable="true"
                @blur="file.source = $event.currentTarget.textContent"
              >
                {{ file.source }}
              </td>
              <td>{{ file.name }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="actions">
        <Button className="push-button" @click="$emit('import', filesToImport)">
          Import
        </Button>
        <Button className="push-button" @click="$emit('cancel')">
          Cancel
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from "@/components/common/Button.vue";
import { ref } from "vue";

const props = defineProps({
  files: {
    type: Array,
    required: true,
  },
});

const filesToImport = ref(props.files);
</script>

<style scoped>
.dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 100;
}
.contents {
  position: relative;
  padding: 1rem;
  margin: 2rem auto;
  background-color: #333;
  max-width: 600px;
  text-align: center;
  border: 1px solid #777;
  height: calc(100% - 4rem);
  box-sizing: border-box;
}
.scrollable {
  display: inline-block;
  max-width: 600px;
  padding: 2rem;
  overflow: scroll;
  max-height: calc(100% - 10rem);
}
.actions {
  display: block;
  margin: 0 auto;
  max-width: 200px;
}

table {
  table-layout: fixed;
  width: 100%;
}

:deep(.push-button) {
  display: block;
  width: 100%;
  margin: 10px;
}
</style>