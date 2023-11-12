import { Request, Response } from "express";
import doctor from "../models/Doctor.js";
import patient from "../models/Patient.js";
import HealthRecords from "../models/HelthRecords.js";
import { error } from "console";

// const createHealthRecord = async (req: Request, res: Response) => {
//     console.log("Iam working")
//     req.body.doctor = req.params.id;
//     console.log(req.body.doctor)
//     req.body.date = Date.now();
//     console.log(req.body)
//     try {
//         console.log("sahskh")
//         const newHealthRecord = await HealthRecords.create(req.body);
//         console.log(req.body)
//         const newHealthRecordId = newHealthRecord._id;
//         const patientEmail = req.body.email;
//         await patient.findByIdAndUpdate(
//             patientEmail,
//             { $push: { healthRecords: newHealthRecordId } }
//         );
//         res.status(200).json(newHealthRecordId);
//     } catch (err) {
//         console.log("-----------------------------------")
//         res.status(400).json(err);
//     }
// }
const createHealthRecord = async (req: Request, res: Response) => {
    console.log("I am working");

    try {
        const patientEmail = req.body.email;
        const patientData = await patient.findOne({ email: patientEmail });

        // If patient not found, return a 404 status
        if (!patientData) {
            return res.status(404).json({ error: "Patient not found" });
        }

        req.body.doctor = req.params.id;
        req.body.date = Date.now();
        req.body.patient = patientData._id;

        console.log(req.body);

        const newHealthRecord = await HealthRecords.create(req.body);
        const newHealthRecordId = newHealthRecord._id;

        // Find the patient by email and update their healthRecords array
        const updatedPatient = await patient.findOneAndUpdate(
            { email: patientEmail },
            { $push: { healthRecords: newHealthRecordId } },
            { new: true } 
        );

        // If patient not found, return a 404 status
        if (!updatedPatient) {
             res.status(404).json({ error: "Patient not found" });
        }

        res.status(200).json(newHealthRecordId);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
};



const readHealthRecord = async (req: Request, res: Response) => {
  const cId = req.params.id;
  const cont = await HealthRecords.findById(cId)
    .then((cont) => {
      if (!cont || cont === undefined) {
        return res.status(404).json({ message: "HealthRecord not found" });
      } else {
        return res.status(200).json(cont);
      }
    })
    .catch((err) => {
      return res.status(404).send(err);
    });
};

const updateHealthRecord = async (req: Request, res: Response) => {};

const deleteHealthRecord = async (req: Request, res: Response) => {
  const id = req.params.id;
  const cont = HealthRecords.findByIdAndDelete({ _id: id })
    .then((cont) => {
      return res.status(200).json(cont);
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
};

const listAllHealthRecords = async (req: Request, res: Response) => {
  const HealthRecordss = HealthRecords.find()
    .then((HealthRecordss) => res.status(200).json(HealthRecordss))
    .catch((err) => {
      return res.status(400).json(err);
    });
};

export default {
  createHealthRecord,
  readHealthRecord,
  updateHealthRecord,
  deleteHealthRecord,
  listAllHealthRecords,
};

