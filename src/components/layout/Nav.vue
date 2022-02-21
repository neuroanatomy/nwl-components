<template>
  <nav id="menu">
    <a href="/project/new">
      <img
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
        class="button"
        title="settings"
        alt="settings"
        src="@/assets/settings.svg"
      />
    </a>
    <a :href="searchURL" target="_blank">
      <img
        class="button"
        title="search"
        alt="search"
        src="@/assets/search.svg"
    /></a>
    <a :href="docURL">
      <img
        class="button"
        title="documentation"
        alt="documentation"
        src="@/assets/doc.svg"
      />
    </a>
    <a :href="issuesURL" target="_blank">
      <img
        class="button"
        title="report a bug"
        alt="report a bug"
        src="@/assets/bug.svg"
    /></a>
    <a :href="githubURL" target="_blank">
      <img
        class="button"
        title="join our github project"
        alt="join our github project"
        style="width: 15px; height: 15px"
        src="@/assets/github.svg"
    /></a>
    <div class="login">
      <span v-if="user != null && user.username !== 'anyone'">
        <a :href="`/user/${user.username}`">{{ user.username }}</a> (<a href="/logout"
          >Log Out</a
        >)
      </span>
      <a v-else href='/auth/github'>Log in with GitHub</a>
    </div>
  </nav>
</template>
<script setup>
import { inject } from "vue";
import useProject from "@/store/project";

const { githubURL, issuesURL, searchURL, docURL } = inject("config");
const user = inject("user");

const displaySettings = inject("displaySettings");
const { project } = useProject();
</script>
<style scoped>
nav {
  margin-left: auto;
  margin-right: 10px;
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