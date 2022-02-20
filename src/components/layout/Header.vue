<template>
  <header>
    <a class="logo" href="/">
      <img :src="logoURL" :alt="siteName" />
    </a>
    <slot />
    <Nav />
  </header>
</template>
<script setup>
import { inject } from "vue";
import Nav from "@/components/layout/Nav.vue";

const { logoURL, siteName } = inject("config");

</script>
<style scoped>
header {
  display: flex;
  flex-flow: row wrap;
  align-items: flex-start;
  min-height: 64px;
  padding: 3px;
}
.logo {
  display: inline-block;
  margin: 10px;
  text-decoration: none;
}
.logo img {
  height: 56px;
  vertical-align: middle;
}

:deep(.title) {
  color: white;
  display: inline-block;
  width: auto;
  text-align: left;
  font-family: Roboto, sans-serif;
  font-size: 36px;
  font-weight: 100;
  vertical-align: middle;
  background: none;
  margin-top: 14px;
  border: none;
}
:deep(.title.empty:before) {
  content: attr(placeholder);
  color: rgba(255, 255, 255, 0.4);
}
</style>