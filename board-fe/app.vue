<template>
  <div>
    <h1>Anonymous Message Board</h1>
    <form @submit.prevent="postMessage">
      <textarea v-model="newMessage" placeholder="Enter your message"></textarea>
      <button type="submit">Post Message</button>
    </form>
    <ul>
      <li v-for="message in messages" :key="message.id">
        {{ message.content }}
        <small>{{ new Date(message.created_at).toLocaleString() }}</small>
      </li>
    </ul>
  </div>
</template>

<script setup>
const messages = ref([]);
const newMessage = ref('');

const fetchMessages = async () => {
  const { data } = await useFetch('http://localhost:3001/messages');
  messages.value = data.value;
};

const postMessage = async () => {
  if (newMessage.value.trim()) {
    await $fetch('http://localhost:3001/messages', {
      method: 'POST',
      body: { content: newMessage.value },
    });
    newMessage.value = '';
    await fetchMessages();
  }
};

onMounted(() => {
  fetchMessages();
});
</script>