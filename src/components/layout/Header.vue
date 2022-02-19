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
import { inject } from 'vue';
import Nav from '@/components/layout/Nav.vue';

const logoURL = inject('logoURL');
const siteName = inject('siteName');

</script>
<style scoped>
header {
  display: flex;
  align-items: flex-start;
  height: 64px;
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