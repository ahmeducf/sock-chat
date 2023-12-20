# Sock Chat

Exploring WebSockets with Node.js and Socket.io by creating a simple chat application.

## Features

- HTTP Long Polling fallback for browsers that don't support WebSockets.
- Broadcast a message to connected users when someone connects or disconnects.
- Exactly once message delivery.
- Show who is typing.
- Sync the current state of the chat history when a user reconnects.
- Horizontally scalable: Use `Cluster` Node.js module to take advantage of multi-core systems.

## Try it out

1. Clone the repository.

```bash
git clone git@github.com:ahmeducf/sock-chat.git
```

2. Change directory.

```bash
cd sock-chat
```

3. Install dependencies.

```bash
npm install
```

4. Start the server.

```bash
npm start
```

**N** instances of the server will be started, where **N** is the number of CPU cores available on your system.
Then you can access the application at `http://localhost:300X`. Where `X` is the number of the CPU core.
