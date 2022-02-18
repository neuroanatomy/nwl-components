<script setup>
import PureAnnotations from '@/components/settings/PureAnnotations.vue';
import useProject from '@/store/project';

const {
    project,
    addAnnotation,
    updateAnnotation,
    removeAnnotations,
} = useProject();

</script>
<template>
  <PureAnnotations
    v-if="project && project.annotations"
    :annotations="project.annotations.list"
    @add-annotation="addAnnotation"
    @remove-annotations="removeAnnotations"
    @update-annotation="updateAnnotation" />
</template>