# Sock Chat

Exploring WebSockets with Node.js and Socket.io by creating a simple chat application.

## Features

- Broadcast a message to connected users when someone connects or disconnects.
- Exactly once message delivery.
- Show who is typing.
- Sync the current state of the chat history when a user reconnects.
- Horizontally scalable: Use `Cluster` Node.js module to take advantage of multi-core systems.
