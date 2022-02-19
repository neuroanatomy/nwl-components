<template>
  <nav id="menu">
    <a href="/project/new">
      <img
        id="addProject"
        class="button"
        title="add project"
        alt="add project"
        src="@/assets/plus.svg"
      />
    </a>
    <a
      :href="`/project/${project.shortname}/settings`"
      v-if="displaySettings && project != null"
    >
      <img
        id="settings"
        class="button"
        title="settings"
        alt="settings"
        src="@/assets/settings.svg"
      />
    </a>
    <a :href="searchURL" target="_blank">
      <img
        id="search"
        class="button"
        title="search"
        alt="search"
        src="@/assets/search.svg"
    /></a>
    <a :href="docURL">
      <img
        id="doc"
        class="button"
        title="documentation"
        alt="documentation"
        src="@/assets/doc.svg"
      />
    </a>
    <a :href="issuesURL" target="_blank">
      <img
        id="bug"
        class="button"
        title="report a bug"
        alt="report a bug"
        src="@/assets/bug.svg"
    /></a>
    <a :href="githubURL" target="_blank">
      <img
        id="github"
        class="button"
        title="join our github project"
        alt="join our github project"
        style="width: 15px; height: 15px"
        src="@/assets/github.svg"
    /></a>
    <div class="login" v-if="user != null">
      <span>
        <a :href="user.brainboxURL">{{ user.nickname }}</a> (<a href="/logout"
          >Log Out</a
        >)
      </span>
    </div>
  </nav>
</template>
<script setup>
import { inject } from "vue";
import useProject from "@/store/project";

const baseURL = inject("baseURL");
const logoURL = inject("logoURL");
const githubURL = inject("githubURL");
const issuesURL = inject("issuesURL");
const searchURL = inject("searchURL");
const docURL = inject("docURL");
const user = inject("user");
const displaySettings = inject("displaySettings");
const { project } = useProject();

</script>
<style scoped>
nav {
  margin-left: auto;
}
.button {
  width: 0.9rem;
  height: 0.9rem;
  margin: 8px 2px 8px 15px;
  vertical-align: middle;
  cursor: pointer;
}

.login {
  display: inline-block;
  margin-left: 15px;
}

a {
  color: white;
}
</style>