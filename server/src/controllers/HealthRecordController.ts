import { Request, Response } from "express";
import doctor from "../models/Doctor.js";
import patient from "../models/Patient.js";
import HealthRecords from "../models/HelthRecords.js";

const createHealthRecord = async (req: Request, res: Response) => {
  req.body.doctor = req.params.id;
  req.body.date = Date.now();
  try {
    const newHealthRecord = await HealthRecords.create(req.body);
    const newHealthRecordId = newHealthRecord._id;
    const patientId = req.body.patient;
    await patient.findByIdAndUpdate(patientId, {
      $push: { healthRecords: newHealthRecordId },
    });
    return res.status(200).json(newHealthRecordId);
  } catch (err) {
    return res.status(400).json(err);
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

