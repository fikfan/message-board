<template>
  <div class="app">
    <Welcome v-if="!currentUser" @userRegistered="handleUserRegistration" />
    <Board v-else :currentUser="currentUser" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Welcome from './components/Welcome.vue';
import Board from './components/Board.vue';

const currentUser = ref(null);

const handleUserRegistration = (nickname) => {
  currentUser.value = nickname;
  //send to b/e or local
}

</script>

<style>
body {
  margin: 0;
  padding: 0;
}

.app {
  height: 100vh;
}

</style>