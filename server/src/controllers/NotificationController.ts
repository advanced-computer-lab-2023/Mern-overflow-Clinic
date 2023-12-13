import { Request, Response } from "express";
import notification, { INotification } from "../models/Notifications.js";
import { HydratedDocument } from "mongoose";
import {notificationIO} from '../services/Sockets/NotificationsIO.js';
import { getLogedUserID } from "../middlewares/permissions/isAuthorized.js";

const createNotification = async (req: Request, res: Response) => {
    const { receiver, content } = req.body;
    const newNotification: HydratedDocument<INotification> = new notification({ 'receiver': receiver, 'content': content, 'read': false })
    newNotification.save().then((newNotification) => {
		notificationIO.emit('newNotification', newNotification);
		
        return res.status(200).json(newNotification);
    }).catch((err) => {
        return res.status(400).json(err);
    });
}

const readNotification = async (req: Request, res: Response) => {
    return;
}

const listNotifiactions = async (req: Request, res: Response) => {
    const  userId  = getLogedUserID(req);
	const Notifications = notification.find({receiver: userId}).sort({createdAt: -1}).then((Notifications) => {	
		return res.status(200).json(Notifications);
	}).catch((err) => {
		return res.status(400).json(err);
	});
}

export default {
    createNotification,
    //readNotification,
    listNotifiactions,
}