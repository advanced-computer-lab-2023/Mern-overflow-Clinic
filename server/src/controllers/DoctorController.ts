import { Request, Response } from "express";
import doctor from "../models/Doctor.js";
import appointment from "../models/appointment.js";
import patient from "../models/Patient.js";






const selectPatientByName = async (req: Request, res: Response) => {
  const id = req.params.id;
  const patientName = req.body.patientName;

  try {
    const apts = await appointment.find({ "doctor": id }).exec();
    if (apts.length === 0) {
      return res.status(404).json({ message: "No appointments found" });
    }

    const pIDs = apts.map((appoint) => appoint.patient);
    const patients = await patient.find({ _id: { $in: pIDs } }).exec();

    const matchingPatients = patients.filter((pat) =>
      pat.name.includes(patientName)
    );

    if (matchingPatients.length === 0) {
      return res.status(404).json({ message: "No patients found" });
    }

    res.status(200).json(matchingPatients);
  } catch (err) {
    res.status(400).json(err);
  }
};



const createDoctor = async (req: Request, res: Response) => {
  req.body.status = "pending";
  const newDoctor = doctor
    .create(req.body)
    .then((newDoctor) => {
      res.status(200).json(newDoctor);
    })
    .catch((err) => {
      console.log("error");
      res.status(400).json(err);
    });
};

const readDoctor = async (req: Request, res: Response) => {
  const id = req.params.id;
    const doc = doctor
    .findById(id)
    .then((doc) => res.status(200).json(doc))
    .catch((err) => {
      res.status(400).json(err);
    });
};

const updateDoctor = async (req: Request, res: Response) => {
  const id = req.params.id;

  const query = { _id: id };

  const email = req.body.email;
  const hourlyRate = req.body.hourlyRate;
  const affiliation = req.body.aff;
  const update: { [key: string]: any } = {};
  if (!email) update["email"] = email;
  if (!hourlyRate) update["hourlyRate"] = hourlyRate;

  if (!affiliation) update["affiliation"] = affiliation;

  doctor
    .findOneAndUpdate(query, update, { new: true })
    .then((updatedDoc) => {
      if (updatedDoc) {
        res.status(200).send(updatedDoc);
      }
    })
    .catch((error) => {
      res.status(400).send(error);
    });
};

const deleteDoctor = async (req: Request, res: Response) => {
  const id = req.params.id;
  const doc = doctor
    .findByIdAndDelete({ _id: id })
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const listDoctors = async (req: Request, res: Response) => {
  const doctors = doctor
    .find({})
    .then((doctors) => res.status(200).json(doctors))
    .catch((err) => {
      res.status(400).json(err);
    });
};


const listAllMyPatients = async (req: Request, res: Response) => {
  const id = req.params.id;
  const pId = req.params.pId;

  // Find all appointments where the 'doctor' field matches the doctor's name
  const appointments = await appointment
    .find({ 'doctor': id }) // Assuming 'name' is a unique identifier
    .populate('patient')
    .exec();

  const patientIds = appointments.map((appointment) => appointment.patient);

    // Find all patients with the extracted IDs
  const patients = await patient.find({ _id: { $in: patientIds } }).exec();


  res.status(200).json(patients);
};

const selectPatient = async (req: Request, res: Response) => {
  const id = req.params.id;
  const pId = req.params.pId;

  // Find all appointments where the 'doctor' field matches the doctor's name
  const appointments = await appointment
    .find({ 'doctor': id }) // Assuming 'name' is a unique identifier
    .populate('patient')
    .exec();

  const patientIds = appointments.map((appointment) => appointment.patient);

    // Find all patients with the extracted IDs
  const pat = await patient
  .findOne({ _id: pId })
  .exec();

  if (!pat) {
    // Handle the case where the patient with the given pId doesn't exist
    return res.status(404).json({ message: 'Patient not found' });
  }

  res.status(200).json(pat);
};



export default {
  createDoctor,
  readDoctor,
  updateDoctor,
  deleteDoctor,
  listDoctors,
  listAllMyPatients,
  selectPatient,
  selectPatientByName
};
