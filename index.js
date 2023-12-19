/* eslint-disable import/extensions */
import { createAdapter, setupPrimary } from '@socket.io/cluster-adapter';
import express from 'express';
import cluster from 'node:cluster';
import { createServer } from 'node:http';
import { availableParallelism } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Server } from 'socket.io';
import db from './db.js';

if (cluster.isPrimary) {
  const numCPUs = availableParallelism();
  for (let i = 0; i < numCPUs; i += 1) {
    cluster.fork({
      PORT: 3000 + i,
    });
  }

  setupPrimary();
} else {
  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    connectionStateRecovery: {},
    adapter: createAdapter(),
  });

  const dirnamePath = dirname(fileURLToPath(import.meta.url));
  app.use(express.static(join(dirnamePath, 'public')));

  app.get('/', (req, res) => {
    res.sendFile(join(dirnamePath, 'index.html'));
  });

  io.on('connection', async (socket) => {
    const { nickname } = socket.handshake.auth;
    socket.broadcast.emit('user connected', nickname);

    socket.on('disconnect', () => { 
      socket.broadcast.emit('user disconnected', nickname);
    });
    socket.on('chat message', async (msg, clientOffset, callback) => {
      let result;
      try {
        result = await db.insertRow(msg, clientOffset);
      } catch (e) {
        if (e.errno === 19 /* SQLITE_CONSTRAINT */) {
          callback();
        } else {
          // nothing to do, just let the client retry
          console.log(e);
        }
        return;
      }
      io.emit('chat message', msg, result.lastID);
      callback();
    });

    if (!socket.recovered) {
      try {
        const { serverOffset } = socket.handshake.auth;
        await db.forEachRowWithIdGreaterThan(serverOffset, (_err, row) => {
          if (row) {
            socket.emit('chat message', row.content, row.id);
          }
        });
      } catch (e) {
        console.log(e);
      }
    }
  });

  const port = process.env.PORT;

  server.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
  });
}
