<template>
  <TwoCols>
    <template #side>
      <ProjectInfo />
    </template>
    <template #content>
      <div class="content">
        <Collaborators />
        <Annotations />
        <Files />
      </div>
    </template>
  </TwoCols>
</template>
<script setup>
import TwoCols from '@/components/layout/TwoCols.vue';
import Annotations from '@/components/settings/Annotations.vue';
import Collaborators from '@/components/settings/Collaborators.vue';
import Files from '@/components/settings/Files.vue';
import ProjectInfo from '@/components/settings/ProjectInfo.vue';
</script>
<style scoped>
.content {
  background: #333;
  padding: 20px;
}
</style>
