<template>
  <Wrapper>
    <Header>
      <span class="title">{{ user[usernameField] }}</span>
    </Header>
    <main>
      <TwoCols>
        <template #side>
          <div id="userImage">
            <img
              alt="user avatar"
              :src="user.avatarURL"
              style="width: 100%"
            >
          </div>

          <div id="userDescription">
            <h1>{{ user.name }}</h1>
            <h2>{{ user[usernameField] }}</h2>
            <p>Joined {{ new Date(user.joined).toDateString() }}</p>
            <slot name="side" />
          </div>
        </template>

        <template #content>
          <slot name="content" />
        </template>
      </TwoCols>
    </main>
    <Footer />
  </Wrapper>
</template>
<script setup>
import { ref, inject } from 'vue';

import Footer from '@/components/layout/Footer.vue';
import Header from '@/components/layout/Header.vue';
import TwoCols from '@/components/layout/TwoCols.vue';
import Wrapper from '@/components/layout/Wrapper.vue';
import Settings from '@/components/settings/Settings.vue';


const { usernameField } = inject('config');
const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});
</script>
