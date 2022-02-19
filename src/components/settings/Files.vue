<script setup>
import PureFiles from "@/components/settings/PureFiles.vue";
import useProject from "@/store/project";
import ImportFilesDialog from "./ImportFilesDialog.vue";
import { ref } from "vue";
const { project, addFile, updateFile, removeFiles } = useProject();

const displayImportDialog = ref(false);
const importedFiles = ref([]);

const handleCSVImport = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.setAttribute("id", "importFilesInput");
  input.style.display = "none";
  document.querySelector("body").appendChild(input);
  input.onchange = function () {
    const [file] = this.files;
    const reader = new FileReader();
    reader.onload = function (e) {
      document.querySelector("body").removeChild(input);
      const { result } = e.target;
      const lines = result.split("\n");
      importedFiles.value = lines.map((line) => {
        const [source, name] = line.split(/[ ]*,[ ]*/);
        return { source, name };
      });
      displayImportDialog.value = true;
    };
    reader.readAsText(file);
  };
  input.click();
};

const handleCSVDownload = () => {
  const filename = prompt("File name", `${project.value.shortname}`);
  if (filename == null) {
    return;
  }
  const csv = project.value.files.list
    .map((o) => `${o.source},${o.name}`)
    .join("\n");
  const csvData = "data:text/ascii;charset=utf-8," + encodeURIComponent(csv);
  const a = document.createElement("a");
  a.href = csvData;
  a.download = filename + ".csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

function appendFiles(files) {
  files.forEach((file) => {
    if (file.source.length < 10) {
      console.log("Too short to be an url:", file.source);
      return;
    }
    const found = project.value.files.list.find(
      (f) => f.source === file.source
    );
    if (found != null) {
      if (found.name === "") {
        found.name = file.name;
      }
    } else {
      project.value.files.list.push(file);
    }
  });
  displayImportDialog.value = false;
}
</script>
<template>
  <ImportFilesDialog
    :files="importedFiles"
    @import="appendFiles"
    @cancel="displayImportDialog = false"
    v-if="displayImportDialog"
  />
  <PureFiles
    v-if="project && project.files"
    :files="project.files.list"
    @add-file="addFile"
    @remove-files="removeFiles"
    @update-file="updateFile"
    @import-csv="handleCSVImport"
    @download-csv="handleCSVDownload"
  />
</template>