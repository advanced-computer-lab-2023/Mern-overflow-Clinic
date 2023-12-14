
import { Server } from 'socket.io';
import notificationController from '../controllers/NotificationController.js';
import { notificationIO, app } from './Sockets/NotificationsIO.js';

app.post('/notifications', notificationController.createNotification);
app.get('/notifications', notificationController.listNotifiactions);
notificationIO.on("connection", (socket) => {
	console.log("Connected to socket.io");
	
	socket.on("setup", (userData) => {
		const userId = userData.userId;
		socket.join(userId);
		socket.emit("connected");
	});


	socket.off("setup", (userData:any) => {
		console.log("USER DISCONNECTED");
		socket.leave(userData);
	  });
});