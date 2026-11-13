<template>
  <footer>
    <p>
      <a
        target="_blank"
        href="http://neuroanatomy.github.io"
      >
        <img
          alt="Neuroanatomy"
          src="@/assets/naat-bw.svg"
        >
      </a>
      <a
        class="text-link"
        target="_blank"
        href="http://neuroanatomy.github.io"
      >
        groupe de neuroanatomie appliquée et théorique
      </a>
    </p>
  </footer>
</template>
<script setup>
</script>
<style scoped>
footer {
  height: 100px;
  background-color: var(--nwl-black);
  padding: 13px 0;
}

p {
  width: 100%;
  font-size: small;
  text-align: center;
}

/* 14px, as with 1.x's `*` rule (the paragraph's small size doesn't reach the links) */
a {
  font-size: var(--nwl-text-md);
  text-decoration: none;
  font-weight: lighter;
  color: var(--nwl-link);
}

/* no underline at rest, so it shows on hover (WCAG 1.4.1: links are the text colour) */
.text-link:hover {
  text-decoration: underline;
}

img {
  width: 28px;
  height: 28px;
  margin-right: 4px;
  display: inline-block;
  vertical-align: middle;
}
</style>
