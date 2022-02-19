<template>
  <footer>
    <p>
      <a target="_blank" href="http://neuroanatomy.github.io">
        <img alt="Neuroanatomy" src="@/assets/naat-bw.svg" />
      </a>
      <a target="_blank" href="http://neuroanatomy.github.io">
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
  background-color: #000;
  padding: 13px 0;
}

p {
  width: 100%;
  font-size: small;
  text-align: center;
}

a {
  text-decoration: none;
  font-weight: lighter;
  color: white;
}

img {
  width: 28px;
  height: 28px;
  margin-right: 4px;
  display: inline-block;
  vertical-align: middle;
}
</style>