<template>
  <div class="main">
    <h1>Anonymous Message Board</h1>
    <form @submit.prevent="postMessage">
      <input type="text" v-model="user" placeholder="Name">
      <textarea v-model="newMessage" placeholder="Enter your message"></textarea>
      <button type="submit">Post Message</button>
    </form>
    <ul>
      <li v-for="message in messages" :key="message.id">
        {{ message.content }}
        <small>{{ new Date(message.created_at).toLocaleString() }}</small>
        <small> - </small>
        <small v-if="message.user">{{ message.user }}</small>
        <small v-else>Anonymous</small>
      </li>
    </ul>
  </div>
</template>

<script setup>
const messages = ref([]);
const newMessage = ref('');
const user = ref('');

const fetchMessages = async () => {
  const { data } = await useFetch('http://localhost:3001/messages');
  messages.value = data.value;
  console.log('Received',messages.value);
};

const postMessage = async () => {
  if (newMessage.value.trim()) {
    const postData = {
      content: newMessage.value,
      user: user.value.trim() || null 
    }

    console.log('Sending data', postData);
    try {
      const response = await fetch('http://localhost:3001/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json();
      console.log('Response:', result)
      newMessage.value = '';
      user.value = '';
      await fetchMessages(); //fetch if POST succesful
    } catch (e) {
      console.error('Error:', e)
    }
    
    
  }
};

onMounted(() => {
  fetchMessages();
});
</script>