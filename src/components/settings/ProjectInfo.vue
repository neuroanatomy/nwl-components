<template>
  <aside>
    <div class="image">
      <a :href="`/project/${project.shortname}`">
        <svg id="jdenticon" width="100%" height="100%"></svg>
      </a>
    </div>

    <div class="description">
      <a :href="`/project/${project.shortname}`">
        <h1>{{ project.shortname }}</h1>
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
        <Button @click="$emit('saveProject')">Save Changes</Button>
        <Button @click="$emit('deleteProject')">Delete Project</Button>
        <Button @click="() => {}">Go to Project</Button>
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
h1 {
  font-size: 16px;
  margin: 0 0 20px;
}
a {
  color: white;
}
aside {
  margin-right: 20px;
  max-width: 250px;
}

:deep(button) {
  width: 100%;
  margin-bottom: 10px;
}
.image {
  padding: 20px;
  background: #333;
  margin-bottom: 20px;
}

@media (max-width: 1000px) {
  aside {
    display: flex;
    align-items: flex-start;
    max-width: none;
  }
  .image {
    margin-right: 20px;
  }
  .description {
    flex: 1;
    margin-bottom: 20px;
  }

  :deep(button) {
    width: auto;
    margin-right: 10px;
  }

  .description {
    width: 100%;
  }
}

@media (max-width: 600px) {
  aside {
    flex-flow: column;
    width: 100%;
  }
}
</style>