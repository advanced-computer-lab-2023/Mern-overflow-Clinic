import appointment from "../models/appointment.js";
import pack from "../models/Package.js";
import patient from "../models/Patient.js";
import { Request, Response } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import app from "../index.js";
import { relative } from "path";

const createPatient = async (req: Request, res: Response) => {
  const newPatient = patient
    .create(req.body)
    .then((newPatient) => {
      res.status(200).json(newPatient);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
};

const readPatient = async (req: Request, res: Response) => {};

const updatePatient = async (req: Request, res: Response) => {};

const deletePatient = async (req: Request, res: Response) => {
  const id = req.params.id;
  const pat = patient
    .findByIdAndDelete({ _id: id })
    .then((pat) => {
      res.status(200).json(pat);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const listPatients = async (req: Request, res: Response) => {
  const pat = patient
    .find({})
    .then((pat) => res.status(200).json(pat))
    .catch((err) => {
      res.status(400).json(err);
    });
};

const addFamilyMember = async (req: Request, res: Response) => {
  //TODO rename to family member
  const familyMember = {
    name: req.body.name,
    nationalId: req.body.nationalId,
    age: req.body.age,
    gender: req.body.gender,
    relation: req.body.relation,
  };

  const id = req.params.id;

  try {
    const pat = await patient.findById(id);

    if (!pat) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const newRelatives = pat.familyMembers;
    if (newRelatives !== undefined) newRelatives.push(familyMember);

    pat.familyMembers = newRelatives;
    await pat.save();

    res.json(pat);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const readFamilyMember = async (req: Request, res: Response) => {
  const id = req.params.id;
  const p = patient
    .findById(id)
    .then((p) => {
      if (p !== null) res.status(200).json(p.familyMembers);
    })

    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
};

// const viewRecordOfPatients=async(req: Request, res: Response)=>{

// }

export default {
  createPatient,
  readPatient,
  updatePatient,
  deletePatient,
  addFamilyMember,
  readFamilyMember,
  listPatients,
};
