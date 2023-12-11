import { Request, Response } from "express";
import notification, { INotification } from "../models/Notification.js";
import { HydratedDocument } from "mongoose";


const createNotification = async (req: Request, res: Response) => {
    const { receiver, content } = req.body;
    const newNotification: HydratedDocument<INotification> = new notification({ 'receiver': receiver, 'content': content, 'read': false })
    newNotification.save().then((newNotification) => {
        return res.status(200).json(newNotification);
    }).catch((err) => {
        return res.status(400).json(err);
    });
}

const readNotification = async (req: Request, res: Response) => {
    //     const cId = req.params.id;
    //     const cont = await contract
    //         .findById(cId)
    //         .then((cont) => {
    //             if (!cont || cont === undefined) {
    //                 return res.status(404).json({ message: 'Contract not found' });
    //             } else {
    //                 return res.status(200).json(cont);
    //             }
    //         }).catch((err) => {
    //             return res.status(404).send(err);
    //         });
    return;

}

const listNotifiactions = async (req: Request, res: Response) => {
    // const contracts = contract
    //     .find({ "doctor": req.params.id })
    //     .then((contracts) => res.status(200).json(contracts))
    //     .catch((err) => {
    //         return res.status(400).json(err);
    //     });
    return;
}

export default {
    createNotification,
    readNotification,
    listNotifiactions,
}