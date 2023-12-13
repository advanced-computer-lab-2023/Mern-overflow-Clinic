import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
export const app = express();
export const server = http.createServer(app);
export const notificationIO = new Server(server);

notificationIO.on('connection', (socket) => {
  console.log('A user connected');

  // You can add more socket events and handling logic here
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
