<script setup>
import Collaborators from './Collaborators.vue';
import Annotations from './Annotations.vue';
import Files from './Files.vue';
import useProject from '@/store/project';

const props = defineProps({
  projectID: {
    type: String,
    required: true,
  }
})

const {
    project,
    fetchProject,
} = useProject();

fetchProject(props.projectID);

</script>
<template>
  <Collaborators />
  <Annotations />
  <Files />
</template>