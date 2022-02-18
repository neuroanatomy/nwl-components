<template>
  <aside>
    <div class="image">
      <a :href="`/project/${project.shortname}`">
        <svg id="jdenticon" width="100%" height="100%"></svg>
      </a>
    </div>

    <div class="description">
      <a :href="`/project/${project.shortname}`">
        <h1>{{ projectShortname }}</h1>
      </a>
      <TextInput v-model="project.url" placeholder="Enter a project website" />
      <p>
        by <a :href="`/user/${project.owner}`">{{ project.owner }}</a>
      </p>
      <TextArea
        v-model="project.description"
        placeholder="Enter a project description"
      />

      <p>
        <span id="numCollaborators">{{
          project.collaborators.list.length
        }}</span>
        Collaborators
      </p>
      <p>
        <span id="numAnnotations">{{ project.annotations.list.length }}</span>
        Annotations
      </p>
      <p>
        <span id="numFiles">{{ project.files.list.length }}</span> Data Files
      </p>

      <!-- Save or Cancel -->
      <div>
        <Button @click="$emit('saveChanges')">Save Changes</Button>
        <Button @click="$emit('deleteProject')">Delete Project</Button>
        <Button @click="() => {}">Go to Project</button>
        <p id="saveFeedback"></p>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { onMounted } from "vue";
import { update as updateIcon } from "jdenticon";
import md5 from "md5";
import TextInput from "@/components/common/TextInput.vue";
import TextArea from "@/components/common/TextArea.vue";
import Button from "@/components/common/Button.vue";

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
});

onMounted(() => {
  updateIcon(
    document.getElementById("jdenticon"),
    md5(props.project.shortname)
  );
});
</script>

<style scoped>
a {
  color: white;
}
aside {
  margin-right: 20px;
}

:deep(button) {
    width: 100%;
    margin-bottom: 10px;
}

@media (max-width: 1000px) {
  aside {
    display: flex;
    align-items: flex-start;
  }
  .description {
      flex: 1;
  }

:deep(button) {
    width: auto;
    margin-right: 10px;
}

}
</style>