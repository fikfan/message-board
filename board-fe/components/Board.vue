<template>
  <div class="message-board">
    <div class="message-list">
      <div v-for="message in messages" :key="message.id" class="message" :class="{ 'system-message' : message.user === 'System' }">
        <span class="timestamp">{{ new Date(message.created_at).toLocaleTimeString() }}</span>
        <span class="username">{{ message.user }}</span>
        <span class="divider">|</span>
        <span class="content">{{ message.content }}</span>
      </div>
    </div>
    <div class="message-input">
      <span class="prompt">></span>
      <input v-model="newMessage" @keyup.enter="postMessage" placeholder="Type your message or /command...">
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['currentUser']);
const emit = defineEmits(['updateNickname'])
const messages = ref([]);
const newMessage = ref('');

const handleCommand = (input) => {
  const [command, ...args] = input.split(' ')
  switch (command.toLowerCase()) {
    case '/nick':
      if(args.length > 0) {
        const newNick = args.join(' ')
        emit('updateNickname', newNick)
        return `Nickname changed to ${newNick}`
      }
      return 'Usage: /nick <new nickname> without the "<" and ">" '
    case '/clear':
      messages.value = [];
      return 'Message board cleared'
    case '/help':
      return `
        Welcome to The Board.
        Your secrets are safe here.
        Remain anonymous, be kind.

        Commands:
        /nick <newName> to change your name
        /clear to clear messages
        /creator credits
      `
    default:
      return null
  }
}

const fetchMessages = async () => {
  try {
    const res = await fetch('http://localhost:3001/messages');
    const data = await res.json();
    messages.value = data;
  } catch(e) {
    console.log('Error:', e)
  }
};

const postMessage = async () => {
  if (newMessage.value.trim()) {
    if(newMessage.value.startsWith('/')) {
      const result = handleCommand(newMessage.value);

      if (result) {
        messages.value.unshift({
          id: Date.now(),
          content: result,
          user: 'System',
          created_at: new Date().toISOString(),
        })
        newMessage.value = '';
        return
      }

    }

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
