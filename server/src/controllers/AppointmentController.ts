import { Request, Response } from "express";
import doctor from "../models/Doctor.js";
import appointment from "../models/appointment.js";
import patient from "../models/Patient.js";




const createAppointment = async (req: Request, res: Response) => {
    const newApt = appointment
    .create(req.body)
    .then((newApt) => {
        newApt.doctor = req.body.docID;
        newApt.patient = req.body.patID;
        //assuming appointemnts are fixed for 2 hours duration
        newApt.duration = 1;
      res.status(200).json(newApt);
    })
    .catch((err) => {
      console.log("error");
      res.status(400).json(err);
    });
};

const readAppointment = async (req: Request, res: Response) => {
    const id = req.params.id;
    const apt = appointment
    .findById(id)
    .then((apt) => res.status(200).json(apt))
    .catch((err) => {
      res.status(400).json(err);
    });
};


const updateAppointment = async (req: Request, res: Response) => {};


const deleteAppointment = async (req: Request, res: Response) => {
    const id = req.params.id;
    const apt = appointment
    .findByIdAndDelete({ _id: id })
    .then((apt) => {
      res.status(200).json(apt);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const listAllAppointments = async (req: Request, res: Response) => {
    const apt = appointment
    .find({})
    .then((apt) => res.status(200).json(apt))
    .catch((err) => {
      res.status(400).json(err);
    });
};



export default {
    createAppointment,
    listAllAppointments,
    readAppointment,
    deleteAppointment
};
  