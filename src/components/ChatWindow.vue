<template>
  <div class="chat-window">
    <div class="chat-header">
      <h3>{{ title }}</h3>
      <div class="connection-status" :class="{ connected: isConnected }">
        {{ isConnected ? 'Connected' : 'Disconnected' }}
      </div>
    </div>
    
    <div class="messages-container" ref="messagesContainer">
      <div v-if="messages.length === 0" class="empty-state">
        No messages yet. Be the first to say hello!
      </div>
      <transition-group name="message-slide" tag="div" class="messages">
        <div 
          v-for="message in messages" 
          :key="message.id" 
          class="message"
          :class="{
            'sent': message.sender === username,
            'received': message.sender !== username && message.sender !== 'System',
            'system': message.sender === 'System'
          }"
        >
          <div class="message-header">
            <span class="sender">{{ message.sender }}</span>
            <span class="time">{{ formatTime(message.timestamp) }}</span>
          </div>
          <div class="message-body">
            {{ message.text }}
          </div>
        </div>
      </transition-group>
    </div>
    
    <div class="input-area">
      <input 
        v-model="newMessage" 
        @keyup.enter="sendMessage"
        placeholder="Type a message..."
        :disabled="!isConnected"
      />
      <button @click="sendMessage" :disabled="!isConnected || !newMessage.trim()">Send</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType, nextTick, watch } from 'vue';
import { WebSocketService } from '@/services/WebSocketService';

export default defineComponent({
  name: 'ChatWindow',
  
  props: {
    title: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    webSocketService: {
      type: Object as PropType<WebSocketService>,
      required: true
    }
  },
  
  setup(props) {
    const newMessage = ref('');
    const messagesContainer = ref<HTMLElement | null>(null);
    
    const messages = computed(() => props.webSocketService.messages.value);
    const isConnected = computed(() => props.webSocketService.connected.value);
    
    const formatTime = (timestamp: number): string => {
      return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    
    const scrollToBottom = async () => {
      await nextTick();
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
      }
    };
    
    const sendMessage = () => {
      if (newMessage.value.trim() && isConnected.value) {
        props.webSocketService.sendMessage(props.username, newMessage.value.trim());
        newMessage.value = '';
      }
    };
    
    // Scroll to bottom when new messages arrive
    watch(messages, scrollToBottom, { deep: true });
    
    return {
      newMessage,
      messages,
      isConnected,
      messagesContainer,
      formatTime,
      sendMessage
    };
  }
});
</script>

<style scoped>
.chat-window {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #4a76a8;
  color: white;
}

.chat-header h3 {
  margin: 0;
}

.connection-status {
  font-size: 0.8rem;
  padding: 4px 8px;
  border-radius: 12px;
  background-color: #ff4d4d;
}

.connection-status.connected {
  background-color: #4caf50;
}

.messages-container {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background-color: #f5f7fa;
}

.empty-state {
  text-align: center;
  color: #888;
  margin-top: 40px;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  padding: 10px 12px;
  border-radius: 12px;
  max-width: 70%;
  word-break: break-word;
  animation: fadeIn 0.3s ease;
}

.message.sent {
  align-self: flex-end;
  background-color: #e3f2fd;
  border-bottom-right-radius: 4px;
}

.message.received {
  align-self: flex-start;
  background-color: #ffffff;
  border-bottom-left-radius: 4px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}

.message.system {
  align-self: center;
  background-color: #f0f0f0;
  color: #666;
  font-style: italic;
  max-width: 90%;
  text-align: center;
  padding: 8px 12px;
  border-radius: 16px;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 0.8rem;
  color: #666;
}

.message-body {
  font-size: 1rem;
}

.input-area {
  display: flex;
  padding: 12px;
  background-color: white;
  border-top: 1px solid #eaeaea;
}

input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  margin-right: 8px;
}

button {
  padding: 8px 16px;
  background-color: #4a76a8;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover:not(:disabled) {
  background-color: #3a5a80;
}

button:disabled {
  background-color: #9cb6d3;
  cursor: not-allowed;
}

/* Animation for new messages */
.message-slide-enter-active {
  transition: all 0.3s ease;
}

.message-slide-leave-active {
  transition: all 0.3s ease;
}

.message-slide-enter-from {
  transform: translateY(20px);
  opacity: 0;
}

.message-slide-leave-to {
  opacity: 0;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>