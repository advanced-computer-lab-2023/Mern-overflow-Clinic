import { Request, Response } from "express";
import doctor from "../models/Doctor.js";
import appointment from "../models/appointment.js";
import patient from "../models/Patient.js";
import Patient from "../models/Patient.js";
import { stat } from "fs";




const createAppointment = async (req: Request, res: Response) => {
  req.body.duration = 1;
  req.body.status = "upcoming";
  req.body.appointmentType="regular";
  const newApt = appointment
    .create(req.body)
    .then((newApt) => {
      res.status(200).json(newApt);
    })
    .catch((err) => {
      console.log("error");
      res.status(400).json(err);
    });
};


const createAppointmentForFamilyMember = async (req: Request, res: Response) => {
  console.log(req.body);

  req.body.duration = 1;
  req.body.status = "upcoming"
  req.body.type = "regular"
  const id = req.params.id // patient name;
  const flag = req.body.flag;
  const relation = req.body.relation;
  if(flag){
    console.log("eneterd")
    console.log(req.body)
    req.body.patient = req.body.relativeId
    const newApt = appointment
    .create(req.body)
    .then((newApt) => {
      res.status(200).json(newApt);
    })
    .catch((err) => {
      console.log("error");
      res.status(400).json(err);
    });
  }
  else {
    console.log(req.body)
    const newApt = appointment
    .create(req.body)
    .then((newApt) => {
      res.status(200).json(newApt);
    })
    .catch((err) => {
      console.log("error");
      res.status(400).json(err);
    });
  }
  
}

// const createAppointmentForFamilyMember = async (req: Request, res: Response) => {
//   req.body.duration = 1;
//   req.body.status = "upcoming";
//   req.body.type = "regular";
//   const id = req.params.id; // patient name;
//   const flag = req.body.flag;
//   const relativeId = req.body.relativeId;

//   // Set patient field based on flag and relativeId
//   req.body.patient = flag ? relativeId : id;

//   try {
//     const newApt = await appointment.create(req.body);
//     res.status(200).json(newApt);
//   } catch (err) {
//     console.error(err);
//     res.status(400).json(err);
//   }
// };



const createFollowUp = async (req: Request, res: Response) => {
  req.body.doctor = req.params.id;
  req.body.duration = 1;
  req.body.status = "upcoming";
  req.body.appointmentType = "followup";
  console.log(req.body);
  // 1. Extract the patient's email from req.body
  const patientEmail = req.body.email;

  // 2. Search for the patient with the given email in your database
    Patient.findOne({ email: patientEmail })
    .then((patient) => {
      console.log("getting patient");
      if (!patient) {
        console.log("error here");
        return res.status(404).json({ message: 'Patient not found' });
      }
      console.log(patient._id);
      // 3. If a patient with that email is found, set req.body.patient to the _id of the patient
      req.body.patient = patient._id;

      // 4. Create the follow-up appointment using the updated req.body
      appointment
        .create(req.body)
        .then((newApt) => {
          console.log("success");
          res.status(200).json(newApt);
        })
        .catch((err) => {
          console.log("error");
          res.status(400).json(err);
        });
    })
    .catch((err) => {
      console.log("error");
      res.status(400).json(err);
    });
};

const readAppointment = async (req: Request, res: Response) => {
  const id = req.params.id;
  let today = new Date();
  const apt = appointment
    .findById(id)
    .populate({ path: 'doctor', select: 'name' }).populate({ path: 'patient', select: 'name' })
    .then((apt) => {
      res.status(200).json(apt)
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};


// const updateAppointment = async (req: Request, res: Response) => {
//   const id = req.params.id;
//   const today = new Date();

//   const apt = await appointment
//     .findById({id})
//     .then((apt) => {
//       try {
//         for (const apt of appointment) {
//           const appointmentDate = new Date(apt.date);
//           const today = new Date();
    
//           if (appointmentDate < today && apt.status !== "completed") {
//             apt.status = "completed";
//             await apt.save();
//           }
//         }
//       catch (err) {
//         res.status(500).json({ message: 'Internal server error' });
//       }
//     })
// };
const updateAppointment = async (req: Request, res: Response) => { 
const id = req.params.id
  try {
    const appointments = await appointment.find({});
    
    for (const apt of appointments) {
      const appointmentDate = new Date(apt.date);
      const today = new Date();

      if (appointmentDate < today && apt.status !== "completed") {
        apt.status = "completed";
        await apt.save();
      }
    }

    res.status(200).json({ message: 'Appointments updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};



const deleteAppointment = async (req: Request, res: Response) => {
  const id = req.params.id;
  const apt = appointment
    .findByIdAndDelete({ _id: id })
    .then((apt) => {
      res.status(200).json(apt);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const listAllAppointments = async (req: Request, res: Response) => {
  const apt = appointment
    .find({})
    .populate({ path: 'doctor', select: 'name' }).populate({ path: 'patient', select: 'name' })
    .then((apt) => res.status(200).json(apt))
    .catch((err) => {
      res.status(400).json(err);
    });
};

const filterAppointments = async (req: Request, res: Response) => {

  const status = req.body.status;

  if (req.body.date !== undefined && status !== undefined || (req.body.date && status)) {
    const inputDate = new Date(req.body.date);
    const apt = appointment
      .find({ "date": inputDate, "status": status })
      .populate({ path: 'doctor', select: 'name' }).populate({ path: 'patient', select: 'name' })
      .then((apt) => {

        res.status(200).json(apt)
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
  if ((req.body.date !== undefined && status === undefined) || (req.body.date && !status)) {
    const inputDate = new Date(req.body.date);
    const apt = appointment
      .find({ "date": inputDate })

      .populate({ path: 'doctor', select: 'name' }).populate({ path: 'patient', select: 'name' })
      .then((apt) => {

        res.status(200).json(apt)
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
  if (req.body.date === undefined && status !== undefined || (!req.body.date && status)) {
    const apt = appointment
      .find({ "status": status })

      .populate({ path: 'doctor', select: 'name' }).populate({ path: 'patient', select: 'name' })
      .then((apt) => {

        res.status(200).json(apt)
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }

};



export default {
  createAppointment,
  listAllAppointments,
  readAppointment,
  deleteAppointment,
  filterAppointments,
  updateAppointment,
  createFollowUp,
  createAppointmentForFamilyMember
};

