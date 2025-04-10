# Vue WebSocket Chat

A real-time chat application built with Vue.js and WebSockets. This application allows multiple users to join a chat room and exchange messages in real-time.

## Features

- Real-time messaging
- Username customization
- Connection status indicators
- System notifications (user join/leave)
- Multi-window chat support
- Automatic reconnection

## Project Structure

- `src/` - Vue application source code
- `server/` - WebSocket server implementation

## Prerequisites

- [Node.js](https://nodejs.org/) (v14.x or higher)
- npm (comes with Node.js)

## Installation

### 1. Install Vue Application Dependencies

```bash
# Navigate to the project root
cd vue-websocket-chat

# Install dependencies
npm install
```

### 2. Install WebSocket Server Dependencies

```bash
# Navigate to the server directory
cd server

# Install server dependencies
npm install

# Return to the project root
cd ..
```

## Running the Application

### 1. Start the WebSocket Server

```bash
# Navigate to the server directory
cd server

# Start the server using node (JavaScript version)
npm start

# OR start using TypeScript directly
npm run start-ts

# You should see: "WebSocket server running on port 8080"
```

### 2. Start the Vue Application

```bash
# Open a new terminal and navigate to the project root
cd vue-websocket-chat

# Start the Vue development server
npm run serve
```

The application should now be available at http://localhost:8080

## Usage

1. Enter your username and click "Join Chat"
2. Start sending messages in the chat window
3. To test multi-user chat, open another browser window/tab and join with a different username
4. Messages will be synchronized in real-time across all connected clients

## Troubleshooting

- **Connection Issues**: Ensure the WebSocket server is running on port 8080
- **Build Errors**: Make sure all dependencies are properly installed
- **ESLint Errors**: You can run `npm run lint -- --fix` to automatically fix some issues

## Development Notes

- The WebSocket service is implemented as a singleton to maintain a single connection
- The server will automatically try to reconnect if the connection is lost
- User sessions persist via localStorage to maintain the username between page reloads