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
</style>