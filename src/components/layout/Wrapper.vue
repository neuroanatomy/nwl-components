<template>
  <div class="app">
    <slot />
  </div>
</template>

<style>
* {
  box-sizing: border-box;
  font-size: var(--nwl-text-md);
  color: var(--nwl-text);
}

body {
  margin: 0;
}

.app {
  background: var(--nwl-bg);
  color: var(--nwl-text);
  font-family: var(--nwl-font-body);
  font-size: var(--nwl-text-md);
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
