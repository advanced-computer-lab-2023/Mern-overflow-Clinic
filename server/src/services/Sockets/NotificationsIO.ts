import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
export const app = express();
export const server = http.createServer(app);
export const notificationIO = new Server(server, {
	cors: {
		origin: "http://localhost:3000"
	}
});
const PORT = 9000;

notificationIO.on('connection', (socket: Socket) => {
	console.log('A user connected');

	socket.on("setup", (userId) => {
		socket.join(userId);
	});
});
server.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});