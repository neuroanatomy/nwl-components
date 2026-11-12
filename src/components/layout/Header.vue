<template>
  <header>
    <a
      class="logo"
      href="/"
    >
      <img
        :src="logoURL"
        :alt="siteName"
      >
    </a>
    <slot />
    <Nav />
  </header>
</template>
<script setup>
import { inject } from 'vue';

import Nav from '@/components/layout/Nav.vue';

const { logoURL, siteName } = inject('config');

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
  color: var(--nwl-text);
  display: inline-block;
  width: auto;
  text-align: left;
  font-family: var(--nwl-font-display);
  font-size: var(--nwl-text-3xl);
  font-weight: var(--nwl-weight-thin);
  vertical-align: middle;
  background: none;
  margin-top: 14px;
  border: none;
}
:deep(.title.empty:before) {
  content: attr(placeholder);
  color: var(--nwl-text-3);
}
</style>
