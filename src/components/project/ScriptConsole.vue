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
    border: thin solid var(--nwl-border);
    border-radius: var(--nwl-radius-sm);
    width: 100%;
    position: relative;
    height: 100%;
    min-height: 60px;
}
/* codeflask injects its own CSS, unlayered, which wins over the library's layers: these
   overrides need !important (an important declaration in a layer beats unlayered CSS) */
#logScript .codeflask__flatten {
    white-space: pre-wrap !important;
    word-wrap: break-word !important;
    caret-color: var(--nwl-white) !important;
    font-size: inherit !important;
}
#logScript .codeflask {
    background: var(--nwl-black) !important;
}
#logScript .codeflask__pre,
#logScript .codeflask__code {
    color: var(--nwl-text) !important;
}
</style>
