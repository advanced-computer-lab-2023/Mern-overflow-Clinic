import { Request, Response } from 'express';
import doctor from '../models/Doctor.js';

const createDoctor = async (req: Request, res: Response) => {
    req.body.status = "pending";
    const newDoctor = doctor.create(req.body)
        .then((newDoctor) => {
            res.status(200).json(newDoctor);
        })
        .catch((err) => {
            console.log("error");
            res.status(400).json(err);
        })
}

const readDoctor = async (req: Request, res: Response) => {
}

const updateDoctor = async (req: Request, res: Response) => {
}

const deleteDoctor = async (req: Request, res: Response) => {
    const id = req.body.id;
    const doc = doctor.findByIdAndDelete({ _id: id })
        .then((doc) => {
            res.status(200).json(doc);
        })
        .catch((err) => {
            res.status(400).json(err);
        })

}

const listDoctors = async (req: Request, res: Response) => {
    const doctors = doctor.find({})
        .then(
            doctors => res.status(200).json(doctors)
        ).catch((err) => {
            res.status(400).json(err);
        })
}

export default {
    createDoctor,
    readDoctor,
    updateDoctor,
    deleteDoctor,
    listDoctors
}