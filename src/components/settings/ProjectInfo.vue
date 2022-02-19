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

      <div class="actions">
        <Button className="push-button" @click="handleProjectSave"
          >Save Changes</Button
        >
        <Button className="push-button" @click="handleProjectDeletion"
          >Delete Project</Button
        >
        <Button className="push-button" @click="goToProject"
          >Go to Project</Button
        >
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
import useProject from "@/store/project.js";

const { project } = useProject();

const handleProjectSave = () => {
  alert(JSON.stringify(project.value));
};

const handleProjectDeletion = () => {
  const res = confirm(
    "Are you sure you want to delete project " +
      project.shortname +
      "? " +
      "This operation cannot be undone."
  );
  if (res !== true) {
    return;
  }
  // TODO
};

const goToProject = () => {
  window.location.assign(`/project/${project.value.shortname}`);
};

onMounted(() => {
  updateIcon(
    document.getElementById("jdenticon"),
    md5(project.value.shortname)
  );
});
</script>

<style scoped>
h1 {
  font-size: 1rem;
  margin: 0 0 20px;
}
a {
  color: white;
}
aside {
  text-align: center;
  display: flex;
  flex-direction: column;
}

:deep(input),
:deep(textarea) {
  text-align: center;
  font-family: inherit;
  font-size: 14px;
  color: white;
  padding: 3px 0 0;
}
:deep(::placeholder) {
  color: rgba(255, 255, 255, 0.4);
}
p {
  margin: 0 0 5px;
}

:deep(button) {
  width: 100%;
  margin-bottom: 10px;
}
.image {
  width: 200px;
  height: 200px;
  background: #333;
  margin: 0 auto 20px;
}

.actions {
  margin-top: 15px;
}

.description {
  margin: 0 auto;
}

@media (min-width: 738px) {
  .description {
    width: calc(100% - 500px);
  }

  aside {
    flex-direction: row;
  }

  .image {
    margin: 0 0 20px;
  }
}

@media (min-width: 1023px) {
  aside {
    margin-right: 20px;
    max-width: 200px;
    flex-direction: column;
  }

  .description {
    flex: 1;
    width: 100%;
  }
}
</style>