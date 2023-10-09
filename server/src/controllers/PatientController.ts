import appointment from "../models/appointment.js";
import pack from "../models/Package.js";
import patient from "../models/Patient.js";
import { Request, Response } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import app from "../index.js";
import { relative } from "path";
import doctor from "../models/Doctor.js";

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

  const familyMember = {
    name: req.body.name.toLowerCase(),
    nationalId: req.body.nationalId,
    age: req.body.age,
    gender: req.body.gender.toLowerCase(),
    relation: req.body.relation.toLowerCase(),
  };

  const id = req.params.id;

  try {
    const pat = await patient.findById(id);

    if (!pat) {
      return res.status(404).json({ message: "Patient not found" });
    }else{
      
      const newRelatives = pat.familyMembers;
      if (newRelatives !== undefined) 
        newRelatives.push(familyMember);

      pat.familyMembers = newRelatives;
      await pat.save();

      res.status(200).json(pat);
    }

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
      if (p !== null) 
        res.status(200).json(p.familyMembers);
    })

    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
};

const selectDoctor = async (req: Request, res: Response) => {
  const idd = req.params.id;   
  const dId = req.params.dId;  

  const docs = await doctor
    .findById(dId) 
    .then((docs) =>{
      if (!docs) {
        return res.status(404).json({ message: 'Patient not found' });
      } else{
        res.status(200).json(docs);
      }
    }).catch((err) =>{
      res.status(404).send(err);
    });
};


const selectDoctorByName = async (req: Request, res: Response) => {
  const id = req.params.id;
  const doctorName = req.body.doctorName.toLowerCase();
  var docs: any[] = [];
  var docs2: any[] = [];
  const speciality = req.body.speciality.toLowerCase();
  var spc = false;
  try {
    const doctors = await doctor.find({});

    if (!doctorName) {
      return res.status(400).send("No name entered");
    }else{
      for (const doc of doctors) {
        if (doc.name.includes(doctorName)) {
          docs.push(doc);
        }
      }
  
      if (docs.length === 0) {
        return res.status(404).send("No doctors found with this name");
      }else{
        if (speciality) {
          for (const d of docs) {
            if (d.speciality.includes(speciality)) {
              docs2.push(d);
            }
          }
    
          if (docs2.length === 0) {
            return res.status(404).send("No doctors found with this speciality");
          }else{
            spc = true;
          }
        }

        if(spc){
          res.status(200).json(docs2);
        }else{
          res.status(200).json(docs);
        }
      }
    }
  } catch (err) {
    res.status(400).json(err);
  }
};


const listDoctorsBySessionPrice = async (req: Request, res: Response) => {
  try {
    const pId = req.params.id;
    const patientFound = await patient.findById(pId);
    var docSessDisc = 0;
    
    if (!patientFound) {
      return res.status(404).json({ error: 'Patient not found' });
    }else{
      if (patientFound.package !== undefined) {
        const packageId = patientFound.package;
        const packageData = await pack.findById(packageId);
  
        const doctors = await doctor.find({});
        const sessionPrices = doctors.map((doctor) => {
          if (packageData) {
            docSessDisc = (packageData.discountOnDoctorSessions / 100) * doctor.hourlyRate;
          }
          const sessionPrice = doctor.hourlyRate + 0.1 * doctor.hourlyRate - docSessDisc;
          return { doctorName: doctor.name, sessionPrice };
        });
  
        res.status(200).json(sessionPrices); // Send the response after the loop is done
      } else {
        const doctors = await doctor.find({});
        const sessionPrices = doctors.map((doctor) => {
          const sessionPrice = doctor.hourlyRate + 0.1 * doctor.hourlyRate - docSessDisc;
          return { doctorName: doctor.name, sessionPrice };
        });
  
        res.status(200).json(sessionPrices); // Send the response after the loop is done
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
};


// const filterDoctor = async (req: Request, res: Response) => {
//   const id = req.params.id;
//   const speciality = req.body.speciality.toLowerCase();
//   const dateInput = new Date(req.body.date);
//   const hoursInput = dateInput.getHours();
//   const minutesInput = dateInput.getMinutes();
//   console.log(dateInput.toISOString()); // Ensure dateInput is in ISO format

//   try {
//     const docRes = await doctor.find({ 'speciality': speciality });

//     if (docRes.length === 0) {
//       res.status(404).send("No doctors with this speciality available");
//     } else {
//       if (!dateInput) {
//         res.status(200).send(docRes);
//       } else {
//         var resDocs: any[] = [];
//         var avDocs: any[] = [];

//         for (const doc of docRes) {
//           const appointmentsForDoctor = await appointment
//             .find({ 'doctor': doc._id })
//             .exec();

//           var count = 0;
         
//           for (const apt of appointmentsForDoctor) {
//             // Convert apt.date to ISO string for comparison
//             const startHours = apt.date.getHours();
//             const startMinutes = apt.date.getMinutes();
//             var endHours  = startHours+apt.duration;

//             if (endHours >= 24) {
//               endHours -= 24; // Subtract 24 to wrap around to the next day
//             }

//             if (apt.date.toISOString() === dateInput.toISOString()) {
//               count++;
//             }
//           }

//           if (count === 0) {
//             avDocs.push(doc);
//           }
//         }

//         if (avDocs.length === 0) {
//           res.status(404).send("No doctors within this speciality are available at this date/time");
//         } else {
//           res.status(200).send(avDocs);
//         }
//       }
//     }
//   } catch (err) {
//     res.status(404).send(err);
//   }
// };





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
  filterDoctor
};
