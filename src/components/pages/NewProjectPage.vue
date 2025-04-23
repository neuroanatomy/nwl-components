<template>
  <Wrapper>
    <Header>
      <span class="title">{{ siteName }}</span>
    </Header>
    <main>
      <div class="container">
        <div class="inner">
          <h1>Create a new project</h1>
          <p>
            <slot />
          </p>

          <input
            class="input"
            type="text"
            ref="inputEl"
            @input="onKeyDown"
            placeholder="Enter the project short name"
          >
          <div
            class="warning"
            v-show="existingProject"
          >
            The project
            <a :href="`/project/${inputEl?.value}`">
              <strong>{{ inputEl?.value }}</strong>
            </a>
            already exists
          </div>
          <div
            class="warning"
            v-show="!validInput"
          >
            This name is not allowed. Project short names can only contain
            letters and numbers
          </div>
        </div>

        <div class="actions">
          <Button
            :disabled="!validInput || existingProject"
            @click="createProject(inputEl?.value)"
            class="push-button"
          >
            Create Project
          </Button>
          <Button
            class="push-button"
            @click="cancel"
          >
            Cancel
          </Button>
        </div>
      </div>
    </main>
    <Footer />
  </Wrapper>
</template>
<script setup>
import { ref, inject } from 'vue';

import Button from '@/components/common/Button.vue';
import Footer from '@/components/layout/Footer.vue';
import Header from '@/components/layout/Header.vue';
import Wrapper from '@/components/layout/Wrapper.vue';

defineProps({
  onKeyDown: {
    type: Function,
    required: true
  },
  validInput: Boolean,
  existingProject: Boolean
});
const { siteName } = inject('config');
const createProject = (value) => {
  location.pathname = `/project/${value}/settings`;
};
const cancel = () => location.assign('/');
const inputEl = ref(null);
// const value = '';
</script>
<style scoped>
.container {
  display: block;
  width: 600px;
  margin: 0 auto;
  padding: 20px;
  background: #333;
}
.inner {
  max-width: 480px;
  display: block;
  margin: 0 auto;
}

h1 {
  font-size: 16px;
  text-align: center;
}
p {
  font-family: sans-serif;
  text-align: center;
  line-height: 20px;
}
.actions {
  display: block;
  margin: 0 auto;
  width: 200px;
}

.input {
  color: black;
  width: 100%;
  margin-bottom: 10px;
}
.push-button {
  display: block;
  width: 100%;
  margin: 10px;
}
</style>
