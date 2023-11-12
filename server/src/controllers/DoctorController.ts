import { Request, Response } from "express";
import doctor from "../models/Doctor.js";
import appointment from "../models/appointment.js";
import patient from "../models/Patient.js";
import user from "../models/User.js";
import Contract from "../models/Contract.js";
import fs from 'fs';


const createDoctor = async (req: Request, res: Response) => {
  const data = req.body.datatoserver;
  const dataToServer = JSON.parse(data);
  console.log("im here")
  const entry = user.find({ 'username': dataToServer.username }).then((document) => {
    if (document.length === 0) {

      doctor.find({ 'email': dataToServer.email }).then((emailRes) => {

        if (emailRes.length !== 0)
          res.status(404).send("You are already registered , please sign in ");

        else {
          const files = req.files as Express.Multer.File[];       
          console.log("Files:", files);
          console.log('additional Field: ' + data);
          console.log('additional Field2: ' + dataToServer.name);
          const documents = []; 
          if(files!== undefined){
            for (const file of files){
              const fileInfo = {
                filename: file.originalname,
                path: file.path,
            };
            documents.push(fileInfo);
        }
      }
      console.log("DOCUMENTS: " + JSON.stringify(documents));
      dataToServer.status = "pending";

      dataToServer.files = documents;

      console.log("Modified Data:", JSON.stringify(dataToServer));  
          const newDoctor = doctor
            .create(dataToServer)
            .then((newDoctor) => {
              res.status(200).json(newDoctor);
            })
            .catch((err) => {
              res.status(400).json(err);
            });
        }
      })
    }
    else if (document.length !== 0)
      res.status(400).send("username taken , please choose another one ");
  })
};

const readDoctor = async (req: Request, res: Response) => {
  const pId = req.params.id;
     const doc = await doctor
        .findById(pId)
        .then((doc) => {
            if (!doc || doc === undefined) {
                return res.status(404).json({ message: 'Doctor not found' });
            } else {
                res.status(200).json(doc);
            }
        }).catch((err) => {
            res.status(404).send(err);
        });

};

const isDoctorPending = async (req: Request, res: Response) => {
  const id = req.params.id;
  const doc = doctor
    .find({ "_id": id, "status": { $in: ["pending", "rejected"] } })
    .then((doc) => {
      if (doc.length === 0)
        res.status(400).send("doctor with this ID is not pending any more");
      else
        res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const updateDoctor = async (req: Request, res: Response) => {
  const id = req.params.id;
  const query = { _id: id };
  const email = req.body.email;
  const hourlyRate = req.body.hourlyRate;
  const affiliation = req.body.affiliation;
  const update: { [key: string]: any } = {};

  if (email !== undefined) update["email"] = email;
  if (hourlyRate !== undefined) update["hourlyRate"] = hourlyRate;
  if (affiliation !== undefined) update["affiliation"] = affiliation;

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
      if(doc !==null){
        for(const file of doc.files){
            const filePath = `./src/uploads/` + file.filename;
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: "Error deleting file from server" });
                 }
              })
            }
          }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const listDoctors = async (req: Request, res: Response) => {
  const doctors = doctor
    .find({ "status": "accepted" })
    .then((doctors) => res.status(200).json(doctors))
    .catch((err) => {
      res.status(400).json(err);
    });
};

const listPendingDoctors = async (req: Request, res: Response) => {
  const doctors = doctor
    .find({ "status": "pending" })
    .then((doctors) => res.status(200).json(doctors))
    .catch((err) => {
      res.status(400).json(err);
    });
};

const listDoctorPatients = async (req: Request, res: Response) => {
  const id = req.params.id;


  const appointments = await appointment
    .find({ 'doctor': id })
    .populate('patient')
    .exec();

  console.log(id)

  console.log(appointments)
  const patientIds = appointments.map((appointment) => appointment.patient);
  const patients = await patient.find({ _id: { $in: patientIds } }).exec();

  res.status(200).json(patients);
};

const selectPatient = async (req: Request, res: Response) => {
  const id = req.params.id;
  const pId = req.params.pId;

  const appointments = await appointment
    .find({ 'doctor': id })
    .populate('patient')
    .exec();

  const patientIds = appointments.map((appointment) => appointment.patient);

  const pat = await patient
    .findOne({ _id: pId })
    .exec();

  if (!pat) {
    return res.status(404).json({ message: 'Patient not found' });
  } else {
    res.status(200).json(pat);
  }
};

const listAllMyPatientsUpcoming = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    // Find all upcoming appointments for the doctor with the specified ID
    const upcomingAppointments = await appointment
      .find({ 'doctor': id, "status": "upcoming" }) // Filter by date >= currentDate
      .populate('patient')
      .exec();

    if (!upcomingAppointments || upcomingAppointments.length === 0)
      res.status(404).send("no upcoming appointments found");
    else {
      const patientIds = upcomingAppointments.map((appointment) => appointment.patient);

      const patients = await patient.find({ _id: { $in: patientIds } }).exec();

      res.status(200).json(patients);
    }

  } catch (error) {
    res.status(400).json(error);
  }
};


