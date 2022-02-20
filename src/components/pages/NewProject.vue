<template>
  <Wrapper>
    <Header>
      <span class="title">BrainBox</span>
    </Header>
    <main>
      <div class="container">
        <div style="max-width: 480px; display: block; margin: 0 auto">
          <h1>Create a new project</h1>
          <p>
              <slot />
          </p>

          <input
            class="input"
            type="text"
            placeholder="Enter the project short name"
          />
          <div id="warning" v-show="existingProject != null"></div>
        </div>

        <div class="actions">
          <Button class="push-button">Create Project</Button>
          <Button class="push-button">Cancel</Button>
        </div>
      </div>
    </main>
    <Footer />
  </Wrapper>
</template>
<script setup>
import Wrapper from "@/components/layout/Wrapper.vue";
import Header from "@/components/layout/Header.vue";
import Footer from "@/components/layout/Footer.vue";
import Button from "@/components/common/Button.vue";
</script>
<style scoped>
.container {
  display: block;
  width: 600px;
  margin: 0 auto;
  padding: 20px;
  background: #333;
}

h1 {
  font-size: 16px;
  text-align: center;
}
p {
  font-family: sans-serif;
  text-align: center;
  line-height: 20px;
}
.actions {
  display: block;
  margin: 0 auto;
  width: 200px;
}

.input {
  color: black;
  width: 100%;
  margin-bottom: 10px;
}
.push-button {
  display: block;
  width: 100%;
  margin: 10px;
}
</style>
