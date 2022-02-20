<template>
  <Wrapper>
    <Header>
      <span class="title">{{ user.nickname }}</span>
    </Header>
    <main>
      <TwoCols>
        <template v-slot:side>
          <div id="userImage">
            <img alt="user avatar" :src="user.avatarURL" style="width: 100%" />
          </div>

          <div id="userDescription">
            <h1>{{ user.name }}</h1>
            <h2>{{ user.nickname }}</h2>
            <p>Joined {{ new Date(user.joined).toDateString() }}</p>
            <slot name="side" />
          </div>
        </template>

        <template v-slot:content>
            <slot name="content" />
        </template>
      </TwoCols>
    </main>
    <Footer />
  </Wrapper>
</template>
<script setup>
import Wrapper from "@/components/layout/Wrapper.vue";
import Header from "@/components/layout/Header.vue";
import Footer from "@/components/layout/Footer.vue";
import TwoCols from "@/components/layout/TwoCols.vue";
import Settings from "@/components/settings/Settings.vue";

import { ref } from "vue";
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});
</script>
<style scoped>
.title {
  color: white;
  display: inline-block;
  width: auto;
  text-align: left;
  font-family: Roboto, sans-serif;
  font-size: 36px;
  font-weight: 100;
  vertical-align: middle;
  background: none;
  margin-top: 14px;
  border: none;
}
</style>
