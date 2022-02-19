<template>
  <template v-if="project != null">
    <div class="settings">
      <ProjectInfo :project="project" @save-project="handleProjectSave" />
      <div class="content">
        <Collaborators />
        <Annotations />
        <Files />
      </div>
    </div>
  </template>
</template>
<script setup>
import ProjectInfo from "@/components/settings/ProjectInfo.vue";
import Collaborators from "@/components/settings/Collaborators.vue";
import Annotations from "@/components/settings/Annotations.vue";
import Files from "@/components/settings/Files.vue";
import useProject from "@/store/project";

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
});

const handleProjectSave = () => {
  alert(JSON.stringify(project.value));
};
</script>
<style scoped>
.settings {
  display: block;
  margin: 0 auto;
  max-width: 700px;
}

.content {
  margin: 0 auto;
  max-width: 420px; 
  background: #333;
  padding: 20px;

}

@media (min-width: 639px) {
  .content {
    max-width: 600px;
  }
}

@media (min-width: 739px) {
  .content {
    max-width: 600px;
    margin: 0;
  }
}

@media (min-width: 1023px) {
  .content {
    max-width: 684px;
  }
  .settings {
    display: flex;
    max-width: 984px;
  }
}
</style>