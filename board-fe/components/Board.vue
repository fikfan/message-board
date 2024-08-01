<template>
  <div class="message-board">
    <div class="message-list">
      <div v-for="message in messages" :key="message.id" class="message">
        <span class="username">{{ message.user }}:</span>
        <span class="content">{{ message.content }}</span>
        <span class="timestamp">{{ new Date(message.created_at).toLocaleTimeString() }}</span>
      </div>
    </div>
    <div class="message-input">
      <input v-model="newMessage" @keyup.enter="postMessage" placeholder="Type your message...">
      <button @click="postMessage">Send</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['currentUser']);
const messages = ref([]);
const newMessage = ref('');

const fetchMessages = async () => {
  try {
    const res = await fetch('http://localhost:3001/messages');
    const data = await res.json();
    message.value = data;
  } catch(e) {
    console.log('Error:', e)
  }
};

const postMessage = async () => {
  if (newMessage.value.trim()) {
    try {
      const response = await fetch('http://localhost:3001/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage.value,
          user: props.currentUser
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      newMessage.value = '';
      await fetchMessages();
    } catch (e) {
      console.error('Error:', e);
    }
  }
};

onMounted(() => {
  fetchMessages();
});
</script>
