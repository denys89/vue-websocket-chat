<template>
  <div class="chat-app">
    <div class="setup-panel" v-if="!setupComplete">
      <h2>Join Chat</h2>
      <div class="form-group">
        <label for="username">Your Username:</label>
        <input 
          id="username" 
          v-model="username" 
          placeholder="Enter your username"
          @keyup.enter="startChat"
        />
      </div>
      <button @click="startChat" :disabled="!username.trim()">Join Chat</button>
    </div>
    
    <div v-else class="chat-container">
      <ChatWindow 
        :title="`Chat as ${username}`"
        :username="username"
        :webSocketService="webSocketService"
        class="chat-window-component"
      />
      
      <div class="chat-info">
        <p>
          Open this app in another browser window to chat between windows.
        </p>
        <button @click="openNewWindow" class="secondary-button">
          Open New Chat Window
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onUnmounted } from 'vue';
import ChatWindow from '@/components/ChatWindow.vue';
import { getWebSocketService } from '@/services/WebSocketService';

export default defineComponent({
  name: 'App',
  
  components: {
    ChatWindow
  },
  
  setup() {
    const username = ref('');
    const setupComplete = ref(false);
    const webSocketService = getWebSocketService();
    
    const startChat = () => {
      if (username.value.trim()) {
        // Save the username to localStorage so it persists across page refreshes
        localStorage.setItem('chat-username', username.value);
        webSocketService.setUsername(username.value);
        webSocketService.connect();
        setupComplete.value = true;
      }
    };
    
    const openNewWindow = () => {
      // Open the app in a new window
      window.open(window.location.href, '_blank');
    };
    
    // Check if user had a username from before
    const savedUsername = localStorage.getItem('chat-username');
    if (savedUsername) {
      username.value = savedUsername;
    }
    
    onUnmounted(() => {
      webSocketService.disconnect();
    });
    
    return {
      username,
      setupComplete,
      startChat,
      webSocketService,
      openNewWindow
    };
  }
});
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

html, body {
  height: 100%;
}

body {
  background-color: #f0f2f5;
}

#app {
  height: 100%;
  padding: 20px;
}

.chat-app {
  max-width: 800px;
  height: 100%;
  margin: 0 auto;
}

.setup-panel {
  max-width: 500px;
  margin: 100px auto 0;
  padding: 24px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.setup-panel h2 {
  margin-bottom: 20px;
  text-align: center;
  color: #4a76a8;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.setup-panel button {
  width: 100%;
  padding: 12px;
  background-color: #4a76a8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
}

.setup-panel button:hover:not(:disabled) {
  background-color: #3a5a80;
}

.setup-panel button:disabled {
  background-color: #9cb6d3;
  cursor: not-allowed;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-window-component {
  flex: 1;
}

.chat-info {
  margin-top: 16px;
  padding: 16px;
  background-color: white;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.chat-info p {
  margin-bottom: 12px;
  color: #666;
}

.secondary-button {
  padding: 8px 16px;
  background-color: #f0f2f5;
  color: #4a76a8;
  border: 1px solid #4a76a8;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.secondary-button:hover {
  background-color: #e3f2fd;
}

/* Responsive design for mobile */
@media (max-width: 768px) {
  .chat-app {
    padding: 10px;
  }
}
</style>