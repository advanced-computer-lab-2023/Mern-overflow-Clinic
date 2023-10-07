import { Request, Response } from 'express';
import Prescription from '../models/Prescription.js';
import Patient from '../models/Patient.js';

const createPrescription = async(req:Request, res:Response)=>{
    const newPrescription = Prescription
    .create(req.body)
    .then((newPrescription) => {
      res.status(200).json(newPrescription);
    })
    .catch((err) => {
      console.log("error");
      res.status(400).json(err);
    });
};

const viewPatientPrescription = async(req:Request, res:Response)=>{
    const id = req.params.id
    try {
        const patient = await Patient.findById(id)
        if(patient){
        if (patient.prescriptions) {
            res.status(200).send(patient.prescriptions);
        } else {
            res.status(404).send('Patient not found');
        }
    }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}

const updatePrescription = async(req:Request, res:Response)=>{
    const id = req.params.id;
    const query = { _id: id };
    const filled = req.body.filled;
     const update: { [key: string]: any } = {};
    if (!filled) update["email"] = filled;

  Prescription
    .findOneAndUpdate(query, update, { new: true })
    .then((updatedPrescription) => {
      if (updatedPrescription) {
        res.status(200).send(updatedPrescription);
      }
    })
    .catch((error) => {
      res.status(400).send(error);
    });
}

const deletePrescription = async(req:Request, res:Response)=>{
    const id = req.params.id;
    const prescription = Prescription
      .findByIdAndDelete({ _id: id })
      .then((prescription) => {
        res.status(200).json(prescription);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
}


export default{
    createPrescription,
    viewPatientPrescription,
    updatePrescription,
    deletePrescription
}