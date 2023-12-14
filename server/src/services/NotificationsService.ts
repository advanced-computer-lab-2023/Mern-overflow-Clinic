
import { Server } from 'socket.io';
import notificationController from '../controllers/NotificationController.js';
import {notificationIO,app} from './Sockets/NotificationsIO.js';

app.post('/notifications', notificationController.createNotification);
app.get('/notifications', notificationController.listNotifiactions);

notificationIO.on('connection', (socket) => {
  console.log('A user connected');

  // You can add more socket events and handling logic here
});
