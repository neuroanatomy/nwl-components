<script setup>
import PureAnnotations from '@/components/settings/PureAnnotations.vue';
import useProject from '@/store/project';

const {
    project,
    addAnnotation,
    updateAnnotation,
    removeAnnotations,
} = useProject();

if (project.value && project.value.annotations && project.value.annotations.list) {
  if(project.value.annotations.list.length === 0) {
    console.log('foo');
    addAnnotation();
  }
}

</script>
<template>
  <PureAnnotations
    v-if="project && project.annotations"
    :annotations="project.annotations.list"
    @add-annotation="addAnnotation"
    @remove-annotations="removeAnnotations"
    @update-annotation="updateAnnotation" />
</template>