const { WebSocketServer } = require('ws');

// Create a WebSocket server on port 8080
const wss = new WebSocketServer({ port: 8080 });

console.log('WebSocket server running on port 8080');

// Keep track of connected users
const connectedUsers = new Map();

// Broadcast a message to all connected clients
function broadcastMessage(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // OPEN
      client.send(JSON.stringify(message));
    }
  });
}

// Create system message
function createSystemMessage(text) {
  return {
    id: `system-${Date.now()}`,
    sender: 'System',
    text,
    timestamp: Date.now(),
    type: 'system'
  };
}

// Handle new connections
wss.on('connection', (ws) => {
  console.log('Client connected');
  connectedUsers.set(ws, { ws });
  
  // Send a welcome message to the new client
  ws.send(JSON.stringify(createSystemMessage(
    'Welcome to the chat! Open another browser window to chat between windows.'
  )));
  
  // Handle incoming messages
  ws.on('message', (data) => {
    try {
      // Parse the message
      const message = JSON.parse(data.toString());
      console.log('Received message:', message);
      
      // If first message from this user, store their username
      const userInfo = connectedUsers.get(ws);
      if (userInfo && !userInfo.username && message.sender) {
        userInfo.username = message.sender;
        
        // Notify others that a new user has joined
        const joinMessage = {
          id: `join-${Date.now()}`,
          sender: 'System',
          text: `${message.sender} has joined the chat`,
          timestamp: Date.now(),
          type: 'join'
        };
        broadcastMessage(joinMessage);
      }
      
      // Broadcast the original message to all connected clients
      broadcastMessage(message);
      
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });
  
  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
    
    // Get the username before removing from the map
    const userInfo = connectedUsers.get(ws);
    if (userInfo && userInfo.username) {
      // Notify others that the user has left
      const leaveMessage = {
        id: `leave-${Date.now()}`,
        sender: 'System',
        text: `${userInfo.username} has left the chat`,
        timestamp: Date.now(),
        type: 'leave'
      };
      broadcastMessage(leaveMessage);
    }
    
    connectedUsers.delete(ws);
  });
});

// Handle server shutdown gracefully
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  wss.close(() => {
    console.log('Server shut down');
    process.exit(0);
  });
});
