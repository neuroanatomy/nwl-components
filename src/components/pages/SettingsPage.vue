<template>
  <Wrapper>
    <Header>
      <span
        contenteditable="true"
        @input="onTitleInput"
        placeholder="Enter a project name"
        :class="{ title: true, empty: !content || content.trim().length === 0 }"
        >{{ content }}</span
      >
    </Header>
    <main>
      <Settings v-if="project != null" />
    </main>
    <Footer />
  </Wrapper>
</template>
<script setup>
import Wrapper from "@/components/layout/Wrapper.vue";
import Header from "@/components/layout/Header.vue";
import Footer from "@/components/layout/Footer.vue";
import Settings from "@/components/settings/Settings.vue";

import useProject from "@/store/project";
import { ref } from "vue";
const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
});

const { project, setProject, updateProject } = useProject();
setProject(props.project);

const content = ref(project.name);

const onTitleInput = (event) => {
  content.value = event.currentTarget.textContent;
  updateProject({ name: content.value });
};


</script>