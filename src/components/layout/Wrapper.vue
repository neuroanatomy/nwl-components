<template>
  <div class="app">
    <slot />
  </div>
</template>

<style>
/* font, colour, box-sizing and body margin: src/styles/base.css (no `*` rule since 2.0.0) */
.app {
  background: var(--nwl-bg);
  display: block;
  min-height: 100vh;
}

.app > main {
  padding: 20px;
}

.app > footer {
  margin-top: auto;
}

</style>
