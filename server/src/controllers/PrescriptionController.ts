import { Request, Response } from 'express';
import Prescription from '../models/Prescription.js';
import Patient from '../models/Patient.js';

const createPrescription = async (req: Request, res: Response) => {
  try {
    const newPrescriptionData = req.body;
    
    // Set the 'filled' field to 'false' before creating the Prescription
    newPrescriptionData.filled = false;

    const newPrescription = await Prescription.create(newPrescriptionData);
    res.status(200).json(newPrescription);
  } catch (err) {
    console.log("error");
    res.status(400).json(err);
  }
};


const viewPatientPrescription = async(req:Request, res:Response)=>{
    const id = req.params.id
    const pres = Prescription
    .find({})
    .then((pres) => {
      var arr: any[]=[]
      for(const p of pres){
        if(p.patient.toString() === id.toString()){
          arr.push(p);
        }
      }
      res.status(200).json(arr)}
      )
    .catch((err) => {
      res.status(400).json(err);
    });
}

const updatePrescription = async(req:Request, res:Response)=>{
    const id = req.params.id;
    const query = { _id: id };
    const filled = req.body.filled;
     const update: { [key: string]: any } = {};
    if (filled !== undefined) update["filled"] = filled;

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