const listMyPatients = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    // Find all upcoming appointments for the doctor with the specified ID
    const appointments = await appointment
      .find({ 'doctor': id, "status": { $in: ["upcoming", "completed", "rescheduled"] } }) // Filter by date >= currentDate
      .populate('patient')
      .exec();

    if (appointments.length === 0)
      res.status(404).send("no patients found");
    else {
      const patientIds = appointments.map((appointment) => appointment.patient);

      const patients = await patient.find({ _id: { $in: patientIds } }).exec();

      res.status(200).json(patients);
    }

  } catch (error) {
    res.status(400).json(error);
  }
};

const selectPatientByName = async (req: Request, res: Response) => {
  const id = req.params.id;
  const patientName = req.body.patientName.toLowerCase();
  var pIDs: any[] = [];
  var pats: any[] = [];
  try {
    const apts = await appointment.find({ "doctor": id, "status": { $nin: ["canceled"] } });

    if (apts.length === 0) {
      res.status(404).send("no appointments found");
    } else {
      for (const appoint of apts) {
        pIDs.push(appoint.patient);
      }

      const patients = await patient.find({ _id: { $in: pIDs } }).exec();

      for (const pat of patients) {
        if (pat.name.includes(patientName)) {
          pats.push(pat);
        }
      }

      if (pats.length === 0) {
        res.status(404).send("no patients found");
      } else {
        res.status(200).json(pats);
      }
    }
  } catch (err) {
    res.status(400).json(err);
  }
};


const viewWallet = async (req: Request, res: Response) => {
  const dId = req.params.id;

   const doc = await doctor
      .findById(dId)
      .then((doc) => {
          if (!doc || doc === undefined) {
              return res.status(404).json({ message: 'Doctor not found' });
          } else {
              res.status(200).json(doc.wallet);
          }
      }).catch((err) => {
          res.status(404).send(err);
      });
}
const addFreeSlots = async (req: Request, res: Response) => {
  const id = req.params.id;
  const startTime = new Date(req.body.date);
  const currentTime = new Date();
  try {
    if(!startTime || startTime ===undefined){
      return res.status(401).json({ message: 'You have not entered a date.' });
    }
    const doc = await doctor.findById(id);

    if (!doc || doc === undefined) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }

    if (doc.status !== "accepted") {
      return res.status(402).json({ message: 'You have not yet been accepted.' });
    }
   
    if(doc.availableSlotsStartTime){
      for(const dt of doc.availableSlotsStartTime){
        if( dt.toISOString() === startTime.toISOString()){
          return res.status(403).json({ message: 'This slot has already been added.' });
        }
      }
    }
    if (startTime <= currentTime) {
      return res.status(405).json({ message: 'You cannot use a past date.' });
    }

    const appointments = await appointment.find({ doctor: id });

    const conflictingAppointments = [];
    for (const appointment of appointments) {
      const appointmentStartTime = appointment.date;
      const appointmentEndTime = new Date(appointmentStartTime.getTime() + (appointment.duration * 60 * 1000)); 

      if (startTime < appointmentEndTime && startTime >= appointmentStartTime) {
        conflictingAppointments.push(appointment);
      }
    }

    if(conflictingAppointments.length !==0){
      return res.status(406).json({ message: 'You already have an appointment on that date and time' });
    }

    doc.availableSlotsStartTime?.push(startTime);
          
    // Save the updated doctor document
    const savedDoc = await doc.save();

    // Respond with the saved doctor document
    res.status(200).send(savedDoc);
   
  } catch (err) {
    res.status(500).send(err);
  }
};

const acceptContract = async (req: Request, res: Response) => {
  const docId = req.params.id;
  const contractId = req.body.id;

  const contracts = await Contract
    .find({ 'doctor': docId })
    .exec();
  if(contracts.length === 0 || contracts === undefined || !contracts){
    return res.status(404).send("No contracts found for this doctor.");
  }

  for(const contract of contracts){
    if (contract._id.toString() === contractId && contract.status === "pending"){
      contract.status = "accepted";
      try {
        await contract.save();
        break;
      } catch (err) {
        // Handle the error, e.g., log or send an error response.
        console.error(err);
        return res.status(500).send("Error saving the contract.");
      }
    }
  }

  res.status(200).send("Contract accepted successfully.");

}

const rejectContract = async (req: Request, res: Response) => {
  const docId = req.params.id;
  const contractId = req.body.id;

  const contracts = await Contract
    .find({ 'doctor': docId })
    .exec();

  if(contracts.length === 0 || contracts === undefined || !contracts){
    return res.status(404).send("No contracts found for this doctor.");
  }

  for(const contract of contracts){
    if (contract._id.toString() === contractId && contract.status === "pending"){
      contract.status = "rejected";
      await contract.save();
      break;
    }
  }

  res.status(200).send("Contract rejected successfully.");

}


export default {
  createDoctor,
  readDoctor,
  updateDoctor,
  deleteDoctor,
  listDoctors,
  listDoctorPatients,
  selectPatient,
  selectPatientByName,
  listAllMyPatientsUpcoming,
  listMyPatients,
  viewWallet,
  addFreeSlots,
  acceptContract,
  rejectContract,
  listPendingDoctors,
};
