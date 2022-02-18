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
  projectID: {
    type: String,
    required: true,
  },
});

const { project, loading, fetchProject } = useProject();

fetchProject(props.projectID);

const handleProjectSave = () => {
  alert(JSON.stringify(project.value));
}


</script>
<style scoped>
.settings {
  display: flex;
  margin: 0 auto;
  max-width: 1200px;
}

@media (max-width: 1000px) {
  .settings {
    display: block;
  }
}

.content {
  background: #333;
  padding: 20px;
}
</style>