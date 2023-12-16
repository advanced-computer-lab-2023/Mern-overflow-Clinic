import { Types } from 'mongoose';
import Notification from '../../models/Notifications.ts';

describe('notification model', () => {
    test('should throw an error if receiver is missing', async () => {
        const notificationWithoutReceiver = {
            content: 'New message received.',
        };

        const notification = new Notification(notificationWithoutReceiver);
        await expect(notification.save()).rejects.toThrow('Notification validation failed: receiver: Path `receiver` is required.');
    });

    test('should throw an error if content is missing', async () => {
        const notificationWithoutContent = {
            receiver: new Types.ObjectId(),
        };

        const notification = new Notification(notificationWithoutContent);
        await expect(notification.save()).rejects.toThrow('Notification validation failed: content: Path `content` is required.');
    });

    test('should throw an error if content is empty', async () => {
        const notificationWithEmptyContent = {
            receiver: new Types.ObjectId(),
            content: '',
        };

        const notification = new Notification(notificationWithEmptyContent);
        await expect(notification.save()).rejects.toThrow('Notification validation failed: content: Path `content` is required.');
    });

    test('should throw an error if receiver is not provided', async () => {
        const notificationWithoutReceiver = {
            content: 'New message received.',
        };

        const notification = new Notification(notificationWithoutReceiver);
        await expect(notification.save()).rejects.toThrow('Notification validation failed: receiver: Path `receiver` is required.');
    });

    test('should throw an error if content is not provided', async () => {
        const notificationWithoutContent = {
            receiver: new Types.ObjectId(),
        };

        const notification = new Notification(notificationWithoutContent);
        await expect(notification.save()).rejects.toThrow('Notification validation failed: content: Path `content` is required.');
    });
});