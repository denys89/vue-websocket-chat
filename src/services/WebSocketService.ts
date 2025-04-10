import { ref } from 'vue';
import { Message, MessageType } from '@/types/Message';

export class WebSocketService {
  private socket: WebSocket | null = null;
  private readonly url: string;
  public messages = ref<Message[]>([]);
  public connected = ref<boolean>(false);
  public username = ref<string>('');
  
  // Use secure WebSocket on production, and fall back to echo server when deployed
  constructor(url = window.location.hostname === 'localhost' 
    ? 'ws://localhost:8080' 
    : 'wss://echo.websocket.org') {
    this.url = url;
  }
  
  setUsername(username: string) {
    this.username.value = username;
  }
  
  connect(): void {
    if (this.socket?.readyState === WebSocket.OPEN) return;
    
    this.socket = new WebSocket(this.url);
    
    this.socket.onopen = () => {
      console.log('WebSocket connection established');
      this.connected.value = true;
      
      // Send a first message to announce this user's presence
      if (this.username.value) {
        this.sendMessage(this.username.value, 'has joined the chat');
      }
    };
    
    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as Message;
        this.messages.value.push(message);
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    };
    
    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
      this.connected.value = false;
      // Try to reconnect after a delay
      setTimeout(() => this.connect(), 5000);
    };
    
    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }
  
  sendMessage(sender: string, text: string, type = 'chat'): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not connected');
      return;
    }
    
    const message: Message = {
      id: Date.now().toString(),
      sender,
      text,
      timestamp: Date.now(),
      type: type as MessageType
    };
    
    this.socket.send(JSON.stringify(message));
    
    // Don't need to manually add the message since the server will broadcast it back
  }
  
  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

// Create a method to get WebSocketService instances
let instance: WebSocketService | null = null;

export function getWebSocketService() {
  if (!instance) {
    instance = new WebSocketService();
  }
  return instance;
}