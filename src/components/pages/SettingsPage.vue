<template>
  <Wrapper>
    <Header>
      <span
        ref="titleRef"
        contenteditable="true"
        @input="onTitleInput"
        placeholder="Enter a project name"
        :class="{ title: true, empty: !content || content.trim().length === 0 }"
      />
    </Header>
    <main>
      <Settings v-if="project != null" />
    </main>
    <Footer />
  </Wrapper>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue';

import Footer from '@/components/layout/Footer.vue';
import Header from '@/components/layout/Header.vue';
import Wrapper from '@/components/layout/Wrapper.vue';
import Settings from '@/components/settings/Settings.vue';
import useProject from '@/store/project';

const props = defineProps({
  project: {
    type: Object,
    required: true
  },
  files: {
    type: Object,
    required: false,
    default: null
  }
});

const { setProject, updateProject } = useProject();

setProject(props.project);
if (props.files !== null) {
  // update store on prop change
  watch(props.files, (files) => updateProject({ files: { list: files } }));
}

const content = ref(props.project.name);
const titleRef = ref(null);

onMounted(() => {
  if (titleRef.value) {
    titleRef.value.textContent = content.value || '';
  }
});

const onTitleInput = (event) => {
  content.value = event.currentTarget.textContent;
  updateProject({ name: content.value });
};


</script>
