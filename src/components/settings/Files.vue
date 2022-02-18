<script setup>
import PureFiles from '@/components/settings/PureFiles.vue';
import useProject from '@/store/project';

const {
    project,
    addFile,
    updateFile,
    removeFiles,
} = useProject();

</script>
<template>
  <PureFiles
    v-if="project && project.files"
    :files="project.files.list"
    @add-file="addFile"
    @remove-files="removeFiles"
    @update-file="updateFile" />
</template>