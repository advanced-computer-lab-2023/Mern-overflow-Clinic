import { Request, Response } from "express";
import notification, { INotification } from "../models/Notifications.js";
import { HydratedDocument } from "mongoose";
import { io } from "../index.js";
import { getLoggedUserID } from "../middlewares/permissions/isAuthorized.js";

const createNotification = async (req: Request, res: Response) => {
  const { receiver, content, link } = req.body;
  createNotificationwithId(receiver, content, link);
  return res.status(200).json({ message: "Notification sent" });
};

const createNotificationwithId = async (
  receiver: string,
  content: string,
  link: string
) => {
  const newNotification: HydratedDocument<INotification> = new notification({
    receiver: receiver,
    content: content,
    link: link,
  });
  newNotification.save().then((newNotification) => {
    io.to(receiver).emit("newNotification", newNotification);
  });
};

const readNotification = async (req: Request, res: Response) => {
  return;
};

const listNotifiactions = async (req: Request, res: Response) => {
  const userId = getLoggedUserID(req);
  const Notifications = notification
    .find({ receiver: userId })
    .sort({ createdAt: -1 })
    .then((Notifications) => {
      return res.status(200).json(Notifications);
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
};

export default {
  createNotification,
  //readNotification,
  listNotifiactions,
  createNotificationwithId,
};
