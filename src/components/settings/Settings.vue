<template>
  <TwoCols>
    <template v-slot:side>
      <ProjectInfo />
    </template>
    <template v-slot:content>
      <div class="content">
        <Collaborators />
        <Annotations />
        <Files />
      </div>
    </template>
  </TwoCols>
</template>
<script setup>
import TwoCols from "@/components/layout/TwoCols.vue";
import ProjectInfo from "@/components/settings/ProjectInfo.vue";
import Collaborators from "@/components/settings/Collaborators.vue";
import Annotations from "@/components/settings/Annotations.vue";
import Files from "@/components/settings/Files.vue";
</script>
<style scoped>
.content {
  background: #333;
  padding: 20px;
}
</style>