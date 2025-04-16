<template>
  <div class="app">
    <slot />
  </div>
</template>

<style>
* {
  box-sizing: border-box;
  font-size: 14px;
  color: white;
}

body {
  margin: 0;
}

.app {
  background: #222;
  color: white;
  font-family: "Lucida Grande", "Lucida Sans Unicode", Helvetica, Arial, Verdana,
    sans-serif;
  font-size: 14px;
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
