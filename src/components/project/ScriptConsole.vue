<template>
  <div id="logScript" />
</template>
<script setup>
import { onMounted } from 'vue';
const loadScript = (path) => new Promise((resolve, reject) => {
  if (document.querySelector(`script[src="${path}"]`) !== null) {
    resolve();

    return;
  }
  const s = document.createElement('script');
  s.src = path;
  s.onload = resolve;
  s.onerror = reject;
  document.body.appendChild(s);
});

onMounted(async () => {
  await Promise.all([
    loadScript('https://unpkg.com/codeflask/build/codeflask.min.js'),
    loadScript('https://cdn.jsdelivr.net/gh/r03ert0/consolita.js@v0.1.1/consolita.js')
  ]);
  window.Consolita.init('#logScript');
});
</script>
<style>
#logScript {
    border: thin solid #777;
    border-radius: 3px;
    width: 100%;
    position: relative;
    height: 100%;
    min-height: 60px;
}
#logScript .codeflask__flatten {
    white-space: pre-wrap;
    word-wrap: break-word;
    caret-color: white;
    font-size: inherit;
}
#logScript .codeflask {
    background: rgba(0,0,0,1);
}
</style>
