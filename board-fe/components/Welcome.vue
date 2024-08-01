<template>
  <div class="welcome-terminal">
    <div class="terminal-output">
      <p>Welcome to the Anonymous Message Board</p>
      <p>Please enter a nickname to continue:</p>
    </div>
    <div class="terminal-input">
      <span class="prompt">></span>
      <input
        v-model="inputNickname"
        @keyup.enter="registerUser"
        type="text"
        autofocus
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const inputNickname = ref('');
const emit = defineEmits(['userRegistered']);

const registerUser = () => {
  if (inputNickname.value.trim()) {
    emit('userRegistered', inputNickname.value.trim());
  }
};
</script>
