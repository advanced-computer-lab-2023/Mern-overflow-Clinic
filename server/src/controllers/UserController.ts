import appointment from '../models/appointment.js';
import pack from '../models/Package.js';
import patient from '../models/Patient.js';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import app from "../index.js"
import { relative } from 'path';





const createPatient = async (req: Request, res: Response) => {
    const newPatient = patient.create(req.body)
        .then(
            (newPatient) => {
                res.status(200).json(newPatient);
            }
        )
        .catch(
            (err) => {
                console.log(err);
                res.status(400).json(err);
            }
        )
}

const readPatient = async (req: Request, res: Response) => {

}

const updatePatient = async (req: Request, res: Response) => {

}

const deletePatient = async (req: Request, res: Response) => {
    const id = req.body.id;
    const pat = patient.findByIdAndDelete({ _id: id })
        .then((pat) => {
            res.status(200).json(pat);
        })
        .catch((err) => {
            res.status(400).json(err);
        })
}

const listPatients= async(req: Request, res: Response)=>{
    const pat = patient.find({})
        .then(pat => res.status(200).json(pat))
        .catch((err) => {
            res.status(400).json(err);
        })
}

const createRelative = async (req: Request, res: Response) => {
    const relativeP = {
        name: req.body.name,
        mobileNumber: req.body.mobileNumber
    };

    const id = req.params.id;

    try {
        const pat = await (patient.findById(id));

        if (!pat) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const newRelatives = pat.emergencyContact;
        newRelatives.push(relativeP);



        pat.emergencyContact = newRelatives;
        await pat.save();

        res.json(pat);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }






}

const readRelative = async (req: Request, res: Response) => {
    const id = req.params.id;

    const relatives = patient.findById(id)
        .then((relatives) => {
            if (relatives !== null)
                res.status(200).json(relatives.emergencyContact)
        })

        .catch(
            (err) => {
                console.log(err);
                res.status(400).json(err);
            }
        )
}

// const viewRecordOfPatients=async(req: Request, res: Response)=>{

// }


export default {
    createPatient,
    readPatient,
    updatePatient,
    deletePatient,
    createRelative,
    readRelative,
    listPatients
}


