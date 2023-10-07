import appointment from "../models/appointment.js";
import pack from "../models/Package.js";
import patient from "../models/Patient.js";
import { Request, Response } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import app from "../index.js";
import { relative } from "path";
import Doctor from "../models/Doctor.js";

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

const selectDoctor = async (req: Request, res: Response) => {
  const id = req.params.id;   // id patient 
  const dId = req.params.dId;  // id doct

  // Find all appointments where the 'doctor' field matches the doctor's name
  const docs = await Doctor
    .findById(dId) // Assuming 'name' is a unique identifier
    .then((docs) =>{
      if (!docs) {
        // Handle the case where the patient with the given pId doesn't exist
        return res.status(404).json({ message: 'Patient not found' });
      } else{
      res.status(200).json(docs);
      }
    }).catch((err) =>{
      res.status(404).send(err);
    });
};


const selectDoctorByName = async (req:Request, res:Response) => {
  const id = req.params.id;
  const doctorName = req.body.doctorName;
  var dIDs: any[]=[];
  var docs: any[]=[];
  var docs2: any[] =[];
  const speciality = req.body.speciality;
  try{

    const doctors = Doctor
    .find({})
    .then((doctors) => {

      if(doctorName){
        for(const doc of doctors){
          if(doc.name.includes(doctorName))
            docs.push(doc);
        }
        if(docs.length === 0){
          res.status(404).send("no doctors found with this name");
        }
        if(speciality){
          for(const d of docs){
            if(d.speciality.includes(speciality))
              docs2.push(d);
          }
          if(docs2.length === 0){
            res.status(404).send("no doctors found with this speciality");
          }
        }
       
        res.status(200).json(docs2);
      }
      else{
        res.status(400).send("no name entered");
      }

    })
    .catch((err) => {
      res.status(400).json(err);
    });

   
    if(docs.length === 0)
      res.status(404).send("no patients found");

    res.status(200).json(docs);
  }catch(err){
    res.status(400).json(err);
  }

};


const listDoctorsBySessionPrice = async (req: Request, res: Response) => {
  try {
    const pId = req.params.id;
    const patientFound = await patient.findById(pId);

    if (!patientFound) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    else{
      
      if (patientFound.package !== undefined) {
        const packageId = patientFound.package;
        const packageData = await pack.findById(packageId);
      
      const doctors = Doctor
      .find({})
      .then((doctors) => {
      doctors.forEach((doctor) => {
      const sessionPrice = doctor.hourlyRate + (0.1 * doctor.hourlyRate) - packageData!.discountOnDoctorSessions; 
      res.status(200).json(sessionPrice);
    });
      });
     
  }
  else {
    return res.status(404).json({ error: 'Patient not found' });
  }
    }
  } catch (error) {
    res.status(500).json(error);
  }
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
  selectDoctor,
  selectDoctorByName,
  listDoctorsBySessionPrice,
};
