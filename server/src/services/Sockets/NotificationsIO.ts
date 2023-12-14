import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
export const app = express();
export const server = http.createServer(app);
const PORT = 3001;
//TODO transfer this to .env
export const notificationIO = new Server(server,{
	pingTimeout: 60000,
	cors: {
		origin: "http://localhost:3001",
	},
})

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
